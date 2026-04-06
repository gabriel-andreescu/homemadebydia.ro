import { createI18n } from "vue-i18n";
import ro from "./ro.json";
import en from "./en.json";

export type Locale = "ro" | "en";

const STORAGE_KEY = "locale-preference";
const FALLBACK_LOCALE: Locale = "ro";

const messages = {
  ro,
  en,
} as const;

export function createI18nInstance(initialLocale: Locale = FALLBACK_LOCALE) {
  return createI18n({
    legacy: false,
    locale: initialLocale,
    fallbackLocale: FALLBACK_LOCALE,
    messages,
  });
}

export type AppI18n = ReturnType<typeof createI18nInstance>;

export function applyLocale(i18n: AppI18n, locale: Locale, persist = false) {
  i18n.global.locale.value = locale;

  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }

  if (persist && typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, locale);
  }
}

export function rememberLocalePreference(locale: Locale) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, locale);
}
