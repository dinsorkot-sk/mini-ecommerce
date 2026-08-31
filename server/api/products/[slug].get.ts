import { products } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, message: 'Missing slug' })
  const db = useDB()
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1)
  const product = rows[0]
  if (!product || !product.isActive) throw createError({ statusCode: 404, message: 'Product not found' })
  return {
    ...product,
    images: Array.isArray(product.images) ? product.images : (typeof product.images === 'string' ? JSON.parse(product.images as unknown as string) : [])
  }
})
