<script setup lang="ts">
const gallery: string[] = [];

for (let i = 1; i <= 20; i++) {
  gallery.push("/gallery/gallery/" + i + "-min");
}
</script>

<template>
  <section class="container">
    <div class="columns-2xs gap-8 space-y-8 p-2">
      <div class="relative aspect-w-24 aspect-h-9" v-for="image in gallery" :key="image">
        <picture class="w-full object-cover sm:rounded-lg">
          <source :srcset="image + '.webp'" type="image/webp" />
          <source :srcset="image + '.jpeg'" type="image/jpeg" />
          <img
            :src="image + '.jpeg'"
            alt="imagine din galerie"
            class="w-full object-cover sm:rounded-lg"
            loading="lazy"
          />
        </picture>
      </div>
    </div>
  </section>
</template>
