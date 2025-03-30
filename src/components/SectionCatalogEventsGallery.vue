<script setup lang="ts">
import GalleryItem from "./GalleryItem.vue";

const images: string[] = [];
for (let i = 1; i <= 25; i++) {
  images.push("/gallery/events/" + i);
}
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2 md:gap-4">
    <div
      v-for="imagePath in images"
      :key="imagePath"
      class="relative overflow-hidden cursor-pointer rounded-lg shadow-lg w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]"
    >
      <GalleryItem cover :image-path="imagePath" :alt="'imagine din galeria de evenimente'" />
    </div>
  </div>
</template>
