import { orders } from '../../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const status = body?.status as string
  const allowed = ['pending', 'paid', 'shipped', 'completed', 'cancelled']
  if (!status || !allowed.includes(status)) throw createError({ statusCode: 400, message: 'Invalid status' })
  const db = useDB()
  const [row] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning()
  if (!row) throw createError({ statusCode: 404, message: 'Order not found' })
  return row
})
