<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import GalleryModal from "./GalleryModal.vue";
import { makeResponsiveSrcset } from "../utils/responsiveImages";

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
    <source
      :srcset="makeResponsiveSrcset(imagePath, 'avif')"
      type="image/avif"
      :sizes="sizes ?? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'"
    />
    <source
      :srcset="makeResponsiveSrcset(imagePath, 'webp')"
      type="image/webp"
      :sizes="sizes ?? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'"
    />
    <img
      :src="`${imagePath}.w640.jpg`"
      :srcset="makeResponsiveSrcset(imagePath, 'jpg')"
      :alt="props.alt ?? t('accessibility.galleryImage')"
      class="w-full h-full"
      :class="{ 'rounded-lg': rounded, 'object-cover': cover }"
      loading="lazy"
      :sizes="sizes ?? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'"
      decoding="async"
      @click="galleryModalRef?.openAt(0)"
    />
  </picture>
  <GalleryModal ref="galleryModalRef" :images="[imagePath]" />
</template>
