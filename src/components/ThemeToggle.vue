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
    class="p-2.5 rounded-full text-ink-muted hover:bg-surface-sunk transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
  >
    <IconSun class="hidden dark:block w-6 h-6" />
    <IconMoon class="block dark:hidden w-6 h-6" />
    <span class="sr-only dark:hidden">{{ t("accessibility.toggleDarkMode") }}</span>
    <span class="sr-only hidden dark:inline">{{ t("accessibility.toggleLightMode") }}</span>
  </button>
</template>
