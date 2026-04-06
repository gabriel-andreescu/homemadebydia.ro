<script setup lang="ts">
import { onMounted, onUnmounted, provide, reactive, useSlots, watch, type VNode } from "vue";
import { useCatalogTabs } from "../composables/useCatalogTabs";
import { getHash, onHashUpdate } from "../composables/useHash";
import { useScrollTo } from "../composables/useScrollTo";
import { getKeyFromHash, isCatalogTabKey, type CatalogTabKey } from "../siteNavigation";

interface TabDefinition {
  title: string;
  tabKey: CatalogTabKey;
}

function extractTabs(nodes: VNode[]): TabDefinition[] {
  const tabs: TabDefinition[] = [];

  for (const node of nodes) {
    if (Array.isArray(node.children)) {
      tabs.push(...extractTabs(node.children as VNode[]));
    }

    const title = node.props?.title;
    const tabKey = node.props?.["tab-key"];
    if (typeof title === "string" && isCatalogTabKey(tabKey)) {
      tabs.push({ title, tabKey });
    }
  }

  return tabs;
}

function getDefaultTab(tabs: TabDefinition[]): CatalogTabKey | "" {
  if (tabs.some((tab) => tab.tabKey === "cakes")) {
    return "cakes";
  }

  return tabs[0]?.tabKey ?? "";
}

const localTabs = extractTabs(useSlots().default?.() ?? []);
const defaultTab = getDefaultTab(localTabs);

const {
  selectedTab: sharedSelectedTab,
  registerTabs,
  setSelectedTab,
  selectTab: sharedSelectTab,
} = useCatalogTabs();
const { scrollTo } = useScrollTo();

const selectedTabState = reactive<{ selectedTab: CatalogTabKey | "" }>({ selectedTab: defaultTab });
provide("selectedTabState", selectedTabState);

if (localTabs.length > 0) {
  registerTabs(localTabs);
}

if (defaultTab) {
  setSelectedTab(defaultTab);
}

// Sync shared state with local state for slot children
watch(sharedSelectedTab, (val) => {
  selectedTabState.selectedTab = isCatalogTabKey(val) ? val : "";
});

function getHashTab(): CatalogTabKey | null {
  const hashKey = getKeyFromHash(getHash());
  if (!isCatalogTabKey(hashKey)) return null;
  return localTabs.find((t) => t.tabKey === hashKey)?.tabKey ?? null;
}

function selectTab(tabKey: CatalogTabKey, updateHash = true) {
  selectedTabState.selectedTab = tabKey;
  sharedSelectTab(tabKey, updateHash);
}

function onHashChange() {
  const hashTab = getHashTab();
  if (hashTab) {
    selectTab(hashTab, false);
  }
}

let cleanupHashListener: (() => void) | null = null;

onMounted(() => {
  const hashTab = getHashTab();
  if (hashTab) {
    selectTab(hashTab, false);
    void scrollTo("catalog", false);
  }

  cleanupHashListener = onHashUpdate(onHashChange);
});

onUnmounted(() => {
  cleanupHashListener?.();
});
</script>

<template>
  <ul class="flex justify-center gap-1.5 sm:gap-2 w-full sm:container px-2 mb-4">
    <li
      v-for="tab in localTabs"
      :key="tab.tabKey"
      :class="[
        'px-3 sm:px-5 py-2 sm:py-2.5 rounded-full cursor-pointer font-medium text-xs sm:text-sm tracking-wide transition-all duration-300',
        tab.tabKey === selectedTabState.selectedTab
          ? 'bg-accent dark:bg-accent text-white shadow-md shadow-accent/20 dark:shadow-accent/30 scale-105'
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-accent dark:hover:border-accent hover:text-accent dark:hover:text-accent-light hover:shadow-md',
      ]"
      @click="selectTab(tab.tabKey)"
    >
      {{ tab.title }}
    </li>
  </ul>
  <div class="w-full">
    <slot />
  </div>
</template>
