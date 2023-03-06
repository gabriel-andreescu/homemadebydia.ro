<script setup lang="ts">
import { inject } from "vue";

defineProps<{
  title: string;
}>();

const selectedTabState: { selectedTab: string } | undefined = inject("selectedTabState");
</script>

<template>
  <Transition name="slide-fade">
    <div v-show="selectedTabState?.selectedTab === title">
      <slot></slot>
    </div>
  </Transition>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(40px);
  opacity: 0;
}
</style>
