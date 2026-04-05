import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, toggleLocale, type Locale } from '../i18n'

export function useLocale() {
  const { locale } = useI18n()

  const currentLocale = computed(() => locale.value as Locale)
  const isEnglish = computed(() => locale.value === 'en')
  const isRomanian = computed(() => locale.value === 'ro')

  return {
    locale: currentLocale,
    isEnglish,
    isRomanian,
    setLocale,
    toggle: toggleLocale
  }
}

