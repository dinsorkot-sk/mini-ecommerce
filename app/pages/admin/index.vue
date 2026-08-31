<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { data } = await useFetch('/api/products', { query: { limit: 100 } })
const { data: ordersData } = await useFetch('/api/orders')

const totalProducts = computed(() => data.value?.total ?? 0)
const totalOrders = computed(() => ordersData.value?.orders?.length ?? 0)
const revenue = computed(() => (ordersData.value?.orders || []).reduce((s: number, o: any) => s + o.total, 0))

function formatPrice(satang: number) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(satang / 100)
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard" />
    </template>
    <template #body>
      <div class="grid md:grid-cols-3 gap-4 p-4">
        <UCard>
          <p class="text-sm text-muted">
            สินค้าทั้งหมด
          </p>
          <p class="text-2xl font-bold mt-1">
            {{ totalProducts }}
          </p>
        </UCard>
        <UCard>
          <p class="text-sm text-muted">
            คำสั่งซื้อ
          </p>
          <p class="text-2xl font-bold mt-1">
            {{ totalOrders }}
          </p>
        </UCard>
        <UCard>
          <p class="text-sm text-muted">
            ยอดขายรวม
          </p>
          <p class="text-2xl font-bold mt-1 text-primary">
            {{ formatPrice(revenue) }}
          </p>
        </UCard>
      </div>

      <div class="p-4 grid md:grid-cols-2 gap-4">
        <UCard>
          <template #header>
            <h3 class="font-semibold">
              Quick actions
            </h3>
          </template>
          <div class="flex flex-wrap gap-2">
            <UButton
              to="/admin/products"
              icon="i-lucide-package"
            >
              จัดการสินค้า
            </UButton>
            <UButton
              to="/admin/orders"
              icon="i-lucide-receipt"
              variant="outline"
            >
              ดูออเดอร์
            </UButton>
            <UButton
              to="/"
              variant="ghost"
              icon="i-lucide-store"
            >
              ไปหน้าร้าน
            </UButton>
          </div>
        </UCard>
        <UCard>
          <template #header>
            <h3 class="font-semibold">
              Recent orders
            </h3>
          </template>
          <div
            v-if="ordersData?.orders?.length"
            class="space-y-2"
          >
            <div
              v-for="o in ordersData.orders.slice(0, 5)"
              :key="o.id"
              class="flex justify-between text-sm border-b border-default pb-2 last:border-0"
            >
              <span class="font-mono">{{ o.orderNo }}</span>
              <span>{{ formatPrice(o.total) }}</span>
              <UBadge
                :label="o.status"
                variant="soft"
                size="xs"
              />
            </div>
          </div>
          <p
            v-else
            class="text-sm text-muted"
          >
            ยังไม่มีออเดอร์
          </p>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
