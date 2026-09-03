<script setup lang="ts">
import { useI18n } from "vue-i18n";
import IconFacebook from "./icons/IconFacebook.vue";
import IconMessenger from "./icons/IconMessenger.vue";
import IconInstagram from "./icons/IconInstagram.vue";
import IconWhatsapp from "./icons/IconWhatsapp.vue";
import { CONTACT } from "../constants";

const { t } = useI18n();

withDefaults(
  defineProps<{
    center?: boolean;
  }>(),
  {
    center: true,
  },
);
</script>

<template>
  <p class="h-14 flex items-center" :class="{ 'justify-center': center }">
    <a
      :href="CONTACT.facebook"
      target="_blank"
      class="m-2 rounded-full p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      :aria-label="t('accessibility.visitFacebook')"
    >
      <IconFacebook
        class="w-8 cursor-pointer text-ink hover:text-brand-ink transition-colors"
      />
    </a>
    <a
      :href="CONTACT.messenger"
      target="_blank"
      class="m-2 rounded-full p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      :aria-label="t('accessibility.sendMessenger')"
    >
      <IconMessenger
        class="w-8 cursor-pointer text-ink hover:text-brand-ink transition-colors"
      />
    </a>
    <a
      :href="CONTACT.instagram"
      target="_blank"
      class="m-2 rounded-full p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      :aria-label="t('accessibility.visitInstagram')"
    >
      <IconInstagram
        class="w-8 cursor-pointer text-ink hover:text-brand-ink transition-colors"
      />
    </a>
    <a
      :href="CONTACT.whatsapp"
      target="_blank"
      class="m-2 rounded-full p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      :aria-label="t('accessibility.chatWhatsApp')"
    >
      <IconWhatsapp
        class="w-8 cursor-pointer text-ink hover:text-brand-ink transition-colors"
      />
    </a>
  </p>
</template>
