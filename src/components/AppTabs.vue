<script setup lang="ts">
import { onMounted, onUnmounted, provide, reactive, ref, useSlots, watch } from "vue";
import { useCatalogTabs } from "../composables/useCatalogTabs";
import { getHash, onHashUpdate } from "../composables/useHash";

const slots = useSlots().default?.();
const localTabs = ref<{ title: string; tabKey: string }[]>([]);

const {
  selectedTab: sharedSelectedTab,
  registerTabs,
  setSelectedTab,
  selectTab: sharedSelectTab,
} = useCatalogTabs();

const selectedTabState = reactive({ selectedTab: "" });
provide("selectedTabState", selectedTabState);

// Sync shared state with local state for slot children
watch(sharedSelectedTab, (val) => {
  selectedTabState.selectedTab = val;
});

function getHashTab(): string | null {
  const hash = getHash();
  return localTabs.value.find((t) => t.tabKey === hash)?.tabKey ?? null;
}

function selectTab(tabKey: string, updateHash = true) {
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
  if (slots) {
    slots.forEach((slot) => {
      localTabs.value.push({
        title: slot.props?.title,
        tabKey: slot.props?.["tab-key"],
      });
    });

    // Check URL hash for initial tab
    const hashTab = getHashTab();
    const initialTab = hashTab ?? localTabs.value[0]?.tabKey;
    selectedTabState.selectedTab = initialTab;

    // Register tabs in shared composable
    registerTabs(localTabs.value);
    setSelectedTab(initialTab);
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
