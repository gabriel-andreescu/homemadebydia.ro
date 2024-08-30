<script setup lang="ts">
import { ref } from "vue";
import IconClose from "./IconClose.vue";

const isOpen = ref(false);
const selectedImage = ref("");

const openModal = (image: string) => {
  selectedImage.value = image;
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
  selectedImage.value = "";
};

defineExpose({ openModal });
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    @click="close"
  >
    <div class="relative">
      <IconClose class="cursor-pointer absolute top-1 right-1 text-gray-900 w-12 h-12" />
      <picture>
        <source :srcset="selectedImage + '.webp'" type="image/webp" />
        <source :srcset="selectedImage + '.jpg'" type="image/jpeg" />
        <img
          :src="selectedImage + '.jpg'"
          alt="imagine mărită"
          class="max-w-full max-h-screen object-contain rounded-xl"
        />
      </picture>
    </div>
  </div>
</template>
