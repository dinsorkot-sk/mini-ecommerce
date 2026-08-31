import { z } from 'zod'

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'กรุณากรอกชื่อ'),
  customerEmail: z.string().email('อีเมลไม่ถูกต้อง'),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(10, 'ที่อยู่สั้นเกินไป'),
  paymentMethod: z.enum(['cod', 'transfer']).default('cod')
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

export const checkoutWithItemsSchema = checkoutSchema.extend({
  items: z.array(z.object({
    productId: z.number().int().positive(),
    qty: z.number().int().min(1).max(99)
  })).min(1, 'ตะกร้าว่าง')
})
