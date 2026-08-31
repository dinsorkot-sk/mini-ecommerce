<script setup lang="ts">
import { formatPrice } from '~/composables/useCart'
import { checkoutSchema } from '~~/shared/utils/checkout.schema'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: 'default' })

const { cart, subtotal, shippingFee, total, clearCart } = useCart()
const toast = useToast()

if (cart.value.length === 0 && import.meta.client) {
  // allow render but show empty
}

const state = reactive({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingAddress: '',
  paymentMethod: 'cod' as 'cod' | 'transfer'
})

const paymentItems = [
  { label: 'เก็บเงินปลายทาง (COD)', value: 'cod' },
  { label: 'โอนชำระ', value: 'transfer' }
]

const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  if (cart.value.length === 0) {
    toast.add({ title: 'ตะกร้าว่าง', color: 'error' })
    return
  }
  loading.value = true
  try {
    const res = await $fetch('/api/orders', {
      method: 'POST',
      body: {
        ...event.data,
        items: cart.value.map(i => ({ productId: i.productId, qty: i.qty }))
      }
    }) as { orderNo: string }
    clearCart()
    toast.add({ title: 'สั่งซื้อสำเร็จ', description: `เลขที่ ${res.orderNo}`, color: 'success' })
    await navigateTo(`/orders/${res.orderNo}`)
  } catch (e: any) {
    toast.add({ title: 'สั่งซื้อไม่สำเร็จ', description: e?.data?.message || e?.message || 'ลองใหม่', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-8 max-w-5xl">
    <h1 class="text-2xl font-bold mb-6">
      ชำระเงิน
    </h1>

    <div
      v-if="cart.length === 0"
      class="text-center py-12"
    >
      <UIcon
        name="i-lucide-shopping-cart"
        class="size-12 mx-auto text-muted mb-3"
      />
      <p class="text-muted">
        ตะกร้าว่าง — ไปเลือกสินค้าก่อน
      </p>
      <UButton
        to="/"
        class="mt-4"
      >
        ไปหน้าสินค้า
      </UButton>
    </div>

    <div
      v-else
      class="grid md:grid-cols-5 gap-8"
    >
      <!-- Form -->
      <div class="md:col-span-3">
        <UCard>
          <UForm
            :schema="checkoutSchema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField
              label="ชื่อ-นามสกุล"
              name="customerName"
              required
            >
              <UInput
                v-model="state.customerName"
                placeholder="สมชาย ใจดี"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="อีเมล"
              name="customerEmail"
              required
            >
              <UInput
                v-model="state.customerEmail"
                type="email"
                placeholder="you@example.com"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="เบอร์โทร"
              name="customerPhone"
            >
              <UInput
                v-model="state.customerPhone"
                placeholder="08x-xxx-xxxx"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="ที่อยู่จัดส่ง"
              name="shippingAddress"
              required
            >
              <UTextarea
                v-model="state.shippingAddress"
                placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                :rows="3"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="วิธีชำระเงิน"
              name="paymentMethod"
            >
              <USelect
                v-model="state.paymentMethod"
                :items="paymentItems"
                value-key="value"
                class="w-full"
              />
            </UFormField>
            <UButton
              type="submit"
              block
              size="lg"
              :loading="loading"
              icon="i-lucide-credit-card"
            >
              ยืนยันสั่งซื้อ — {{ formatPrice(total) }}
            </UButton>
          </UForm>
        </UCard>
      </div>

      <!-- Summary -->
      <div class="md:col-span-2">
        <UCard>
          <template #header>
            <h3 class="font-semibold">
              สรุปคำสั่งซื้อ ({{ cart.length }} รายการ)
            </h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="item in cart"
              :key="item.productId"
              class="flex justify-between text-sm"
            >
              <span class="truncate pr-2">{{ item.name }} × {{ item.qty }}</span>
              <span class="shrink-0 font-medium">{{ formatPrice(item.price * item.qty) }}</span>
            </div>
            <USeparator />
            <div class="flex justify-between text-sm">
              <span>ยอดรวม</span><span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>ค่าจัดส่ง</span><span>{{ formatPrice(shippingFee) }}</span>
            </div>
            <div class="flex justify-between font-bold">
              <span>รวม</span><span class="text-primary">{{ formatPrice(total) }}</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
