<script setup lang="ts">
import { onMounted, provide, reactive, ref, useSlots, watch } from "vue";
import useEventsBus from "../composables/eventBus";

const slots = useSlots().default?.();
const tabs = ref<{ title: string; tabKey: string }[]>([]);

const selectedTabState = reactive({ selectedTab: "" });
provide("selectedTabState", selectedTabState);

onMounted(() => {
  if (slots) {
    slots.forEach((slot) => {
      tabs.value.push({
        title: slot.props?.title,
        tabKey: slot.props?.["tab-key"],
      });
    });
    selectedTabState.selectedTab = tabs.value[0]?.tabKey;
  }
});

const { bus } = useEventsBus();
watch(
  () => bus.value.get("switchCatalogTab"),
  (data) => {
    const [tabKey] = data ?? [];
    selectedTabState.selectedTab = tabKey;
  }
);
</script>

<template>
  <ul class="flex justify-around w-screen sm:container sm:justify-evenly px-2 mb-2">
    <li
      v-for="tab in tabs"
      :key="tab.tabKey"
      :class="[
        'px-2 py-1 rounded-lg cursor-pointer transition-colors duration-200',
        tab.tabKey === selectedTabState.selectedTab
          ? 'bg-accent text-white'
          : 'bg-accent-light text-white hover:bg-pink-500 hover:text-white',
      ]"
      @click="selectedTabState.selectedTab = tab.tabKey"
    >
      {{ tab.title }}
    </li>
  </ul>
  <slot />
</template>

<style scoped></style>
