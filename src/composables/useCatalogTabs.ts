import { ref } from "vue";
import { useScrollTo } from "./useScrollTo";

interface Tab {
  title: string;
  tabKey: string;
}

// Shared state - defined outside function to act as singleton
const tabs = ref<Tab[]>([]);
const selectedTab = ref("");
const catalogInView = ref(false);

export function useCatalogTabs() {
  const { scrollTo } = useScrollTo();

  function registerTabs(newTabs: Tab[]) {
    // Always update tabs array
    tabs.value = [...newTabs];
  }

  function setSelectedTab(tabKey: string) {
    selectedTab.value = tabKey;
  }

  function selectTab(tabKey: string, updateHash = true, scrollToTop = false) {
    selectedTab.value = tabKey;
    if (updateHash) {
      history.replaceState(null, "", `#${tabKey}`);
    }
    if (scrollToTop) {
      scrollTo("catalog");
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
