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
  <p class="h-32 flex items-center" :class="{ 'justify-center': center }">
    <a
      :href="CONTACT.facebook"
      target="_blank"
      class="m-2 rounded-full p-1 focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 focus-visible:outline-none"
      :aria-label="t('accessibility.visitFacebook')"
    >
      <IconFacebook
        class="w-8 cursor-pointer text-gray-900 dark:text-gray-100 hover:text-accent dark:hover:text-accent-light transition-colors duration-300"
      />
    </a>
    <a
      :href="CONTACT.messenger"
      target="_blank"
      class="m-2 rounded-full p-1 focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 focus-visible:outline-none"
      :aria-label="t('accessibility.sendMessenger')"
    >
      <IconMessenger
        class="w-8 cursor-pointer text-gray-900 dark:text-gray-100 hover:text-accent dark:hover:text-accent-light transition-colors duration-300"
      />
    </a>
    <a
      :href="CONTACT.instagram"
      target="_blank"
      class="m-2 rounded-full p-1 focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 focus-visible:outline-none"
      :aria-label="t('accessibility.visitInstagram')"
    >
      <IconInstagram
        class="w-8 cursor-pointer text-gray-900 dark:text-gray-100 hover:text-accent dark:hover:text-accent-light transition-colors duration-300"
      />
    </a>
    <a
      :href="CONTACT.whatsapp"
      target="_blank"
      class="m-2 rounded-full p-1 focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 focus-visible:outline-none"
      :aria-label="t('accessibility.chatWhatsApp')"
    >
      <IconWhatsapp
        class="w-8 cursor-pointer text-gray-900 dark:text-gray-100 hover:text-accent dark:hover:text-accent-light transition-colors duration-300"
      />
    </a>
  </p>
</template>
