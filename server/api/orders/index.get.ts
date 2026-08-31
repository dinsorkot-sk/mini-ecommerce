import { orders } from '../../db/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(50)
  return { orders: rows }
})
