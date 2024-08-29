<script setup lang="ts">
import { ref } from "vue";

const gallery: string[] = [];

for (let i = 1; i <= 15; i++) {
  gallery.push("/gallery/events/" + i + "-min");
}

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
  <div class="flex flex-wrap justify-center gap-4 p-4">
    <div
      v-for="(image, index) in gallery"
      :key="image"
      class="relative overflow-hidden cursor-pointer rounded-lg shadow-lg w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]"
      @click="openModal(image)"
    >
      <picture class="w-full h-full object-cover">
        <source :srcset="image + '.webp'" type="image/webp" />
        <source :srcset="image + '.jpg'" type="image/jpeg" />
        <img
          :src="image + '.jpg'"
          alt="imagine din galeria de evenimente"
          class="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      </picture>
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
        class="font-serif absolute top-2 right-2 flex items-center justify-center text-2xl text-accent w-8 h-8 rounded-3xl bg-white"
      >
        &times;
      </button>
      <picture>
        <source :srcset="selectedImage + '.webp'" type="image/webp" />
        <source :srcset="selectedImage + '.jpeg'" type="image/jpeg" />
        <img
          :src="selectedImage + '.jpeg'"
          alt="imagine mărită"
          class="max-w-full max-h-screen object-contain rounded-3xl"
        />
      </picture>
    </div>
  </div>
</template>
