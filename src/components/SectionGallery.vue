<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import AppDeferredMedia from "./AppDeferredMedia.vue";
import AppPicture from "./AppPicture.vue";
import GalleryModal from "./GalleryModal.vue";
import HorizontalScroller from "./HorizontalScroller.vue";

const { t } = useI18n();
const MOBILE_BATCH_SIZE = 3;
const DESKTOP_BATCH_SIZE = 7;
const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

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
const isDesktop = ref(false);
const generalVisible = ref(MOBILE_BATCH_SIZE);
const eventsVisible = ref(MOBILE_BATCH_SIZE);

const batchSize = computed(() => (isDesktop.value ? DESKTOP_BATCH_SIZE : MOBILE_BATCH_SIZE));
const visibleGeneralImages = computed(() => generalImages.slice(0, generalVisible.value));
const visibleEventsImages = computed(() => eventsImages.slice(0, eventsVisible.value));
const hasMoreGeneral = computed(() => generalVisible.value < generalImages.length);
const hasMoreEvents = computed(() => eventsVisible.value < eventsImages.length);

let stopMediaQuerySync: (() => void) | null = null;

const ensureMinimumVisible = () => {
  const minimum = batchSize.value;
  generalVisible.value = Math.min(generalImages.length, Math.max(generalVisible.value, minimum));
  eventsVisible.value = Math.min(eventsImages.length, Math.max(eventsVisible.value, minimum));
};

const loadMoreGeneral = () => {
  if (!hasMoreGeneral.value) return;
  generalVisible.value = Math.min(generalImages.length, generalVisible.value + batchSize.value);
};

const loadMoreEvents = () => {
  if (!hasMoreEvents.value) return;
  eventsVisible.value = Math.min(eventsImages.length, eventsVisible.value + batchSize.value);
};

const openGallery = (index: number) => {
  galleryModalRef.value?.openAt(index);
};

const openEventsGallery = (index: number) => {
  galleryModalRef.value?.openAt(generalImages.length + index);
};

onMounted(() => {
  if (typeof window === "undefined") return;

  if ("matchMedia" in window) {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const onMediaChange = (event: MediaQueryListEvent) => {
      isDesktop.value = event.matches;
      ensureMinimumVisible();
    };

    isDesktop.value = mediaQuery.matches;
    ensureMinimumVisible();

    mediaQuery.addEventListener("change", onMediaChange);
    stopMediaQuerySync = () => {
      mediaQuery.removeEventListener("change", onMediaChange);
    };
    return;
  }

  isDesktop.value = window.innerWidth >= 768;
  ensureMinimumVisible();
});

onUnmounted(() => {
  stopMediaQuerySync?.();
  stopMediaQuerySync = null;
});
</script>

<template>
  <!-- General Gallery -->
  <HorizontalScroller @end-visible="loadMoreGeneral">
    <button
      v-for="(imagePath, index) in visibleGeneralImages"
      :key="imagePath"
      @click="openGallery(index)"
      class="flex-shrink-0 snap-start w-48 md:w-56 aspect-[3/4] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      <AppDeferredMedia
        wrapper-class="w-full h-full"
        placeholder-class="w-full h-full bg-rose-100 dark:bg-neutral-800"
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

  <!-- Events Gallery -->
  <h3 class="text-2xl font-display text-gray-800 dark:text-gray-100 mt-8 mb-2">
    {{ t('gallery.events') }}
  </h3>
  <HorizontalScroller @end-visible="loadMoreEvents">
    <button
      v-for="(imagePath, index) in visibleEventsImages"
      :key="imagePath"
      @click="openEventsGallery(index)"
      class="flex-shrink-0 snap-start w-48 md:w-56 aspect-[3/4] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      <AppDeferredMedia
        wrapper-class="w-full h-full"
        placeholder-class="w-full h-full bg-rose-100 dark:bg-neutral-800"
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
