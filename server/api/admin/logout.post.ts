export default defineEventHandler(async (event) => {
  deleteCookie(event, 'admin_session')
  return { ok: true }
})
