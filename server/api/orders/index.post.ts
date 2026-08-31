import { orders, orderItems, products, settings } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { generateOrderNo } from '../../utils/orderNo'
import { checkoutWithItemsSchema } from '~~/shared/utils/checkout.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = checkoutWithItemsSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.issues[0]?.message || 'Invalid input' })
  }
  const { items, ...customer } = parsed.data
  const db = useDB()

  // Fetch products
  const productIds = items.map(i => i.productId)
  const dbProducts = await db.select().from(products).where(eq(products.id, productIds[0] as unknown as number))
  // drizzle eq with array not supported, do manual
  const allProducts = await Promise.all(productIds.map(id => db.select().from(products).where(eq(products.id, id)).limit(1).then(r => r[0])))
  const productMap = new Map(allProducts.filter(Boolean).map(p => [p.id, p]))

  for (const item of items) {
    const p = productMap.get(item.productId)
    if (!p) throw createError({ statusCode: 404, message: `Product ${item.productId} not found` })
    if (!p.isActive) throw createError({ statusCode: 400, message: `${p.name} is unavailable` })
    if (p.stock < item.qty) throw createError({ statusCode: 409, message: `${p.name} stock insufficient (available ${p.stock})` })
  }

  // Calculate totals
  let subtotal = 0
  for (const item of items) {
    const p = productMap.get(item.productId)!
    subtotal += p.price * item.qty
  }
  // shipping fee from settings
  let shippingFee = 5000
  try {
    const s = await db.select().from(settings).where(eq(settings.key, 'shipping_fee')).limit(1)
    if (s[0]) shippingFee = Number(s[0].value)
  } catch {}
  const total = subtotal + shippingFee
  const orderNo = generateOrderNo()

  // Insert order + items + decrement stock (sequentially, no transaction for sqlite file simplicity)
  const [order] = await db.insert(orders).values({
    orderNo,
    customerName: customer.customerName,
    customerEmail: customer.customerEmail,
    customerPhone: customer.customerPhone || null as unknown as string,
    shippingAddress: customer.shippingAddress,
    paymentMethod: customer.paymentMethod,
    status: 'pending',
    subtotal,
    shippingFee,
    total
  }).returning()

  for (const item of items) {
    const p = productMap.get(item.productId)!
    await db.insert(orderItems).values({
      orderId: order.id,
      productId: p.id,
      productName: p.name,
      price: p.price,
      qty: item.qty
    })
    await db.update(products).set({ stock: p.stock - item.qty, updatedAt: new Date().toISOString() }).where(eq(products.id, p.id))
  }

  return { orderId: order.id, orderNo: order.orderNo, total }
})
