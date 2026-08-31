import { defineConfig } from 'drizzle-kit'

const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.NUXT_HUB_DATABASE_URL
const tursoToken = process.env.TURSO_AUTH_TOKEN || process.env.NUXT_HUB_DATABASE_AUTH_TOKEN

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: tursoUrl
    ? { url: tursoUrl, authToken: tursoToken }
    : { url: './.data/hub.db' }
})
