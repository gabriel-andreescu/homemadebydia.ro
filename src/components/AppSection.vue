<script setup lang="ts">
defineProps<{
  title?: string;
  id?: string;
}>();
</script>

<template>
  <section :id="id" class="flex flex-col items-center mt-16">
    <h2 v-if="title" class="text-6xl font-serif mb-8 text-center">{{ title }}</h2>
    <slot />
  </section>
</template>
