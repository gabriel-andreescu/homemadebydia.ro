<script setup lang="ts">
import { ref } from "vue";
import ImageModal from "./ImageModal.vue";

defineProps<{
  imagePath: string;
  alt?: string;
  rounded?: boolean;
  cover?: boolean;
}>();

const imageModalRef = ref<InstanceType<typeof ImageModal>>();
</script>

<template>
  <picture class="w-full h-full object-cover">
    <source :srcset="imagePath + '.webp'" type="image/webp" />
    <source :srcset="imagePath + '.jpg'" type="image/jpeg" />
    <img
      :src="imagePath + '.jpg'"
      :alt="$props.alt ?? 'imagine din galerie'"
      class="w-full h-full"
      :class="{ 'rounded-lg': rounded, 'object-cover': cover }"
      loading="lazy"
      @click="imageModalRef?.openModal(imagePath)"
    />
  </picture>
  <ImageModal ref="imageModalRef" />
</template>
