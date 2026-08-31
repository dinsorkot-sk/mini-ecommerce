import { products, categories } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })
  const body = await readBody(event)
  const db = useDB()

  let categoryId: number | null = null
  if (body.categorySlug) {
    const cat = await db.select().from(categories).where(eq(categories.slug, body.categorySlug)).limit(1)
    if (cat[0]) categoryId = cat[0].id
  } else if (body.categoryId !== undefined) {
    categoryId = body.categoryId
  }

  const updates: Record<string, unknown> = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.slug !== undefined) updates.slug = body.slug
  if (body.description !== undefined) updates.description = body.description
  if (body.price !== undefined) updates.price = Number(body.price)
  if (body.compareAtPrice !== undefined) updates.compareAtPrice = body.compareAtPrice ? Number(body.compareAtPrice) : null
  if (body.stock !== undefined) updates.stock = Number(body.stock)
  if (categoryId !== null || body.categoryId === null) updates.categoryId = categoryId
  if (body.images !== undefined) updates.images = body.images
  if (body.isActive !== undefined) updates.isActive = body.isActive
  updates.updatedAt = new Date().toISOString()

  const [row] = await db.update(products).set(updates as any).where(eq(products.id, id)).returning()
  if (!row) throw createError({ statusCode: 404, message: 'Product not found' })
  return row
})
