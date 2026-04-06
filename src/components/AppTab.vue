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
  <div v-if="selectedTabState?.selectedTab === tabKey" class="w-full p-2">
    <slot></slot>
  </div>
</template>
