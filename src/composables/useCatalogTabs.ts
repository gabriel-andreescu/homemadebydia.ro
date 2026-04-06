import { ref } from "vue";
import { useScrollTo } from "./useScrollTo";
import { setHash } from "./useHash";
import { useI18n } from "vue-i18n";
import type { Locale } from "../i18n";
import { getLocalizedAnchor, type CatalogTabKey } from "../siteNavigation";

interface Tab {
  title: string;
  tabKey: CatalogTabKey;
}

// Shared state - defined outside function to act as singleton
const tabs = ref<Tab[]>([]);
const selectedTab = ref("");
const catalogInView = ref(false);

export function useCatalogTabs() {
  const { scrollTo } = useScrollTo();
  const { locale } = useI18n();

  function registerTabs(newTabs: Tab[]) {
    // Always update tabs array
    tabs.value = [...newTabs];
  }

  function setSelectedTab(tabKey: CatalogTabKey) {
    selectedTab.value = tabKey;
  }

  function selectTab(tabKey: CatalogTabKey, updateHash = true, scrollToTop = false) {
    selectedTab.value = tabKey;
    if (updateHash) {
      setHash(getLocalizedAnchor(tabKey, locale.value as Locale));
    }
    if (scrollToTop) {
      // Don't update hash again, we just did it above
      scrollTo("catalog", false);
    }
  }

  function setCatalogInView(inView: boolean) {
    catalogInView.value = inView;
  }

  return {
    tabs,
    selectedTab,
    catalogInView,
    registerTabs,
    setSelectedTab,
    selectTab,
    setCatalogInView,
  };
}
