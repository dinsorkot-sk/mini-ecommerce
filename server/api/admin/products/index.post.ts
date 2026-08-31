import { products, categories } from '../../../db/schema'
import { eq } from 'drizzle-orm'

const productSchema = {
  slug: String,
  name: String
}

export default defineEventHandler(async (event) => {
  // check admin cookie (simple)
  const cookie = getCookie(event, 'admin_session')
  if (cookie !== 'ok') {
    // allow in dev without password for now — comment out to enforce
    // throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { slug, name, description, price, compareAtPrice, stock, categorySlug, images, isActive } = body || {}
  if (!slug || !name || price == null) throw createError({ statusCode: 400, message: 'Missing required fields' })

  const db = useDB()
  let categoryId: number | null = null
  if (categorySlug) {
    const cat = await db.select().from(categories).where(eq(categories.slug, categorySlug)).limit(1)
    if (cat[0]) categoryId = cat[0].id
  }

  const [row] = await db.insert(products).values({
    slug,
    name,
    description: description || '',
    price: Number(price),
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null as unknown as number,
    stock: Number(stock) || 0,
    categoryId,
    images: images || [],
    isActive: isActive ?? true
  }).returning()

  return row
})
