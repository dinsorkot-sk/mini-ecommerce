import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

const seedCategories = [
  { slug: 'apparel', name: 'Apparel' },
  { slug: 'accessories', name: 'Accessories' },
  { slug: 'home', name: 'Home' }
]

// Real product images — Unsplash CDN (shopee-like real photos)
const seedProducts = [
  {
    slug: 'classic-tee-white',
    name: 'เสื้อยืด Classic — ขาว',
    description: 'ผ้าคอตตอน 100% นุ่ม ใส่สบาย ระบายอากาศดี ใส่ได้ทุกวัน ทรงสวยไม่ย้วย',
    price: 59000,
    compareAtPrice: 79000,
    stock: 50,
    categorySlug: 'apparel',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop']
  },
  {
    slug: 'classic-tee-black',
    name: 'เสื้อยืด Classic — ดำ',
    description: 'เสื้อยืดสีดำสุดคลาสสิก ทรงพอดีตัว ใส่ได้ทุกโอกาส',
    price: 59000,
    stock: 30,
    categorySlug: 'apparel',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop']
  },
  {
    slug: 'hoodie-charcoal',
    name: 'เสื้อฮู้ด — สีชาร์โคล',
    description: 'ฮู้ดผ้าฟลีซนุ่ม อุ่นสบาย เหมาะกับอากาศเย็น',
    price: 129000,
    compareAtPrice: 149000,
    stock: 20,
    categorySlug: 'apparel',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop']
  },
  {
    slug: 'cap-canvas',
    name: 'หมวกแก็ปผ้าแคนวาส',
    description: 'หมวกแก็ปทรงสวย ผ้าแคนวาส ปักโลโก้มินิมอล',
    price: 45000,
    stock: 40,
    categorySlug: 'accessories',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop']
  },
  {
    slug: 'tote-natural',
    name: 'กระเป๋า Tote — สีธรรมชาติ',
    description: 'กระเป๋าผ้าแคนวาสหนา ใส่โน้ตบุ๊กได้ จุของได้เยอะ',
    price: 39000,
    stock: 60,
    categorySlug: 'accessories',
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop']
  },
  {
    slug: 'sunglasses-classic',
    name: 'แว่นกันแดด — ทรงคลาสสิก',
    description: 'เลนส์ UV400 กรอบคลาสสิก ใส่แล้วดูดีทุกสไตล์',
    price: 89000,
    stock: 15,
    categorySlug: 'accessories',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop']
  },
  {
    slug: 'mug-ceramic',
    name: 'แก้วมัคเซรามิก 350ml',
    description: 'แก้วเซรามิกผิวด้าน ขนาด 350ml เข้าไมโครเวฟได้',
    price: 32000,
    stock: 80,
    categorySlug: 'home',
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=600&h=600&fit=crop']
  },
  {
    slug: 'desk-mat-felt',
    name: 'แผ่นรองโต๊ะ — ผ้าสักหลาด',
    description: 'แผ่นรองโต๊ะผ้าสักหลาดขนาดใหญ่ กันน้ำ ทำความสะอาดง่าย',
    price: 69000,
    stock: 25,
    categorySlug: 'home',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop']
  },
  {
    slug: 'candle-soy-vanilla',
    name: 'เทียนหอมไขถั่วเหลือง — กลิ่นวานิลลา',
    description: 'เทียนไขถั่วเหลืองธรรมชาติ 180g จุดได้นาน ~45 ชั่วโมง',
    price: 49000,
    stock: 35,
    categorySlug: 'home',
    images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop']
  },
  {
    slug: 'socks-pack',
    name: 'ถุงเท้าแพ็ค 3 คู่',
    description: 'ถุงเท้าผ้าฝ้ายแท้ 3 สี ใส่สบาย ระบายอากาศดี',
    price: 35000,
    compareAtPrice: 45000,
    stock: 100,
    categorySlug: 'apparel',
    images: ['https://images.unsplash.com/photo-1584302052179-2e90841dad6a?w=600&h=600&fit=crop']
  }
]

async function main() {
  const url = process.env.NUXT_HUB_DATABASE_URL || 'file:.data/hub.db'
  const client = createClient({ url })
  const db = drizzle(client, { schema })

  console.log('[seed] seeding to', url)

  const { orderItems, orders, products, categories, settings } = schema
  await client.execute('DELETE FROM order_items')
  await client.execute('DELETE FROM orders')
  await client.execute('DELETE FROM products')
  await client.execute('DELETE FROM categories')
  await client.execute('DELETE FROM settings')

  for (const c of seedCategories) {
    await db.insert(categories).values(c)
  }
  const cats = await db.select().from(categories)
  const catMap = new Map(cats.map(c => [c.slug, c.id]))

  for (const p of seedProducts) {
    const { categorySlug, ...rest } = p
    await db.insert(products).values({
      ...rest,
      categoryId: catMap.get(categorySlug) ?? null,
      images: p.images
    })
  }

  await db.insert(settings).values([
    { key: 'shipping_fee', value: '5000' },
    { key: 'shop_name', value: 'Mini Shop' }
  ])

  const prodCount = await db.select().from(products)
  console.log(`[seed] done: ${cats.length} categories, ${prodCount.length} products`)
  client.close()
}

main().catch((e) => { console.error(e); process.exit(1) })
