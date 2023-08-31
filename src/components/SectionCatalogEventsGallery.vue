<script setup lang="ts">
const gallery: string[] = [];

for (let i = 1; i <= 9; i++) {
  gallery.push('/gallery/events/' + i + '-min.jpg');
}
</script>

<template>
  <div class="columns-2xs gap-8 space-y-8">
    <div class="relative aspect-w-24 aspect-h-9" v-for="image in gallery" :key="image">
      <img class="w-full object-cover rounded-lg" :src="image" alt="imagine din galeria de evenimente" />
      <div class="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg"></div>
    </div>
  </div>
</template>