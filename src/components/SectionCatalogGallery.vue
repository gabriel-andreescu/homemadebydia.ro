<script setup lang="ts">
import GalleryItem from "./GalleryItem.vue";

interface CatalogGalleryDataItem {
  imageUrl: string | string[];
  title: string;
  assortments?: string;
  desc?: string | string[];
  price: number;
  min?: number;
  unit?: string;
}

defineProps<{
  data: CatalogGalleryDataItem[];
}>();
</script>

<template>
  <div class="flex flex-wrap justify-center text-center gap-2 md:gap-4">
    <div
      v-for="item in data"
      :key="item.title"
      class="flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden w-[calc(50%-0.3rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]"
    >
      <div class="relative lg:h-72 w-full h-48 mb-2 overflow-hidden cursor-pointer">
        <div v-if="Array.isArray(item.imageUrl)" class="grid grid-cols-2">
          <div v-for="imagePath in item.imageUrl" :key="imagePath" class="overflow-hidden">
            <GalleryItem
              :image-path="imagePath"
              :alt="item.title + ' la Homemade by Dia - cofetărie din Buftea'"
              :rounded="false"
            />
          </div>
        </div>
        <GalleryItem
          v-else
          :image-path="item.imageUrl"
          :alt="item.title + ' la Homemade by Dia - cofetărie din Buftea'"
        />
      </div>

      <div class="flex flex-col px-2 py-2">
        <h3 class="text-xl font-medium text-gray-800 mb-1">
          {{ item.title }}
        </h3>
        <p class="text-sm text-gray-600 mb-2" v-if="item.assortments">
          {{ item.assortments }}
        </p>
        <div v-if="item.desc" class="text-sm font-light text-left text-gray-700 mb-2">
          <p v-for="desc in item.desc" :key="desc">
            {{ desc }}
          </p>
        </div>
        <p class="text-md text-gray-800">
          <span class="font-bold">{{ item.price }}</span>
          lei
          <span class="text-sm" v-if="item.unit">/{{ item.unit }}</span>
        </p>
        <p class="text-xs text-gray-600 mt-1" v-if="item.min">
          (minim {{ item.min }} {{ item.unit }})
        </p>
      </div>
    </div>
  </div>
</template>
