<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useLocale } from '../composables/useLocale';

const { t } = useI18n();
const { locale, toggle } = useLocale();
</script>

<template>
  <button
    @click="toggle"
    class="p-[10px] rounded-full text-ink-muted hover:bg-surface-sunk transition-colors font-medium text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    :aria-label="locale === 'ro' ? t('accessibility.switchToEnglish') : t('accessibility.switchToRomanian')"
  >
    <span class="size-[24px] flex items-center justify-center uppercase">
      {{ locale === 'ro' ? 'en' : 'ro' }}
    </span>
  </button>
</template>

