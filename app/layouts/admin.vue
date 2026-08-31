<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)

const links: NavigationMenuItem[][] = [[
  {
    label: 'แดชบอร์ด',
    icon: 'i-lucide-layout-dashboard',
    to: '/admin',
    onSelect: () => { open.value = false }
  },
  {
    label: 'สินค้า',
    icon: 'i-lucide-package',
    to: '/admin/products',
    onSelect: () => { open.value = false }
  },
  {
    label: 'คำสั่งซื้อ',
    icon: 'i-lucide-receipt',
    to: '/admin/orders',
    onSelect: () => { open.value = false }
  }
], [
  {
    label: 'กลับหน้าร้าน',
    icon: 'i-lucide-store',
    to: '/',
    onSelect: () => { open.value = false }
  }
]]
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="admin"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2 px-2 py-1">
          <UIcon name="i-lucide-store" class="size-6 text-primary shrink-0" />
          <span v-if="!collapsed" class="font-bold truncate">จัดการร้าน</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip />
        <UNavigationMenu :collapsed="collapsed" :items="links[1]" orientation="vertical" tooltip class="mt-auto" />
      </template>

      <template #footer="{ collapsed }">
        <UButton icon="i-lucide-log-out" variant="ghost" color="neutral" :block="!collapsed" @click="navigateTo('/admin/login')">
          <span v-if="!collapsed">ออกจากระบบ</span>
        </UButton>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
