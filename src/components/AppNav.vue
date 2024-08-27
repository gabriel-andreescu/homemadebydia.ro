<!--suppress HtmlUnknownAnchorTarget -->
<script setup lang="ts">
import { ref } from "vue";

const navOpen = ref(false);
</script>

<template>
  <nav>
    <button class="lg:hidden" @click="navOpen = !navOpen" aria-label="Menu">
      <svg class="h-8 w-8 text-accent" viewBox="0 0 24 24">
        <path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z" />
      </svg>
    </button>
    <ul
      class="fixed left-0 right-0 min-h-screen top-0 px-4 pt-8 space-y-4 bg-white transform transition duration-300 translate-x-full lg:relative lg:flex lg:space-x-10 lg:min-h-0 lg:px-0 lg:py-0 lg:space-y-0 lg:translate-x-0"
      :class="{ 'translate-x-full': !navOpen, 'translate-x-0': navOpen }"
      @click="navOpen = false"
    >
      <li><a href="#" @click="navOpen = false">Acasă</a></li>
      <li>
        <a href="#catalog" @click="navOpen = false">Catalog</a>
      </li>
      <li>
        <a href="#galerie" @click="navOpen = false">Galerie</a>
      </li>
      <li><a href="#de-ce-noi" @click="navOpen = false">De ce noi?</a></li>
      <li><a href="#cum-sa-comanzi" @click="navOpen = false">Cum să comanzi</a></li>
      <li><a href="#contact" @click="navOpen = false">Contact</a></li>
    </ul>
  </nav>
</template>

<style scoped>
li:hover,
li:active {
  @apply text-accent transition-colors duration-200;
}
</style>
