<script setup lang="ts">
import { ref } from "vue";

const gallery: string[] = [];

for (let i = 1; i <= 29; i++) {
  gallery.push("/gallery/gallery/" + i + "-min");
}

gallery.reverse();

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
  <section class="container mx-auto p-4 md:p-2 lg:p-0">
    <div class="flex flex-wrap justify-center gap-4">
      <div
        v-for="image in gallery"
        :key="image"
        class="relative overflow-hidden cursor-pointer rounded-lg shadow-lg w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]"
        @click="openModal(image)"
      >
        <picture class="w-full h-full object-cover">
          <source :srcset="image + '.webp'" type="image/webp" />
          <source :srcset="image + '.jpeg'" type="image/jpeg" />
          <img
            :src="image + '.jpeg'"
            alt="imagine din galerie"
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
            class="max-w-full max-h-full object-contain rounded-xl"
          />
        </picture>
      </div>
    </div>
  </section>
</template>
