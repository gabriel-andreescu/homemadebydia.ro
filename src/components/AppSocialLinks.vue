<script setup lang="ts">
import IconFacebook from "./IconFacebook.vue";
import IconMessenger from "./IconMessenger.vue";
import IconInstagram from "./IconInstagram.vue";
import IconWhatsapp from "./IconWhatsapp.vue";

withDefaults(
  defineProps<{
    center: boolean;
  }>(),
  {
    center: true,
  }
);
</script>

<template>
  <p class="h-32 flex items-center" :class="{ 'justify-center': center }">
    <a
      href="https://www.facebook.com/homemadebyDia"
      target="_blank"
      class="m-2"
      aria-label="Vizitați pagina noastră de Facebook"
    >
      <IconFacebook class="w-8 cursor-pointer hover:text-accent" />
    </a>
    <a
      href="https://m.me/homemadebyDia"
      target="_blank"
      class="m-2"
      aria-label="Trimiteți-ne un mesaj pe Messenger"
    >
      <IconMessenger class="w-8 cursor-pointer hover:text-accent" />
    </a>
    <a
      href="https://www.instagram.com/homemade.by.dia"
      target="_blank"
      class="m-2"
      aria-label="Vizitați profilul nostru de Instagram"
    >
      <IconInstagram class="w-8 cursor-pointer hover:text-accent" />
    </a>
    <a
      href="whatsapp://send?phone=787283917"
      target="_blank"
      class="m-2"
      aria-label="Discutați cu noi pe WhatsApp"
    >
      <IconWhatsapp class="w-8 cursor-pointer hover:text-accent" />
    </a>
  </p>
</template>
