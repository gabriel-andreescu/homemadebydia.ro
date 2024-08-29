<script setup lang="ts">
import { ref } from "vue";

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

const isModalOpen = ref(false);
const selectedImage = ref("");

const openModal = (image: string) => {
  selectedImage.value = image;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedImage.value = "";
};
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
          <div
            v-for="image in item.imageUrl"
            :key="image"
            class="overflow-hidden"
            @click="openModal(image)"
          >
            <picture>
              <source :srcset="image + '.webp'" type="image/webp" />
              <source :srcset="image + '.jpg'" type="image/jpeg" />
              <img
                :src="image + '.jpg'"
                :alt="item.title + ' la cofetăria Homemade by Dia din Buftea'"
                class="w-full h-full object-center"
              />
            </picture>
          </div>
        </div>
        <picture v-else @click="openModal(item.imageUrl)">
          <source :srcset="item.imageUrl + '.webp'" type="image/webp" />
          <source :srcset="item.imageUrl + '.jpg'" type="image/jpeg" />
          <img
            :src="item.imageUrl + '.jpg'"
            :alt="item.title + ' la cofetăria Homemade by Dia din Buftea'"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </picture>
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
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <div class="relative">
      <button
        @click="closeModal"
        class="font-serif absolute top-2 right-2 flex items-center justify-center text-2xl pb-1.5 text-accent w-8 h-8 rounded-3xl bg-white"
      >
        &times;
      </button>
      <picture>
        <source :srcset="selectedImage + '.webp'" type="image/webp" />
        <source :srcset="selectedImage + '.jpeg'" type="image/jpeg" />
        <img
          :src="selectedImage + '.jpeg'"
          alt="imagine mărită"
          class="max-w-full max-h-screen object-contain rounded-xl"
        />
      </picture>
    </div>
  </div>
</template>
