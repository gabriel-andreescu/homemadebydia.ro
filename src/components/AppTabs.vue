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
      :class="[
        'px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200',
        tab.title === selectedTabState.selectedTab
          ? 'bg-pink-700 text-white'
          : 'bg-pink-300 text-gray-900 hover:bg-pink-500 hover:text-white',
      ]"
      @click="selectedTabState.selectedTab = tab.title"
    >
      {{ tab.title }}
    </li>
  </ul>

  <!--  <hr class="mb-8 mx-auto w-full h-px bg-gray-200 rounded border-0" />-->
  <slot />
</template>

<style scoped></style>
