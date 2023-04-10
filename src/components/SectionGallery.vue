<script setup lang="ts">
const gallery: string[] = [];

for (let i = 1; i <= 12; i++) {
  gallery.push('/gallery/gallery/' + i + '.jpeg');
}
</script>

<template>
  <section class="container">
    <div class="columns-2xs gap-8 space-y-8">
      <div class="relative aspect-w-24 aspect-h-9" v-for="image in gallery" :key="image">
        <img class="w-full object-cover sm:rounded-lg" :src="image" alt="imagine din galerie" />
      </div>
    </div>
  </section>
</template>
