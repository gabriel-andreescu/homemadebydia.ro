<script setup lang="ts">
interface CatalogGalleryDataItem {
  imageUrl: string;
  title: string;
  assortments?: string;
  price: number;
  min?: number;
  unit?: boolean;
}

defineProps<{
  data: CatalogGalleryDataItem[];
}>();
</script>

<template>
  <div class="flex flex-wrap justify-center text-center">
    <div v-for="item in data" :key="item.title" class="flex flex-col w-64 lg:w-96 m-4 items-center">
      <div class="lg:w-96 lg:h-96 w-64 h-64 mb-1 overflow-hidden">
        <img
          :src="item.imageUrl"
          class="lg:h-96 h-64 min-w-full object-cover"
          alt="poza {{ item.title }}"
        />
      </div>

      <h2 class="text-lg w-64" :class="{ 'mb-1': !item.assortments }">
        {{ item.title }}
      </h2>
      <h3 class="text-sm w-64 mb-1" v-if="item.assortments">
        {{ item.assortments }}
      </h3>
      <p class="text-md" :class="{ 'mb-1': !item.min }">
        <span class="font-bold">{{ item.price }}</span>
        lei
        <span class="text-sm" v-if="item.unit">/{{ item.unit }}</span>
      </p>
      <p class="text-sm mb-2" v-if="item.min">minim {{ item.min }} {{ item.unit }}</p>
    </div>
  </div>
</template>
