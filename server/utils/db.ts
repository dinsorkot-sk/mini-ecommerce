import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from '../db/schema'

export function useDB() {
  const url = process.env.TURSO_DATABASE_URL || process.env.NUXT_HUB_DATABASE_URL || 'file:.data/hub.db'
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.NUXT_HUB_DATABASE_AUTH_TOKEN
  const client = createClient({ url, authToken: authToken || undefined })
  return drizzle(client, { schema })
}
