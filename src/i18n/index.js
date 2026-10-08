import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import pt from './pt.json'
import { readStored } from '../lib/storage'

export const LANGUAGES = ['en', 'pt']

const savedLang = typeof window !== 'undefined' ? readStored('lang') : null
const browserLang = typeof navigator !== 'undefined' && navigator.language?.startsWith('pt') ? 'pt' : 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt },
    },
    // Only trust a saved value that is a language we actually have.
    lng: LANGUAGES.includes(savedLang) ? savedLang : browserLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

// Keep the page's language and title in step with the chosen language: screen readers pick the
// voice from <html lang>, and the browser tab shows the title.
const syncDocument = (lng) => {
  document.documentElement.lang = lng
  document.title = i18n.t('meta.title')
}
i18n.on('languageChanged', syncDocument)
syncDocument(i18n.language)

export default i18n
