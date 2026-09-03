<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useDarkMode } from "../composables/useDarkMode";
import IconSun from "./icons/IconSun.vue";
import IconMoon from "./icons/IconMoon.vue";

const { t } = useI18n();
const { toggle } = useDarkMode();
</script>

<template>
  <button
    @click="toggle"
    class="p-[10px] rounded-full text-ink-muted hover:bg-surface-sunk transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
  >
    <IconSun class="hidden dark:block size-[24px]" />
    <IconMoon class="block dark:hidden size-[24px]" />
    <span class="sr-only dark:hidden">{{ t("accessibility.toggleDarkMode") }}</span>
    <span class="sr-only hidden dark:inline">{{ t("accessibility.toggleLightMode") }}</span>
  </button>
</template>
