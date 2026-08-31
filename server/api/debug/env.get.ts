export default defineEventHandler(async () => {
  return {
    hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
    hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
    hasNuxtHubUrl: !!process.env.NUXT_HUB_DATABASE_URL,
    hasNuxtHubToken: !!process.env.NUXT_HUB_DATABASE_AUTH_TOKEN,
    nodeEnv: process.env.NODE_ENV,
    tursoUrlLen: process.env.TURSO_DATABASE_URL?.length || 0,
    tokenLen: process.env.TURSO_AUTH_TOKEN?.length || 0
  }
})
