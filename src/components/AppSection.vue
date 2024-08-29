<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <section class="flex flex-col items-center pt-16">
    <h2 class="text-6xl font-serif mb-8" v-if="title">{{ title }}</h2>
    <slot />
  </section>
</template>
