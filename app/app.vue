<script setup lang="ts">
const { locale } = useI18n()

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: locale as unknown as string }
})

const title = 'Mini Shop — ช้อปง่าย ส่งไว'
const description = 'Mini e-commerce สไตล์ Shopee — สินค้าคุณภาพ ราคาดี ส่งไว'

useSeoMeta({ title, description })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
