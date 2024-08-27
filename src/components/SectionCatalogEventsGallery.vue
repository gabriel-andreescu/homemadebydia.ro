<script setup lang="ts">
const gallery: string[] = [];

for (let i = 1; i <= 9; i++) {
  gallery.push("/gallery/events/" + i + "-min");
}
</script>

<template>
  <div class="columns-2xs gap-8 space-y-8">
    <div class="relative aspect-w-24 aspect-h-9" v-for="image in gallery" :key="image">
      <picture class="w-full object-cover rounded-lg">
        <source :srcset="image + '.webp'" type="image/webp" />
        <source :srcset="image + '.jpg'" type="image/jpeg" />
        <img
          :src="image + '.jpg'"
          alt="imagine din galeria de evenimente"
          class="w-full object-cover rounded-lg"
        />
      </picture>
      <div class="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg"></div>
    </div>
  </div>
</template>
