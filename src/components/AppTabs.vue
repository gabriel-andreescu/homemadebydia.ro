<script setup lang="ts">
import { onMounted, onUnmounted, provide, reactive, ref, useSlots, watch, computed } from "vue";
import useEventsBus from "../composables/eventBus";
import { useCatalogTabs } from "../composables/useCatalogTabs";

const slots = useSlots().default?.();
const localTabs = ref<{ title: string; tabKey: string }[]>([]);

const {
  selectedTab: sharedSelectedTab,
  catalogInView,
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
  const hash = window.location.hash.slice(1);
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

  window.addEventListener("hashchange", onHashChange);
});

onUnmounted(() => {
  window.removeEventListener("hashchange", onHashChange);
});

const { bus } = useEventsBus();
watch(
  () => bus.value.get("switchCatalogTab"),
  (data) => {
    const [tabKey] = data ?? [];
    selectTab(tabKey);
  },
);

// Hide original tabs when sticky header tabs are showing
const showTabs = computed(() => !catalogInView.value);
</script>

<template>
  <ul class="flex justify-center gap-1.5 sm:gap-2 w-full sm:container px-2 mb-4">
    <li
      v-for="tab in localTabs"
      :key="tab.tabKey"
      :class="[
        'px-3 sm:px-5 py-2 sm:py-2.5 rounded-full cursor-pointer font-medium text-xs sm:text-sm tracking-wide transition-all duration-300',
        tab.tabKey === selectedTabState.selectedTab
          ? 'bg-accent dark:bg-accent-vivid text-white shadow-md shadow-accent/20 dark:shadow-accent-vivid/30 scale-105'
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-accent dark:hover:border-accent-vivid hover:text-accent dark:hover:text-accent-vivid hover:shadow-md',
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
