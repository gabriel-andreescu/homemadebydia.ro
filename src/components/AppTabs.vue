<script setup lang="ts">
import { onMounted, provide, reactive, ref, useSlots } from "vue";

const slots = useSlots().default?.();
const tabs = ref<{ title: string }[]>([]);

const selectedTabState = reactive({ selectedTab: "" });
provide("selectedTabState", selectedTabState);

onMounted(() => {
  if (slots) {
    slots.forEach((slot) => {
      tabs.value.push({
        title: slot.props?.title,
      });
    });
    selectedTabState.selectedTab = tabs.value[0]?.title;
  }
});
</script>

<template>
  <ul class="flex justify-between w-screen sm:container sm:justify-evenly px-2">
    <li
      v-for="tab in tabs"
      :key="tab.title"
      :class="{ active: tab.title === selectedTabState.selectedTab }"
      @click="selectedTabState.selectedTab = tab.title"
    >
      {{ tab.title }}
    </li>
  </ul>

  <hr class="mb-8 mx-auto w-full h-px bg-gray-200 rounded border-0" />
  <slot />
</template>

<style scoped>
ul li {
  @apply py-2 cursor-pointer transition-colors duration-200;
}

ul li.active {
  @apply border-b-2 pb-2 border-accent;
}
</style>
