import { products, categories } from '../../db/schema'
import { eq, like, and, asc, desc, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const q = getQuery(event)
  const page = Math.max(1, Number(q.page) || 1)
  const limit = Math.min(24, Math.max(1, Number(q.limit) || 12))
  const offset = (page - 1) * limit
  const search = (q.search as string)?.trim()
  const category = q.category as string
  const sort = (q.sort as string) || 'newest'

  const conditions: ReturnType<typeof eq>[] = []
  // only active
  conditions.push(eq(products.isActive, true))

  if (search) {
    conditions.push(like(products.name, `%${search}%`))
  }
  if (category) {
    // join via subquery
    const cat = await db.select().from(categories).where(eq(categories.slug, category)).limit(1)
    if (cat[0]) conditions.push(eq(products.categoryId, cat[0].id))
    else conditions.push(eq(products.categoryId, -1))
  }

  const where = conditions.length ? and(...conditions) : undefined

  let orderBy
  switch (sort) {
    case 'price_asc': orderBy = asc(products.price); break
    case 'price_desc': orderBy = desc(products.price); break
    default: orderBy = desc(products.createdAt)
  }

  const [totalRows, rows] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(products).where(where),
    db.select().from(products).where(where).orderBy(orderBy).limit(limit).offset(offset)
  ])
  const total = totalRows[0]?.count ?? 0
  // parse images if stored as json string via sql mode
  const mapped = rows.map(r => ({
    ...r,
    images: Array.isArray(r.images) ? r.images : (typeof r.images === 'string' ? JSON.parse(r.images as unknown as string) : [])
  }))
  return { products: mapped, total, page, limit }
})
