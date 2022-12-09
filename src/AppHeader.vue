<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppNav from "./AppNav.vue";

const scrolledFromTop = ref(false);

onMounted(() => {
  window.scrollY >= 50 ? (scrolledFromTop.value = true) : (scrolledFromTop.value = false);
  window.addEventListener(
    "scroll",
    () => {
      scrolledFromTop.value = window.scrollY >= 50;
    },
    { passive: true }
  );
});
</script>

<template>
  <header class="fixed w-full px-4 lg:px-12 transition-all duration-200">
    <div
      class="container bg-white mx-auto flex justify-between items-center"
      :class="{ 'h-32': !scrolledFromTop, 'h-16': scrolledFromTop }"
    >
      <a href="#">
        <img
          src="/logo.svg"
          alt="Homemade by Dia logo"
          class="h-32 transform transition duration-200 pt-2 z-50"
          :class="{ 'scale-100': !scrolledFromTop, 'scale-50': scrolledFromTop }"
        />
      </a>
      <AppNav />
    </div>
  </header>
</template>

<style scoped>
li:hover,
li:active {
  @apply text-accent transition-colors duration-200;
}
</style>
