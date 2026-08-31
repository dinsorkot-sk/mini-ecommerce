// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxthub/core', '@nuxtjs/i18n'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  buildDir: '.nuxt',
  compatibilityDate: '2026-06-30',
  nitro: {
    preset: process.env.NETLIFY || process.env.NITRO_PRESET ? 'netlify' : undefined,
    experimental: { websocket: true }
  },
  hub: {
    db: { dialect: 'sqlite', applyMigrationsDuringBuild: !!process.env.NETLIFY },
    blob: true,
    kv: true,
    cache: true
  },
  eslint: { config: { stylistic: { commaDangle: 'never', braceStyle: '1tbs' } } },
  icon: { clientBundle: { scan: true } },
  colorMode: { preference: 'light', fallback: 'light', storageKey: 'mini-shop-color-mode' },
  i18n: {
    locales: [{ code: 'th', name: 'ไทย' }, { code: 'en', name: 'English' }],
    defaultLocale: 'th',
    strategy: 'no_prefix',
    detectBrowserLanguage: { useCookie: true, cookieKey: 'i18n_lang', redirectOn: 'root' },
    vueI18n: './i18n.config.ts'
  }
})
