<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useLocale } from '../composables/useLocale';

const { t } = useI18n();
const { locale, toggle } = useLocale();
</script>

<template>
  <button
    @click="toggle"
    class="p-2 rounded-full text-ink-muted hover:bg-surface-sunk transition-colors font-medium text-sm"
    :aria-label="locale === 'ro' ? t('accessibility.switchToEnglish') : t('accessibility.switchToRomanian')"
  >
    <span class="w-6 h-6 flex items-center justify-center uppercase">
      {{ locale === 'ro' ? 'en' : 'ro' }}
    </span>
  </button>
</template>

