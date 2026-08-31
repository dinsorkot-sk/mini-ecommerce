<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { data, refresh } = await useFetch('/api/orders')
const toast = useToast()

function formatPrice(s: number) { return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(s / 100) }

const statusOptions = [
  { label: 'รอดำเนินการ', value: 'pending' },
  { label: 'ชำระแล้ว', value: 'paid' },
  { label: 'จัดส่งแล้ว', value: 'shipped' },
  { label: 'เสร็จสิ้น', value: 'completed' },
  { label: 'ยกเลิก', value: 'cancelled' }
]

async function updateStatus(order: any, status: string) {
  try {
    await $fetch(`/api/admin/orders/${order.id}`, { method: 'PATCH', body: { status } })
    toast.add({ title: 'อัปเดตสถานะแล้ว', color: 'success' })
    await refresh()
  } catch (e: any) {
    toast.add({ title: 'ผิดพลาด', description: e?.data?.message || e.message, color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="คำสั่งซื้อ" />
    </template>
    <template #body>
      <div class="p-4">
        <UTable :data="data?.orders || []" :columns="[
          { accessorKey: 'orderNo', header: 'เลขที่' },
          { accessorKey: 'customerName', header: 'ลูกค้า' },
          { accessorKey: 'total', header: 'ยอดรวม' },
          { accessorKey: 'status', header: 'สถานะ' },
          { accessorKey: 'createdAt', header: 'วันที่' },
          { id: 'actions', header: '' }
        ]">
          <template #total-cell="{ row }">{{ formatPrice(row.original.total) }}</template>
          <template #status-cell="{ row }">
            <UBadge :label="row.original.status" variant="soft" />
          </template>
          <template #actions-cell="{ row }">
            <USelect :model-value="row.original.status" :items="statusOptions" value-key="value" size="xs" @update:model-value="updateStatus(row.original, $event)" />
          </template>
        </UTable>
        <p v-if="!data?.orders?.length" class="text-center text-muted py-8">ยังไม่มีคำสั่งซื้อ</p>
      </div>
    </template>
  </UDashboardPanel>
</template>
