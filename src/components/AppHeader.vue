<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import AppNav from "./AppNav.vue";
import { SCROLL_THRESHOLD } from "../constants";
import { useDarkMode } from "../composables/useDarkMode";
import { useScrollTo } from "../composables/useScrollTo";
import { useCatalogTabs } from "../composables/useCatalogTabs";

const { t } = useI18n();
const { isDark } = useDarkMode();
const { scrollTo } = useScrollTo();
const scrolledFromTop = ref(false);

const { tabs, selectedTab, catalogInView, selectTab } = useCatalogTabs();

// Computed to ensure reactivity
const showStickyTabs = computed(() => catalogInView.value && tabs.value.length > 0);

onMounted(() => {
  scrolledFromTop.value = window.scrollY >= SCROLL_THRESHOLD;
  window.addEventListener(
    "scroll",
    () => {
      scrolledFromTop.value = window.scrollY >= SCROLL_THRESHOLD;
    },
    { passive: true },
  );
});
</script>

<template>
  <header class="fixed bg-white dark:bg-gray-900 w-full px-4 lg:px-12 z-10">
    <div
      class="container mx-auto flex justify-between items-center transition-[height] duration-200"
      :class="{ 'h-32': !scrolledFromTop, 'h-16': scrolledFromTop }"
    >
      <button @click="scrollTo('')" class="bg-transparent border-none cursor-pointer">
        <img
          :src="isDark ? '/logo-dark.svg' : '/logo.svg'"
          :alt="t('accessibility.logo')"
          class="h-32 transform transition duration-200 pt-2 z-50"
          :class="{ 'scale-100': !scrolledFromTop, 'scale-50': scrolledFromTop }"
        />
      </button>
      <AppNav />
    </div>

    <!-- Sticky catalog tabs -->
    <Transition name="tabs-slide">
      <div
        v-if="showStickyTabs"
        class="sm:mt-2 border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
      >
        <ul class="container mx-auto flex justify-center gap-1.5 sm:gap-2 pt-3 pb-2.5 sm:py-2.5">
          <li
            v-for="tab in tabs"
            :key="tab.tabKey"
            :class="[
              'px-3 sm:px-5 py-1.5 sm:py-2 rounded-full cursor-pointer font-medium text-xs sm:text-sm tracking-wide transition-all duration-300',
              tab.tabKey === selectedTab
                ? 'bg-accent dark:bg-accent-vivid text-white shadow-md shadow-accent/20 dark:shadow-accent-vivid/30 scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-accent dark:hover:border-accent-vivid hover:text-accent dark:hover:text-accent-vivid hover:shadow-md',
            ]"
            @click="selectTab(tab.tabKey, true, true)"
          >
            {{ tab.title }}
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.tabs-slide-enter-active {
  transition:
    opacity 0.25s ease-out 0.1s,
    transform 0.3s cubic-bezier(0.34, 1.3, 0.64, 1) 0.1s;
}

/* Instant hide */
.tabs-slide-leave-active {
  transition: none;
}

.tabs-slide-enter-from {
  opacity: 0;
  transform: translateY(-1rem);
}

.tabs-slide-leave-to {
  opacity: 0;
}
</style>
