import { orders, orderItems } from '../../db/schema'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const orderNo = getRouterParam(event, 'orderNo')
  if (!orderNo) throw createError({ statusCode: 400, message: 'Missing orderNo' })
  const db = useDB()
  const rows = await db.select().from(orders).where(eq(orders.orderNo, orderNo)).limit(1)
  const order = rows[0]
  if (!order) throw createError({ statusCode: 404, message: 'Order not found' })
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))
  return { ...order, items }
})
