import { onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { getHash, onHashUpdate } from "./useHash";

const BASE_TITLE = "Homemade by Dia";

export function useDocumentTitle() {
  const { t, locale } = useI18n();

  const titleMap: Record<string, () => string> = {
    "": () => t("meta.title"),
    catalog: () => `${t("sections.catalog")} - ${BASE_TITLE}`,
    torturi: () => `${t("catalog.cakes")} - ${BASE_TITLE}`,
    prajituri: () => `${t("catalog.pastries")} - ${BASE_TITLE}`,
    patiserie: () => `${t("catalog.bakery")} - ${BASE_TITLE}`,
    evenimente: () => `${t("catalog.events")} - ${BASE_TITLE}`,
    galerie: () => `${t("sections.gallery")} - ${BASE_TITLE}`,
    "despre-noi": () => `${t("sections.aboutUs")} - ${BASE_TITLE}`,
    "de-ce-noi": () => `${t("sections.whyUs")} - ${BASE_TITLE}`,
    testimoniale: () => `${t("sections.testimonials")} - ${BASE_TITLE}`,
    "cum-sa-comanzi": () => `${t("nav.howToOrder")} - ${BASE_TITLE}`,
    contact: () => `${t("nav.contact")} - ${BASE_TITLE}`,
  };

  function updateTitle() {
    const hash = getHash();
    const getTitle = titleMap[hash] ?? titleMap[""];
    document.title = getTitle();
  }

  let cleanup: (() => void) | null = null;

  onMounted(() => {
    updateTitle();
    cleanup = onHashUpdate(updateTitle);
  });

  onUnmounted(() => {
    cleanup?.();
  });

  // Update title when locale changes
  watch(locale, updateTitle);
}

