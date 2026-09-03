<script setup lang="ts">
import { inject } from "vue";
import type { CatalogTabKey } from "../siteNavigation";

defineProps<{
  title: string;
  tabKey: CatalogTabKey;
}>();

const selectedTabState: { selectedTab: CatalogTabKey | "" } | undefined =
  inject("selectedTabState");
</script>

<template>
  <Transition name="tab-panel">
    <div v-if="selectedTabState?.selectedTab === tabKey" class="w-full p-2">
      <slot></slot>
    </div>
  </Transition>
</template>

<style scoped>
.tab-panel-enter-active {
  transition:
    opacity var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out);
}

.tab-panel-leave-active {
  transition: opacity var(--duration-quick) var(--ease-out);
  /* The outgoing panel leaves the flow so the incoming one is not pushed down behind it. */
  position: absolute;
  inset-inline: 0;
}

.tab-panel-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.tab-panel-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tab-panel-enter-active,
  .tab-panel-leave-active {
    transition: none;
  }
}
</style>
