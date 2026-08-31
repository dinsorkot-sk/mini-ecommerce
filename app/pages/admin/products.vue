<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const toast = useToast()
const { data, refresh } = await useFetch('/api/products', { query: { limit: 100 } })

const showModal = ref(false)
const editing = ref<any>(null)
const form = reactive({
  slug: '',
  name: '',
  description: '',
  price: 0,
  compareAtPrice: null as number | null,
  stock: 0,
  categorySlug: 'apparel',
  images: [] as string[],
  isActive: true
})

const categories = [
  { label: 'Apparel', value: 'apparel' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Home', value: 'home' }
]

function openCreate() {
  editing.value = null
  Object.assign(form, { slug: '', name: '', description: '', price: 59000, compareAtPrice: null, stock: 10, categorySlug: 'apparel', images: ['https://picsum.photos/seed/new/600/600'], isActive: true })
  showModal.value = true
}
function openEdit(p: any) {
  editing.value = p
  Object.assign(form, { slug: p.slug, name: p.name, description: p.description, price: p.price, compareAtPrice: p.compareAtPrice, stock: p.stock, categorySlug: 'apparel', images: p.images, isActive: p.isActive })
  showModal.value = true
}

async function onSubmit() {
  try {
    if (editing.value) {
      await $fetch(`/api/admin/products/${editing.value.id}`, { method: 'PUT', body: form })
      toast.add({ title: 'อัปเดตแล้ว', color: 'success' })
    } else {
      await $fetch('/api/admin/products', { method: 'POST', body: form })
      toast.add({ title: 'เพิ่มสินค้าแล้ว', color: 'success' })
    }
    showModal.value = false
    await refresh()
  } catch (e: any) {
    toast.add({ title: 'ผิดพลาด', description: e?.data?.message || e.message, color: 'error' })
  }
}

async function onDelete(p: any) {
  if (!confirm(`ลบ ${p.name} ?`)) return
  await $fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' })
  await refresh()
  toast.add({ title: 'ลบแล้ว', color: 'success' })
}

function formatPrice(s: number) { return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(s / 100) }
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Products">
        <template #right>
          <UButton
            icon="i-lucide-plus"
            @click="openCreate"
          >
            เพิ่มสินค้า
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="p-4">
        <UTable
          :data="data?.products || []"
          :columns="[
            { accessorKey: 'name', header: 'ชื่อ' },
            { accessorKey: 'price', header: 'ราคา' },
            { accessorKey: 'stock', header: 'สต็อก' },
            { accessorKey: 'slug', header: 'Slug' },
            { id: 'actions', header: '' }
          ]"
        >
          <template #price-cell="{ row }">
            {{ formatPrice(row.original.price) }}
          </template>
          <template #actions-cell="{ row }">
            <div class="flex gap-1">
              <UButton
                size="xs"
                variant="ghost"
                icon="i-lucide-pencil"
                @click="openEdit(row.original)"
              />
              <UButton
                size="xs"
                variant="ghost"
                color="error"
                icon="i-lucide-trash"
                @click="onDelete(row.original)"
              />
            </div>
          </template>
        </UTable>
      </div>

      <UModal
        v-model:open="showModal"
        :title="editing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'"
      >
        <template #body>
          <div class="space-y-3">
            <UFormField
              label="Slug"
              required
            >
              <UInput
                v-model="form.slug"
                placeholder="my-product"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="ชื่อ"
              required
            >
              <UInput
                v-model="form.name"
                class="w-full"
              />
            </UFormField>
            <UFormField label="รายละเอียด">
              <UTextarea
                v-model="form.description"
                :rows="2"
                class="w-full"
              />
            </UFormField>
            <div class="grid grid-cols-2 gap-3">
              <UFormField label="ราคา (สตางค์)">
                <UInput
                  v-model.number="form.price"
                  type="number"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="ราคาเต็ม">
                <UInput
                  v-model.number="form.compareAtPrice"
                  type="number"
                  class="w-full"
                />
              </UFormField>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <UFormField label="สต็อก">
                <UInput
                  v-model.number="form.stock"
                  type="number"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="หมวด">
                <USelect
                  v-model="form.categorySlug"
                  :items="categories"
                  value-key="value"
                  class="w-full"
                />
              </UFormField>
            </div>
            <UFormField label="รูป (URL)">
              <UInput
                v-model="form.images[0]"
                placeholder="https://..."
                class="w-full"
              />
            </UFormField>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="ghost"
              @click="showModal = false"
            >
              ยกเลิก
            </UButton>
            <UButton @click="onSubmit">
              {{ editing ? 'บันทึก' : 'เพิ่ม' }}
            </UButton>
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
