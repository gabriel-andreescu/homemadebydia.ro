<script setup lang="ts">
import GalleryItem from "./GalleryItem.vue";

const images: string[] = [];
for (let i = 1; i <= 29; i++) {
  images.push("/gallery/gallery/" + i);
}
images.reverse();
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2 md:gap-4 p-2">
    <div
      v-for="imagePath in images"
      :key="imagePath"
      class="flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden w-[calc(50%-0.3rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]"
    >
      <GalleryItem cover :image-path="imagePath" />
    </div>
  </div>
</template>
