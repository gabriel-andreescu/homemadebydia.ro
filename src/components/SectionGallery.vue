<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import AppPicture from "./AppPicture.vue";
import GalleryModal from "./GalleryModal.vue";
import HorizontalScroller from "./HorizontalScroller.vue";

const { t } = useI18n();

// General gallery images
const generalImages: string[] = [];
for (let i = 1; i <= 29; i++) {
  generalImages.push("/gallery/gallery/" + i);
}
generalImages.reverse();

// Events gallery images
const eventsImages: string[] = [];
for (let i = 1; i <= 25; i++) {
  eventsImages.push("/gallery/events/" + i);
}

// Combined for modal navigation
const allImages = [...generalImages, ...eventsImages];

const galleryModalRef = ref<InstanceType<typeof GalleryModal>>();

const openGallery = (index: number) => {
  galleryModalRef.value?.openAt(index);
};

const openEventsGallery = (index: number) => {
  galleryModalRef.value?.openAt(generalImages.length + index);
};
</script>

<template>
  <!-- General Gallery -->
  <HorizontalScroller>
    <button
      v-for="(imagePath, index) in generalImages"
      :key="imagePath"
      @click="openGallery(index)"
      class="flex-shrink-0 snap-start w-48 md:w-56 aspect-[3/4] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-vivid focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      <AppPicture
        :src="imagePath"
        :alt="t('accessibility.galleryImage')"
        img-class="w-full h-full object-cover"
      />
    </button>
  </HorizontalScroller>

  <!-- Events Gallery -->
  <h3 class="text-2xl font-display text-gray-800 dark:text-gray-100 mt-8 mb-2">
    {{ t('gallery.events') }}
  </h3>
  <HorizontalScroller>
    <button
      v-for="(imagePath, index) in eventsImages"
      :key="imagePath"
      @click="openEventsGallery(index)"
      class="flex-shrink-0 snap-start w-48 md:w-56 aspect-[3/4] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-vivid focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      <AppPicture
        :src="imagePath"
        :alt="t('accessibility.eventsGalleryImage')"
        img-class="w-full h-full object-cover"
      />
    </button>
  </HorizontalScroller>

  <GalleryModal ref="galleryModalRef" :images="allImages" />
</template>
