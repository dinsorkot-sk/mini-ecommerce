<script setup lang="ts">
import { formatPrice } from '~/composables/useCart'

definePageMeta({ layout: 'default' })

const route = useRoute()
const orderNo = route.params.orderNo as string
const { data: order, error } = await useFetch(`/api/orders/${orderNo}`)

if (error.value) throw createError({ statusCode: 404, statusMessage: 'ไม่พบคำสั่งซื้อ' })

const statusColor: Record<string, 'warning' | 'success' | 'info' | 'error' | 'neutral'> = {
  pending: 'warning',
  paid: 'info',
  shipped: 'success',
  completed: 'success',
  cancelled: 'error'
}
</script>

<template>
  <UContainer class="py-8 max-w-3xl">
    <div
      v-if="order"
      class="space-y-6"
    >
      <div class="text-center">
        <UIcon
          name="i-lucide-check-circle"
          class="size-16 text-success mx-auto"
        />
        <h1 class="text-2xl font-bold mt-3">
          ขอบคุณสำหรับการสั่งซื้อ!
        </h1>
        <p class="text-muted">
          เลขที่คำสั่งซื้อ <span class="font-mono font-bold text-foreground">{{ order.orderNo }}</span>
        </p>
        <UBadge
          :color="statusColor[order.status] || 'neutral'"
          class="mt-2"
        >
          {{ order.status }}
        </UBadge>
      </div>

      <UCard>
        <template #header>
          <h3 class="font-semibold">
            ข้อมูลจัดส่ง
          </h3>
        </template>
        <div class="text-sm space-y-1">
          <p><span class="text-muted">ชื่อ:</span> {{ order.customerName }}</p>
          <p><span class="text-muted">อีเมล:</span> {{ order.customerEmail }}</p>
          <p v-if="order.customerPhone">
            <span class="text-muted">โทร:</span> {{ order.customerPhone }}
          </p>
          <p><span class="text-muted">ที่อยู่:</span> {{ order.shippingAddress }}</p>
          <p><span class="text-muted">ชำระ:</span> {{ order.paymentMethod === 'cod' ? 'เก็บเงินปลายทาง' : 'โอนชำระ' }}</p>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-semibold">
            รายการสินค้า
          </h3>
        </template>
        <div class="space-y-3">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between text-sm"
          >
            <span>{{ item.productName }} × {{ item.qty }}</span>
            <span class="font-medium">{{ formatPrice(item.price * item.qty) }}</span>
          </div>
          <USeparator />
          <div class="flex justify-between text-sm">
            <span>ยอดรวม</span><span>{{ formatPrice(order.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>ค่าจัดส่ง</span><span>{{ formatPrice(order.shippingFee) }}</span>
          </div>
          <div class="flex justify-between font-bold text-base">
            <span>รวม</span><span class="text-primary">{{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </UCard>

      <div class="flex gap-3 justify-center">
        <UButton
          to="/"
          variant="outline"
        >
          กลับหน้าหลัก
        </UButton>
        <UButton
          to="/admin/orders"
          variant="ghost"
        >
          ดูใน Admin
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
