<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title?: string;
  id?: string;
  headClass?: string;
}>();
</script>

<template>
  <section :id="id" class="flex flex-col">
    <div v-if="eyebrow || title" class="w-full flex flex-col gap-2 mb-8" :class="headClass">
      <p
        v-if="eyebrow"
        class="text-meta font-semibold uppercase tracking-[0.16em] text-ink-faint"
      >
        {{ eyebrow }}
      </p>
      <h2 v-if="title" class="text-display font-serif text-balance">
        {{ title }}
      </h2>
    </div>
    <slot />
  </section>
</template>
