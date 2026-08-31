import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const categories = sqliteTable('categories', {
  id: integer().primaryKey({ autoIncrement: true }),
  slug: text().unique().notNull(),
  name: text().notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const products = sqliteTable('products', {
  id: integer().primaryKey({ autoIncrement: true }),
  slug: text().unique().notNull(),
  name: text().notNull(),
  description: text().notNull().default(''),
  price: integer().notNull(), // stored in satang (THB * 100)
  compareAtPrice: integer('compare_at_price'),
  stock: integer().notNull().default(0),
  categoryId: integer('category_id').references(() => categories.id),
  images: text({ mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const orders = sqliteTable('orders', {
  id: integer().primaryKey({ autoIncrement: true }),
  orderNo: text('order_no').unique().notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone'),
  shippingAddress: text('shipping_address'),
  status: text().notNull().default('pending'),
  paymentMethod: text('payment_method').notNull().default('cod'),
  subtotal: integer().notNull(),
  shippingFee: integer('shipping_fee').notNull().default(0),
  total: integer().notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const orderItems = sqliteTable('order_items', {
  id: integer().primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  productName: text('product_name').notNull(),
  price: integer().notNull(),
  qty: integer().notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
})

export const settings = sqliteTable('settings', {
  key: text().primaryKey(),
  value: text().notNull()
})
