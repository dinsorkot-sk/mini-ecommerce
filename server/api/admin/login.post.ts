import { z } from 'zod'

const passwordSchema = z.object({ password: z.string().min(1) })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = passwordSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, message: 'Missing password' })

  const expected = process.env.NUXT_ADMIN_PASSWORD || 'admin123'
  if (parsed.data.password !== expected) {
    throw createError({ statusCode: 401, message: 'Invalid password' })
  }

  // simple session cookie (httpOnly)
  setCookie(event, 'admin_session', 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })

  // also set in hubKV if available
  try {
    // @ts-ignore
    if (typeof hubKV !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (hubKV as any)().set('admin_session:ok', '1', { ttl: 60 * 60 * 24 * 7 })
    }
  } catch {}

  return { ok: true }
})
