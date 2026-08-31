<script setup lang="ts">
import { formatPrice } from '~/composables/useCart'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = route.params.slug as string
const { data: product, error } = await useFetch(`/api/products/${slug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'ไม่พบสินค้า' })
}

useSeoMeta({
  title: () => product.value ? `${product.value.name} — Mini Shop` : 'สินค้า',
  description: () => product.value?.description || ''
})

const qty = ref(1)
const { addToCart } = useCart()
const toast = useToast()

function onAdd() {
  if (!product.value) return
  addToCart({ productId: product.value.id, slug: product.value.slug, name: product.value.name, price: product.value.price, image: product.value.images?.[0] || '', stock: product.value.stock, qty: qty.value })
  toast.add({ title: 'เพิ่มลงตะกร้าแล้ว', color: 'success' })
  useState('cart-drawer').value = true
}
</script>

<template>
  <UContainer class="py-8">
    <UButton
      to="/"
      variant="ghost"
      icon="i-lucide-arrow-left"
      class="mb-4"
    >
      กลับ
    </UButton>

    <div
      v-if="product"
      class="grid md:grid-cols-2 gap-8"
    >
      <div class="space-y-4">
        <img
          :src="product.images?.[0] || 'https://picsum.photos/seed/placeholder/800/800'"
          :alt="product.name"
          class="w-full aspect-square object-cover rounded-lg border border-default"
        >
        <div
          v-if="product.images?.length > 1"
          class="flex gap-2"
        >
          <img
            v-for="(img, i) in product.images"
            :key="i"
            :src="img"
            class="size-20 object-cover rounded border border-default"
          >
        </div>
      </div>

      <div>
        <h1 class="text-2xl font-bold">
          {{ product.name }}
        </h1>
        <p class="text-muted mt-2">
          {{ product.description }}
        </p>

        <div class="flex items-baseline gap-3 mt-4">
          <span class="text-2xl font-bold text-primary">{{ formatPrice(product.price) }}</span>
          <span
            v-if="product.compareAtPrice && product.compareAtPrice > product.price"
            class="text-muted line-through"
          >{{ formatPrice(product.compareAtPrice) }}</span>
        </div>

        <p
          class="text-sm mt-2"
          :class="product.stock > 0 ? 'text-success' : 'text-error'"
        >
          {{ product.stock > 0 ? `มีสินค้า ${product.stock} ชิ้น` : 'สินค้าหมด' }}
        </p>

        <div class="flex items-center gap-3 mt-6">
          <span class="text-sm">จำนวน</span>
          <UButton
            size="xs"
            variant="outline"
            icon="i-lucide-minus"
            @click="qty = Math.max(1, qty - 1)"
          />
          <UInput
            v-model.number="qty"
            type="number"
            :min="1"
            :max="product.stock"
            class="w-20 text-center"
          />
          <UButton
            size="xs"
            variant="outline"
            icon="i-lucide-plus"
            @click="qty = Math.min(product.stock, qty + 1)"
          />
        </div>

        <UButton
          block
          size="lg"
          icon="i-lucide-shopping-cart"
          class="mt-6"
          :disabled="product.stock <= 0"
          @click="onAdd"
        >
          เพิ่มลงตะกร้า — {{ formatPrice(product.price * qty) }}
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
