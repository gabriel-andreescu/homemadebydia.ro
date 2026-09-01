<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useDarkMode } from "../composables/useDarkMode";
import IconSun from "./icons/IconSun.vue";
import IconMoon from "./icons/IconMoon.vue";

const { t } = useI18n();
const { isDark, toggle } = useDarkMode();
</script>

<template>
  <button
    @click="toggle"
    class="p-2 rounded-full text-ink-muted hover:bg-surface-sunk transition-colors"
    :aria-label="isDark ? t('accessibility.toggleLightMode') : t('accessibility.toggleDarkMode')"
  >
    <IconSun v-if="isDark" class="w-6 h-6" />
    <IconMoon v-else class="w-6 h-6" />
  </button>
</template>
