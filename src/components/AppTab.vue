<script setup lang="ts">
import { inject } from "vue";

defineProps<{
  title: string;
}>();

const selectedTabState = inject("selectedTabState");
</script>

<template>
  <div v-show="selectedTabState.selectedTab === title">
    <slot></slot>
  </div>
</template>
