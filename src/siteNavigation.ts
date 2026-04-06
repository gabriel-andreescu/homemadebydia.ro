import type { Locale } from "./i18n";

export type SectionKey =
  | "catalog"
  | "gallery"
  | "aboutUs"
  | "whyUs"
  | "reviews"
  | "howToOrder"
  | "contact";

export type CatalogTabKey = "cakes" | "pastries" | "bakery" | "events";
export type NavigationKey = SectionKey | CatalogTabKey;

export const CATALOG_TAB_KEYS: CatalogTabKey[] = ["cakes", "pastries", "bakery", "events"];

const LOCALIZED_ANCHORS: Record<Locale, Record<NavigationKey, string>> = {
  ro: {
    catalog: "catalog",
    gallery: "galerie",
    aboutUs: "despre-noi",
    whyUs: "de-ce-noi",
    reviews: "recenzii",
    howToOrder: "cum-sa-comanzi",
    contact: "contact",
    cakes: "torturi",
    pastries: "prajituri",
    bakery: "patiserie",
    events: "evenimente",
  },
  en: {
    catalog: "catalog",
    gallery: "gallery",
    aboutUs: "about-us",
    whyUs: "why-us",
    reviews: "reviews",
    howToOrder: "how-to-order",
    contact: "contact",
    cakes: "cakes",
    pastries: "pastries",
    bakery: "bakery",
    events: "events",
  },
};

const LOCALE_PATHS: Record<Locale, string> = {
  ro: "/",
  en: "/en/",
};

export function getLocalePath(locale: Locale): string {
  return LOCALE_PATHS[locale];
}

export function getLocaleFromPath(path: string): Locale {
  return path === "/en" || path.startsWith("/en/") ? "en" : "ro";
}

export function getLocalizedAnchor(key: NavigationKey, locale: Locale): string {
  return LOCALIZED_ANCHORS[locale][key];
}

export function getHashForKey(key: NavigationKey, locale: Locale): string {
  return `#${getLocalizedAnchor(key, locale)}`;
}

export function getKeyFromHash(hash: string): NavigationKey | null {
  const normalizedHash = hash.replace(/^#/, "");
  if (!normalizedHash) return null;

  for (const locale of Object.keys(LOCALIZED_ANCHORS) as Locale[]) {
    for (const [key, localizedHash] of Object.entries(LOCALIZED_ANCHORS[locale])) {
      if (localizedHash === normalizedHash) {
        return key as NavigationKey;
      }
    }
  }

  return null;
}

export function isCatalogTabKey(key: NavigationKey | null): key is CatalogTabKey {
  return key !== null && CATALOG_TAB_KEYS.includes(key as CatalogTabKey);
}
