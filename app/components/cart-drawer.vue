<script setup lang="ts">
import { formatPrice } from '~/composables/useCart'

const open = useState<boolean>('cart-drawer', () => false)
const { cart, cartCount, subtotal, total, shippingFee, updateQty, removeFromCart } = useCart()
</script>

<template>
  <USlideover
    v-model:open="open"
    title="ตะกร้าสินค้า"
    description="รายการสินค้าในตะกร้า"
    side="right"
  >
    <template #body>
      <div
        v-if="cart.length === 0"
        class="text-center py-12"
      >
        <UIcon
          name="i-lucide-shopping-bag"
          class="size-12 mx-auto text-muted mb-3"
        />
        <p class="text-muted">
          ตะกร้าว่าง
        </p>
        <UButton
          class="mt-4"
          @click="open = false; navigateTo('/')"
        >
          ไปเลือกสินค้า
        </UButton>
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <div
          v-for="item in cart"
          :key="item.productId"
          class="flex gap-3 border border-default rounded-lg p-3"
        >
          <img
            :src="item.image"
            :alt="item.name"
            class="size-16 rounded object-cover shrink-0"
          >
          <div class="flex-1 min-w-0">
            <p class="font-medium truncate">
              {{ item.name }}
            </p>
            <p class="text-sm text-primary font-bold">
              {{ formatPrice(item.price) }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <UButton
                size="xs"
                variant="outline"
                icon="i-lucide-minus"
                @click="updateQty(item.productId, item.qty - 1)"
              />
              <span class="w-8 text-center text-sm">{{ item.qty }}</span>
              <UButton
                size="xs"
                variant="outline"
                icon="i-lucide-plus"
                @click="updateQty(item.productId, item.qty + 1)"
              />
              <UButton
                size="xs"
                variant="ghost"
                color="error"
                icon="i-lucide-trash"
                class="ml-auto"
                @click="removeFromCart(item.productId)"
              />
            </div>
          </div>
        </div>

        <USeparator />

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>ยอดรวม</span><span>{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>ค่าจัดส่ง</span><span>{{ formatPrice(shippingFee) }}</span>
          </div>
          <div class="flex justify-between font-bold text-base">
            <span>รวมทั้งหมด</span><span class="text-primary">{{ formatPrice(total) }}</span>
          </div>
        </div>

        <UButton
          block
          size="lg"
          icon="i-lucide-credit-card"
          @click="open = false; navigateTo('/checkout')"
        >
          ไปชำระเงิน
        </UButton>
      </div>
    </template>
  </USlideover>
</template>
