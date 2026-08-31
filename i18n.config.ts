import th from './locales/th.json'
import en from './locales/en.json'

export default defineI18nConfig(() => ({
  legacy: false,
  messages: { th, en }
}))
