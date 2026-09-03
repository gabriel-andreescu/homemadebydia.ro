<script setup lang="ts">
import { onMounted, onUnmounted, provide, reactive, useSlots, watch, type VNode } from "vue";
import AppCatalogTabs from "./AppCatalogTabs.vue";
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
  <!-- Padding here, not on the strip, or the rule starts left of the first tab. -->
  <div class="w-full px-2 mb-6">
    <AppCatalogTabs
      class="border-b border-line"
      :tabs="localTabs"
      :selected="selectedTabState.selectedTab"
      @select="selectTab"
    />
  </div>
  <!-- Observed by HomePage to hand the strip over to the masthead. -->
  <div id="catalog-top-sentinel" class="h-0" aria-hidden="true"></div>
  <!-- relative: an outgoing panel is taken out of the flow while it fades. -->
  <div class="relative w-full">
    <slot />
  </div>
</template>
