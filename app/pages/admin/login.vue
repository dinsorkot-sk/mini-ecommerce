<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const state = reactive({ password: '' })
const loading = ref(false)
const toast = useToast()

async function onLogin() {
  loading.value = true
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: state.password } })
    toast.add({ title: 'เข้าสู่ระบบสำเร็จ', color: 'success' })
    await navigateTo('/admin')
  } catch (e: any) {
    toast.add({ title: 'รหัสผ่านไม่ถูกต้อง', description: e?.data?.message || '', color: 'error' })
  } finally { loading.value = false }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/20 p-4">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="font-bold text-center">
          เข้าสู่ระบบจัดการ
        </h1>
        <p class="text-sm text-muted text-center">
          ใส่รหัสผ่านผู้ดูแล (ตั้งใน NUXT_ADMIN_PASSWORD)
        </p>
      </template>
      <UForm
        :state="state"
        class="space-y-4"
        @submit="onLogin"
      >
        <UFormField
          label="รหัสผ่าน"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            class="w-full"
          />
        </UFormField>
        <UButton
          type="submit"
          block
          :loading="loading"
        >
          เข้าสู่ระบบ
        </UButton>
      </UForm>
      <template #footer>
        <UButton
          to="/"
          variant="ghost"
          block
        >
          กลับหน้าร้าน
        </UButton>
      </template>
    </UCard>
  </div>
</template>
