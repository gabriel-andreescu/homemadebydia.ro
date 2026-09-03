<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import AppDeferredMedia from "./AppDeferredMedia.vue";
import AppPicture from "./AppPicture.vue";
import GalleryModal from "./GalleryModal.vue";
import HorizontalScroller from "./HorizontalScroller.vue";

const { t } = useI18n();

const generalImages: string[] = [];
for (let i = 1; i <= 29; i++) {
  generalImages.push("/gallery/gallery/" + i);
}
generalImages.reverse();

const eventsImages: string[] = [];
for (let i = 1; i <= 25; i++) {
  eventsImages.push("/gallery/events/" + i);
}

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
  <h3 class="text-title font-serif text-balance mb-4">
    {{ t('gallery.cakes') }}
  </h3>
  <HorizontalScroller pad-class="pt-4 pb-8" gradient-class="from-surface-sunk via-surface-sunk/50">
    <button
      v-for="(imagePath, index) in generalImages"
      :key="imagePath"
      type="button"
      @click="openGallery(index)"
      :aria-label="t('accessibility.openGalleryImage', { index: index + 1 })"
      class="shrink-0 snap-start w-48 md:w-56 aspect-[3/4] rounded-surface overflow-hidden shadow-raised transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <AppDeferredMedia
        wrapper-class="w-full h-full"
        placeholder-class="w-full h-full bg-surface-sunk"
      >
        <AppPicture
          :src="imagePath"
          :alt="t('accessibility.galleryImage')"
          img-class="w-full h-full object-cover"
          sizes="(max-width: 768px) 192px, 224px"
        />
      </AppDeferredMedia>
    </button>
  </HorizontalScroller>

  <h3 class="text-title font-serif text-balance mt-12 mb-4">
    {{ t('gallery.events') }}
  </h3>
  <HorizontalScroller pad-class="pt-4 pb-8" gradient-class="from-surface-sunk via-surface-sunk/50">
    <button
      v-for="(imagePath, index) in eventsImages"
      :key="imagePath"
      type="button"
      @click="openEventsGallery(index)"
      :aria-label="t('accessibility.openEventsGalleryImage', { index: index + 1 })"
      class="shrink-0 snap-start w-48 md:w-56 aspect-[3/4] rounded-surface overflow-hidden shadow-raised transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <AppDeferredMedia
        wrapper-class="w-full h-full"
        placeholder-class="w-full h-full bg-surface-sunk"
      >
        <AppPicture
          :src="imagePath"
          :alt="t('accessibility.eventsGalleryImage')"
          img-class="w-full h-full object-cover"
          sizes="(max-width: 768px) 192px, 224px"
        />
      </AppDeferredMedia>
    </button>
  </HorizontalScroller>

  <GalleryModal ref="galleryModalRef" :images="allImages" />
</template>
