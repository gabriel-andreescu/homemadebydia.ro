<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import AppNav from "./AppNav.vue";
import AppCatalogTabs from "./AppCatalogTabs.vue";
import { SCROLL_THRESHOLD } from "../constants";
import { useDarkMode } from "../composables/useDarkMode";
import { useScrollTo } from "../composables/useScrollTo";
import { useCatalogTabs } from "../composables/useCatalogTabs";
import type { CatalogTabKey } from "../siteNavigation";

const { t } = useI18n();
const { isDark } = useDarkMode();
const { scrollTo } = useScrollTo();
const scrolledFromTop = ref(false);

const { tabs, selectedTab, catalogInView, selectTab } = useCatalogTabs();

// Computed to ensure reactivity
const showStickyTabs = computed(() => catalogInView.value && tabs.value.length > 0);

// Selecting from the masthead also scrolls the catalog back into view.
const onSelectStickyTab = (tabKey: CatalogTabKey) => selectTab(tabKey, true, true);

let topObserver: IntersectionObserver | null = null;

onMounted(() => {
  // Replace scroll listener with IntersectionObserver sentinel.
  // This avoids scroll handlers and reduces Lighthouse "forced reflow" attribution.
  const sentinel = document.getElementById("page-top-sentinel");
  if (!sentinel) return;

  topObserver = new IntersectionObserver(
    ([entry]) => {
      // Once we scroll past SCROLL_THRESHOLD, the sentinel will no longer intersect.
      scrolledFromTop.value = !entry.isIntersecting;
    },
    {
      threshold: 0,
      // Expand root upwards by SCROLL_THRESHOLD so the sentinel stays "visible"
      // until we've scrolled that distance.
      rootMargin: `${SCROLL_THRESHOLD}px 0px 0px 0px`,
    },
  );
  topObserver.observe(sentinel);
});

onUnmounted(() => {
  topObserver?.disconnect();
  topObserver = null;
});
</script>

<template>
  <!-- top-0, not the static position: the nav's scroll lock parks the body at -scrollY. -->
  <header
    class="fixed top-0 w-full px-4 lg:px-12 z-30 bg-page/85 backdrop-blur-md border-b border-line"
  >
    <div
      class="container mx-auto flex justify-between items-center transition-[height] duration-[var(--duration-short)]"
      :class="{ 'h-28': !scrolledFromTop, 'h-16': scrolledFromTop }"
    >
      <button @click="scrollTo('')" class="bg-transparent border-none cursor-pointer rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <img
          :src="isDark ? '/logo-dark.svg' : '/logo.svg'"
          :alt="t('accessibility.logo')"
          width="319"
          height="128"
          class="w-auto object-contain transition-[height] duration-[var(--duration-short)] z-50"
          :class="{ 'h-20': !scrolledFromTop, 'h-12': scrolledFromTop }"
        />
      </button>
      <AppNav />
    </div>

    <!-- Sticky catalog tabs -->
    <Transition name="tabs-slide">
      <div
        v-if="showStickyTabs"
        class="border-t border-line"
      >
        <AppCatalogTabs
          class="container mx-auto"
          :tabs="tabs"
          :selected="selectedTab"
          @select="onSelectStickyTab"
        />
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.tabs-slide-enter-active {
  transition:
    opacity var(--duration-base) var(--ease-out) 0.1s,
    transform var(--duration-base) var(--ease-overshoot) 0.1s;
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
