<script setup lang="ts">
const cartDrawer = useState<boolean>('cart-drawer', () => false)
const { cartCount } = useCart()
const route = useRoute()

const tabItems = [
  { label: 'แนะนำ', value: 'all' },
  { label: 'เสื้อผ้า', value: 'apparel' },
  { label: 'กระเป๋า & เครื่องประดับ', value: 'accessories' },
  { label: 'ของใช้ในบ้าน', value: 'home' }
]
const activeTab = computed({
  get: () => (route.query.category as string) || 'all',
  set: (v: string) => {
    if (v === 'all') navigateTo({ path: '/', query: { ...route.query, category: undefined } })
    else navigateTo({ path: '/', query: { ...route.query, category: v } })
  }
})

const searchQuery = ref('')
function onSearch() {
  navigateTo({ path: '/', query: { search: searchQuery.value || undefined } })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f5f5f5]">
    <!-- Shopee-like Header -->
    <header class="sticky top-0 z-40 bg-primary shadow-sm">
      <UContainer class="flex items-center gap-4 h-[72px] md:h-[84px]">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 text-white shrink-0">
          <div class="bg-white rounded-lg size-9 flex items-center justify-center">
            <UIcon name="i-lucide-store" class="size-6 text-primary" />
          </div>
          <span class="font-bold text-xl hidden md:block tracking-tight">Mini Shop</span>
        </NuxtLink>

        <!-- Search bar — Shopee style -->
        <div class="flex-1 max-w-[840px] mx-2 md:mx-6">
          <div class="flex bg-white rounded-sm p-1 gap-1">
            <UInput
              v-model="searchQuery"
              placeholder="ค้นหาสินค้า แบรนด์ หรือหมวดหมู่"
              variant="none"
              class="flex-1 [&_input]:px-3 [&_input]:py-2"
              @keydown.enter="onSearch"
            />
            <UButton color="primary" class="bg-primary hover:bg-[#d73211] rounded-sm px-6" icon="i-lucide-search" @click="onSearch">
              <span class="hidden md:inline">ค้นหา</span>
            </UButton>
          </div>
        </div>

        <!-- Cart — UButton + UChip -->
        <UChip :show="cartCount > 0" :text="cartCount > 99 ? '99+' : String(cartCount)" color="info" class="ring-none" size="3xl">
          <UButton icon="i-lucide-shopping-cart" variant="ghost" size="lg" class="text-white hover:bg-white/10 hover:text-white" aria-label="ตะกร้า" @click="cartDrawer = true" />
        </UChip>
      </UContainer>
    </header>

    <!-- Category — UTabs (pill) -->
    <div class="bg-white border-b border-[#e8e8e8]">
      <UContainer class="h-auto">
        <UTabs v-model="activeTab" :items="tabItems" :ui="{ list: 'bg-transparent gap-2 py-2', indicator: 'bg-primary'}" />
      </UContainer>
    </div>

    <!-- Main -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-[#e8e8e8] mt-8">
      <UContainer class="py-8">
        <div class="grid md:grid-cols-4 gap-6 text-sm">
          <div>
            <h4 class="font-bold mb-2">Mini Shop</h4>
            <p class="text-[#757575] text-xs leading-relaxed">ช้อปง่าย ส่งไว — สินค้าคุณภาพ ราคาดี การันตีความพึงพอใจ</p>
          </div>
          <div>
            <h4 class="font-bold mb-2">บริการลูกค้า</h4>
            <ul class="space-y-1 text-xs text-[#757575]"><li>ศูนย์ช่วยเหลือ</li><li>การคืนสินค้า</li><li>ติดต่อเรา</li></ul>
          </div>
          <div>
            <h4 class="font-bold mb-2">ชำระเงิน</h4>
            <div class="flex flex-wrap gap-2">
              <span class="inline-flex items-center gap-1.5 h-7 px-2.5 bg-white border border-[#e8e8e8] rounded text-xs font-medium text-[#333]"><UIcon name="i-lucide-truck" class="size-3.5 text-primary" /> เก็บปลายทาง</span>
              <span class="inline-flex items-center gap-1.5 h-7 px-2.5 bg-white border border-[#e8e8e8] rounded text-xs font-medium text-[#333]"><UIcon name="i-lucide-building-2" class="size-3.5 text-[#26a17b]" /> โอนธนาคาร</span>
              <span class="inline-flex items-center gap-1.5 h-7 px-2.5 bg-white border border-[#e8e8e8] rounded text-xs font-medium text-[#333]"><UIcon name="i-lucide-qr-code" class="size-3.5 text-[#0b5ed7]" /> พร้อมเพย์</span>
              <span class="inline-flex items-center gap-1.5 h-7 px-2.5 bg-white border border-[#e8e8e8] rounded text-xs font-medium text-[#333]"><UIcon name="i-lucide-credit-card" class="size-3.5 text-[#333]" /> บัตรเครดิต</span>
            </div>
            <p class="text-[11px] text-[#999] mt-2">รองรับ COD / โอน / PromptPay QR</p>
          </div>
          <div>
            <h4 class="font-bold mb-2">ติดตามเรา</h4>
            <div class="flex gap-2 text-[#757575]"><UIcon name="i-simple-icons-facebook" class="size-5" /><UIcon name="i-simple-icons-instagram" class="size-5" /><UIcon name="i-simple-icons-x" class="size-5" /></div>
          </div>
        </div>
        <div class="text-center text-xs text-[#999] mt-8 pt-6 border-t border-[#e8e8e8]">
          © {{ new Date().getFullYear() }} Mini Shop — Nuxt + Nuxt UI + NuxtHub
        </div>
      </UContainer>
    </footer>

    <CartDrawer />
  </div>
</template>

<style>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>
