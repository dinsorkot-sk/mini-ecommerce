import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from '../db/schema'

export function useDB() {
  // Hub abstraction: when running via Nitro with hubDatabase(), would use hubDatabase()
  // For local dev without Nitro, fallback to file DB. Inside Nitro, hubDatabase() is available globally.
  try {
    // @ts-ignore - hubDatabase is injected by @nuxthub/core at runtime
    if (typeof hubDatabase !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return drizzle((hubDatabase as any)(), { schema })
    }
  } catch {}
  const url = process.env.NUXT_HUB_DATABASE_URL || 'file:.data/hub.db'
  const client = createClient({ url })
  return drizzle(client, { schema })
}
