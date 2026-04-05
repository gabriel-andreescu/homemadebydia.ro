<script setup lang="ts">
import { inject } from "vue";

defineProps<{
  title: string;
  tabKey: string;
}>();

const selectedTabState: { selectedTab: string } | undefined = inject("selectedTabState");
</script>

<template>
  <div v-if="selectedTabState?.selectedTab === tabKey" class="w-full p-2">
    <slot></slot>
  </div>
</template>
