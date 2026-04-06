import { useI18n } from "vue-i18n";
import { setHash } from "./useHash";
import type { Locale } from "../i18n";
import {
  getLocalizedAnchor,
  isCatalogTabKey,
  type NavigationKey,
} from "../siteNavigation";

export function useScrollTo() {
  const { locale } = useI18n();

  async function scrollTo(target: NavigationKey | "", updateHash = true) {
    if (typeof window === "undefined") return;

    if (!target) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (updateHash) setHash("");
      return;
    }

    const anchorId = getLocalizedAnchor(target, locale.value as Locale);
    const scrollTargetId = isCatalogTabKey(target)
      ? getLocalizedAnchor("catalog", locale.value as Locale)
      : anchorId;
    const targetElement = document.getElementById(scrollTargetId);

    if (!targetElement) return;

    targetElement.scrollIntoView({ behavior: "smooth" });

    if (updateHash) {
      setHash(anchorId);
    }
  }

  return { scrollTo };
}
