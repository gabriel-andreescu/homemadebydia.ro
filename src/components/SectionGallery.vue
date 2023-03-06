<script setup lang="ts">
const modules = import.meta.glob("../assets/*.{png,jpg,jpeg,PNG,JPEG}", {
  eager: true,
  as: "url",
});
const gallery: string[] = [];

for (const path in modules) {
  const p = new URL(path, import.meta.url).href;
  gallery.push(p);
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
