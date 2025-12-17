<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import GalleryModal from "./GalleryModal.vue";

const { t } = useI18n();

const props = defineProps<{
  imagePath: string;
  alt?: string;
  rounded?: boolean;
  cover?: boolean;
  sizes?: string;
}>();

const galleryModalRef = ref<InstanceType<typeof GalleryModal>>();
</script>

<template>
  <picture class="w-full h-full object-cover">
    <source :srcset="imagePath + '.webp'" type="image/webp" />
    <source :srcset="imagePath + '.jpg'" type="image/jpeg" />
    <img
      :src="imagePath + '.jpg'"
      :alt="props.alt ?? t('accessibility.galleryImage')"
      class="w-full h-full"
      :class="{ 'rounded-lg': rounded, 'object-cover': cover }"
      loading="lazy"
      :sizes="sizes ?? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'"
      @click="galleryModalRef?.openAt(0)"
    />
  </picture>
  <GalleryModal ref="galleryModalRef" :images="[imagePath]" />
</template>
