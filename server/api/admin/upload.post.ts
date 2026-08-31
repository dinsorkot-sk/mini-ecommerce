export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  if (!form || form.length === 0) throw createError({ statusCode: 400, message: 'No file' })
  const file = form[0]
  if (!file) throw createError({ statusCode: 400, message: 'No file' })

  // Validate mime
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (file.type && !allowed.includes(file.type)) {
    throw createError({ statusCode: 400, message: 'Invalid file type' })
  }
  if (file.data.length > 5 * 1024 * 1024) throw createError({ statusCode: 413, message: 'File too large (max 5MB)' })

  // Try hubBlob, fallback to returning data URL for dev
  try {
    // @ts-ignore
    if (typeof hubBlob !== 'undefined') {
      const key = `products/${Date.now()}-${file.filename || 'upload'}`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (hubBlob as any)().put(key, file.data, { contentType: file.type })
      return { url: key, key }
    }
  } catch {}

  // fallback: return as data URL (for local without blob)
  const base64 = file.data.toString('base64')
  return { url: `data:${file.type};base64,${base64}` }
})
