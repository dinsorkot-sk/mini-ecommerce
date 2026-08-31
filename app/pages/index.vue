<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const search = ref((route.query.search as string) || '')
const category = ref<string | undefined>((route.query.category as string) || undefined)
const sort = ref('newest')
const page = ref(1)

// sync header search -> page search
watch(() => route.query.search, v => { search.value = (v as string) || ''; page.value = 1 })
watch(() => route.query.category, v => { category.value = (v as string) || undefined; page.value = 1 })

const categories = [
  { label: 'ทั้งหมด', value: undefined },
  { label: 'เสื้อผ้า', value: 'apparel' },
  { label: 'กระเป๋า & เครื่องประดับ', value: 'accessories' },
  { label: 'ของใช้ในบ้าน', value: 'home' }
]
const sortOptions = [
  { label: 'แนะนำ', value: 'newest' },
  { label: 'ราคาต่ำ-สูง', value: 'price_asc' },
  { label: 'ราคาสูง-ต่ำ', value: 'price_desc' }
]

const { data, pending } = await useFetch('/api/products', {
  query: computed(() => ({ search: search.value || undefined, category: category.value, sort: sort.value, page: page.value, limit: 12 })),
  watch: [search, category, sort, page]
})

const { addToCart } = useCart()
const toast = useToast()

function onAdd(p: any) {
  addToCart({ productId: p.id, slug: p.slug, name: p.name, price: p.price, image: p.images?.[0] || '', stock: p.stock })
  toast.add({ title: 'เพิ่มลงตะกร้าแล้ว', description: p.name, color: 'success' })
  useState('cart-drawer').value = true
}
</script>

<template>
  <div>
    <!-- Shopee-like banner -->
    <div class="bg-white">
      <UContainer class="py-3">
        <div class="rounded-sm overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-white p-4 md:p-6 flex items-center justify-between">
          <div>
            <h2 class="font-bold text-lg md:text-xl">ช้อปคุ้ม ส่งไว — ลดสูงสุด 50%</h2>
            <p class="text-sm opacity-90 mt-1">สินค้าคุณภาพ • ส่งฟรีเมื่อครบ ฿500 • เก็บโค้ดลดเพิ่ม</p>
          </div>
          <UIcon name="i-lucide-sparkles" class="size-10 opacity-30 hidden md:block" />
        </div>
      </UContainer>
    </div>

    <UContainer class="py-4">
      <!-- Filters — shopee clean -->
      <div class="bg-white rounded-sm border border-[#e8e8e8] p-3 mb-3 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <UInput
          v-model="search"
          placeholder="ค้นหาในร้าน..."
          icon="i-lucide-search"
          size="sm"
          class="flex-1"
          @update:model-value="page = 1"
        />
        <div class="flex gap-2">
          <USelect v-model="category" :items="categories" value-key="value" placeholder="หมวดหมู่" size="sm" class="w-full md:w-48" @update:model-value="page = 1" />
          <USelect v-model="sort" :items="sortOptions" value-key="value" size="sm" class="w-full md:w-40" />
        </div>
      </div>

      <div class="flex items-center justify-between mb-3">
        <h3 class="font-medium text-[#333] text-sm">สินค้าแนะนำ <span v-if="data" class="text-[#999] font-normal">({{ data.total }} รายการ)</span></h3>
        <span v-if="search" class="text-xs text-[#757575]">คำค้น: "{{ search }}"</span>
      </div>

      <div v-if="pending" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3">
        <USkeleton v-for="i in 12" :key="i" class="h-64" />
      </div>

      <div v-else-if="data?.products?.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3">
        <ProductCard v-for="p in data.products" :key="p.id" :product="p" @add="onAdd(p)" />
      </div>

      <div v-else class="bg-white rounded-sm border border-[#e8e8e8] text-center py-16">
        <UIcon name="i-lucide-search-x" class="size-12 mx-auto text-[#999] mb-3" />
        <p class="text-[#757575]">ไม่พบสินค้า</p>
      </div>

      <div v-if="data && data.total > data.limit" class="flex justify-center mt-6">
        <UPagination v-model:page="page" :total="data.total" :items-per-page="data.limit" active-color="primary" />
      </div>
    </UContainer>
  </div>
</template>
