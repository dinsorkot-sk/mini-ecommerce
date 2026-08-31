import { products } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })
  const db = useDB()
  await db.delete(products).where(eq(products.id, id))
  return { ok: true }
})
