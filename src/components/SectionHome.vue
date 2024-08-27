<script setup lang="ts">
import AppSocialLinks from "./AppSocialLinks.vue";
</script>

<template>
  <header>
    <div class="w-full h-80 flex items-center justify-center flex-col">
      <h2 class="text-4xl font-serif text-center mb-8">
        Laborator artizanal autorizat de cofetărie,
        <br />
        torturi personalizate și prăjituri la comandă
      </h2>
      <AppSocialLinks :center="true" />
    </div>
  </header>
</template>
