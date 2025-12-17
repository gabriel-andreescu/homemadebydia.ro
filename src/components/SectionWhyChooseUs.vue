<script setup lang="ts">
import { useI18n } from "vue-i18n";
import AppPicture from "./AppPicture.vue";

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-wrap justify-center items-end">
    <div class="flex flex-col m-4 items-center">
      <AppPicture
        src="/gallery/calitate"
        :alt="t('whyUs.qualityAlt')"
        img-class="w-64 h-64 rounded-full"
      />
      <h3 class="text-2xl font-bold mb-2 mt-2">{{ t('whyUs.quality') }}</h3>
      <p class="text-lg w-64 text-center">{{ t('whyUs.qualityDesc') }}</p>
    </div>
    <div class="flex flex-col m-4 items-center">
      <AppPicture
        src="/gallery/unicitate"
        :alt="t('whyUs.uniquenessAlt')"
        img-class="w-64 h-64 rounded-full"
      />
      <h3 class="text-2xl font-bold mb-2 mt-2">{{ t('whyUs.uniqueness') }}</h3>
      <p class="text-lg w-64 text-center">{{ t('whyUs.uniquenessDesc') }}</p>
    </div>

    <div class="flex flex-col m-4 items-center">
      <AppPicture
        src="/gallery/profesionalism"
        :alt="t('whyUs.professionalismAlt')"
        img-class="w-64 h-64 rounded-full"
      />
      <h3 class="text-2xl font-bold mb-2 mt-2">{{ t('whyUs.professionalism') }}</h3>
      <p class="text-lg w-64 text-center">{{ t('whyUs.professionalismDesc') }}</p>
    </div>
  </div>
</template>
