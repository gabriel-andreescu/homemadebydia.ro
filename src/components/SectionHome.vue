<script setup lang="ts">
import AppSocialLinks from "./AppSocialLinks.vue";
</script>

<template>
  <header>
    <div class="w-full h-80 flex items-center justify-center flex-col">
      <h1 class="text-4xl font-serif text-center mb-8">
        Laborator autorizat de cofetărie,
        <br />
        torturi personalizate și prăjituri la comandă
      </h1>
      <AppSocialLinks :center="true" />
    </div>
  </header>
</template>
