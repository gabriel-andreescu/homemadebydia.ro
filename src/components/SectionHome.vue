<script setup lang="ts">
import IconFacebook from "./IconFacebook.vue";
import IconMessenger from "./IconMessenger.vue";
import IconInstagram from "./IconInstagram.vue";
import IconWhatsapp from "./IconWhatsapp.vue";
</script>

<template>
  <header>
    <div class="h-full w-full h-96 flex items-center justify-center flex-col">
      <h2 class="text-6xl font-serif text-center mb-8">
        Laborator artizanal de
        <br />
        torturi și prăjituri
      </h2>
      <p class="h-32 flex items-center justify-center">
        <a href="https://www.facebook.com/homemadebyDia" target="_blank" class="m-2">
          <IconFacebook class="w-8 cursor-pointer hover:text-accent" />
        </a>
        <a href="https://m.me/homemadebyDia" target="_blank" class="m-2">
          <IconMessenger class="w-8 cursor-pointer hover:text-accent" />
        </a>
        <a href="https://www.instagram.com/homemade.by.dia" target="_blank" class="m-2">
          <IconInstagram class="w-8 cursor-pointer hover:text-accent" />
        </a>
        <a href="whatsapp://send?phone=787283917" target="_blank" class="m-2">
          <IconWhatsapp class="w-8 cursor-pointer hover:text-accent" />
        </a>
      </p>
    </div>
  </header>
</template>
