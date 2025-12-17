import { createI18n } from "vue-i18n";
import ro from "./ro.json";
import en from "./en.json";

export type Locale = "ro" | "en";

const STORAGE_KEY = "locale-preference";

function getBrowserLocale(): Locale {
  const lang = navigator.language.split("-")[0];
  return lang === "en" ? "en" : "ro";
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "ro";
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && ["ro", "en"].includes(stored)) {
    return stored;
  }
  return getBrowserLocale();
}

const initialLocale = getInitialLocale();

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: "ro",
  messages: {
    ro,
    en,
  },
});

// Set initial document title after i18n is created
if (typeof window !== "undefined") {
  document.title = i18n.global.t("meta.title");
}

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
  // Update document title
  document.title = i18n.global.t("meta.title");
}

export function toggleLocale() {
  const current = i18n.global.locale.value as Locale;
  setLocale(current === "ro" ? "en" : "ro");
}

export function getCurrentLocale(): Locale {
  return i18n.global.locale.value as Locale;
}
