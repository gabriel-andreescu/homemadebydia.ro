<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <section class="flex flex-col items-center pt-16">
    <h1 class="text-6xl font-serif mb-8" v-if="title">{{ title }}</h1>
    <slot />
  </section>
</template>
