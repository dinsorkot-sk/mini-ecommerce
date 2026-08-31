<script setup lang="ts">
import { formatPrice } from '~/composables/useCart'

defineProps<{
  product: {
    id: number
    slug: string
    name: string
    price: number
    compareAtPrice?: number | null
    stock: number
    images: string[]
  }
}>()

const emit = defineEmits<{ add: [] }>()
</script>

<template>
  <div class="group bg-white rounded-sm border border-[#e8e8e8] hover:border-primary hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition overflow-hidden flex flex-col">
    <NuxtLink :to="`/products/${product.slug}`" class="block">
      <div class="aspect-square bg-[#f5f5f5] overflow-hidden relative">
        <img
          :src="product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop'"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        >
        <span v-if="product.compareAtPrice && product.compareAtPrice > product.price" class="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
          -{{ Math.round((1 - product.price / product.compareAtPrice) * 100) }}%
        </span>
      </div>
      <div class="p-2.5">
        <h3 class="text-[13px] leading-4 line-clamp-2 min-h-[32px] text-[#333]">{{ product.name }}</h3>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-[11px] text-primary">฿</span><span class="font-medium text-primary text-[15px]">{{ new Intl.NumberFormat('th-TH').format(product.price / 100) }}</span>
          <span v-if="product.compareAtPrice && product.compareAtPrice > product.price" class="text-[11px] text-[#999] line-through">{{ new Intl.NumberFormat('th-TH').format(product.compareAtPrice / 100) }}</span>
        </div>
        <div class="flex items-center justify-between mt-1.5">
          <span class="text-[11px] text-[#757575]">ขายแล้ว {{ Math.max(0, 100 - product.stock) }} ชิ้น</span>
          <span class="text-[11px]" :class="product.stock > 10 ? 'text-[#757575]' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'">{{ product.stock > 0 ? `เหลือ ${product.stock}` : 'หมด' }}</span>
        </div>
      </div>
    </NuxtLink>
    <div class="px-2.5 pb-2.5 mt-auto">
      <UButton
        block
        size="xs"
        :color="product.stock > 0 ? 'primary' : 'neutral'"
        variant="soft"
        :disabled="product.stock <= 0"
        class="rounded-sm text-xs"
        @click="emit('add')"
      >
        {{ product.stock > 0 ? 'เพิ่มลงตะกร้า' : 'สินค้าหมด' }}
      </UButton>
    </div>
  </div>
</template>
