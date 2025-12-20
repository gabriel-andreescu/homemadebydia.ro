<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import IconClose from "./icons/IconClose.vue";
import IconChevronLeft from "./icons/IconChevronLeft.vue";
import IconChevronRight from "./icons/IconChevronRight.vue";
import AppPicture from "./AppPicture.vue";

const props = defineProps<{
  images: string[];
}>();

const { t } = useI18n();

const isOpen = ref(false);
const currentIndex = ref(0);
const targetIndex = ref(0); // For immediate thumbnail highlight
const thumbnailsRef = ref<HTMLElement | null>(null);

const currentImage = computed(() => props.images[currentIndex.value]);
const prevImage = computed(() => props.images[currentIndex.value - 1]);
const nextImage = computed(() => props.images[currentIndex.value + 1]);
const hasNext = computed(() => currentIndex.value < props.images.length - 1);
const hasPrev = computed(() => currentIndex.value > 0);
const isSingleImage = computed(() => props.images.length === 1);

// Touch swipe handling with velocity
const touchStartX = ref(0);
const touchStartTime = ref(0);
const isDragging = ref(false);
const dragOffset = ref(0);
const slideOffset = ref(0); // -1, 0, or 1 for slide animation
const isAnimating = ref(false);
const skipTransition = ref(false); // Skip transition during index swap

const SWIPE_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 0.3; // px/ms

// Elastic resistance when dragging past bounds
const getElasticOffset = (offset: number): number => {
  const atStart = currentIndex.value === 0 && offset > 0;
  const atEnd = currentIndex.value === props.images.length - 1 && offset < 0;

  if (atStart || atEnd) {
    // Rubber band effect - diminishing returns
    const resistance = 0.3;
    return offset * resistance;
  }
  return offset;
};

// Compute carousel transform
const carouselTransform = computed(() => {
  // Base position: show middle slide (-100%)
  // slideOffset: -1 = show prev (0%), 0 = show current (-100%), 1 = show next (-200%)
  const basePercent = -100 + slideOffset.value * -100;
  return `translateX(calc(${basePercent}% + ${dragOffset.value}px))`;
});

const openAt = (index: number) => {
  currentIndex.value = index;
  targetIndex.value = index;
  slideOffset.value = 0;
  dragOffset.value = 0;
  isOpen.value = true;
  document.documentElement.style.scrollbarGutter = "stable";
  document.documentElement.style.transition = "background 0.3s ease";
  document.documentElement.style.background = "black";
  document.body.style.overflow = "hidden";
};

const close = () => {
  isOpen.value = false;
  document.body.style.overflow = "";
  document.documentElement.style.scrollbarGutter = "";
  document.documentElement.style.background = "";
  // Clean up transition after animation completes
  setTimeout(() => {
    if (!isOpen.value) {
      document.documentElement.style.transition = "";
    }
  }, 300);
};

const animateToSlide = (direction: -1 | 1, callback: () => void) => {
  isAnimating.value = true;
  slideOffset.value = direction;

  // Wait for transition to complete
  setTimeout(() => {
    // Disable transition before swapping
    skipTransition.value = true;
    callback();
    slideOffset.value = 0;

    // Re-enable transition after DOM update
    requestAnimationFrame(() => {
      skipTransition.value = false;
      isAnimating.value = false;
    });
  }, 400); // Match CSS transition duration
};

// Immediately scroll to a specific thumbnail index
const scrollToIndex = (index: number) => {
  const container = thumbnailsRef.value;
  if (!container) return;
  const thumb = container.children[index] as HTMLElement;
  if (!thumb) return;
  container.scrollTo({
    left: thumb.offsetLeft - container.offsetWidth / 2 + thumb.offsetWidth / 2,
    behavior: "smooth",
  });
};

const next = () => {
  if (hasNext.value && !isAnimating.value) {
    targetIndex.value = currentIndex.value + 1;
    scrollToIndex(targetIndex.value);
    animateToSlide(1, () => {
      currentIndex.value++;
    });
  }
};

const prev = () => {
  if (hasPrev.value && !isAnimating.value) {
    targetIndex.value = currentIndex.value - 1;
    scrollToIndex(targetIndex.value);
    animateToSlide(-1, () => {
      currentIndex.value--;
    });
  }
};

const goTo = (index: number) => {
  if (index === currentIndex.value || isAnimating.value) return;

  // For thumbnail clicks, center and change instantly
  targetIndex.value = index;
  scrollToIndex(index);
  isAnimating.value = true;
  currentIndex.value = index;
  setTimeout(() => {
    isAnimating.value = false;
  }, 100);
};

// Touch handlers
const onTouchStart = (e: TouchEvent) => {
  if (isAnimating.value) return;
  touchStartX.value = e.touches[0].clientX;
  touchStartTime.value = Date.now();
  isDragging.value = true;
  dragOffset.value = 0;
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || isAnimating.value) return;
  const currentX = e.touches[0].clientX;
  const rawOffset = currentX - touchStartX.value;
  dragOffset.value = getElasticOffset(rawOffset);
};

const onTouchEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;

  const elapsed = Date.now() - touchStartTime.value;
  const velocity = Math.abs(dragOffset.value) / elapsed;
  const isQuickSwipe = velocity > VELOCITY_THRESHOLD;
  const threshold = isQuickSwipe ? SWIPE_THRESHOLD * 0.5 : SWIPE_THRESHOLD;

  if (dragOffset.value > threshold && hasPrev.value) {
    dragOffset.value = 0;
    prev();
  } else if (dragOffset.value < -threshold && hasNext.value) {
    dragOffset.value = 0;
    next();
  } else {
    // Spring back to center
    dragOffset.value = 0;
  }
};

// Keyboard handlers
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") close();
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
};

// Scroll thumbnail strip to center active thumbnail
const scrollToActiveThumbnail = () => {
  nextTick(() => {
    const container = thumbnailsRef.value;
    if (!container) return;

    const activeThumb = container.children[currentIndex.value] as HTMLElement;
    if (!activeThumb) return;

    const containerWidth = container.offsetWidth;
    const thumbLeft = activeThumb.offsetLeft;
    const thumbWidth = activeThumb.offsetWidth;

    // Center the thumbnail
    container.scrollTo({
      left: thumbLeft - containerWidth / 2 + thumbWidth / 2,
      behavior: "smooth",
    });
  });
};

watch(isOpen, (open) => {
  if (open) {
    window.addEventListener("keydown", onKeydown);
    scrollToActiveThumbnail();
  } else {
    window.removeEventListener("keydown", onKeydown);
  }
});

watch(currentIndex, scrollToActiveThumbnail);

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
  document.documentElement.style.scrollbarGutter = "";
  document.documentElement.style.background = "";
  document.documentElement.style.transition = "";
});

defineExpose({ openAt });
</script>

<template>
  <Teleport to="body">
    <Transition name="gallery-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[70] flex flex-col bg-black/95 backdrop-blur-sm"
        @click.self="close"
      >
        <!-- Header -->
        <div class="flex justify-between items-center p-4">
          <span v-if="!isSingleImage" class="text-white/70 text-sm">
            {{ currentIndex + 1 }} / {{ images.length }}
          </span>
          <span v-else></span>
          <button
            @click="close"
            class="text-white/70 hover:text-white transition-colors p-2"
            :aria-label="t('accessibility.closeGallery')"
          >
            <IconClose class="w-8 h-8" />
          </button>
        </div>

        <!-- Main image area -->
        <div
          class="flex-1 flex items-center justify-center relative overflow-hidden"
          @click.self="close"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- Prev button (desktop) -->
          <button
            v-if="hasPrev"
            @click="prev"
            class="hidden md:flex absolute left-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            :aria-label="t('accessibility.prevImage')"
          >
            <IconChevronLeft class="w-6 h-6" />
          </button>

          <!-- Carousel container -->
          <div
            class="carousel-track flex items-center w-full h-full"
            :class="{ 'is-dragging': isDragging, 'no-transition': skipTransition }"
            :style="{ transform: carouselTransform }"
          >
            <!-- Previous image -->
            <div
              class="carousel-slide flex-shrink-0 w-full h-full flex items-center justify-center px-4"
              @click.self="close"
            >
              <AppPicture
                v-if="prevImage"
                :src="prevImage"
                :alt="t('accessibility.enlargedImage')"
                img-class="max-w-full max-h-[70vh] object-contain rounded-lg"
                sizes="100vw"
              />
            </div>

            <!-- Current image -->
            <div
              class="carousel-slide flex-shrink-0 w-full h-full flex items-center justify-center px-4"
              @click.self="close"
            >
              <AppPicture
                :key="currentImage"
                :src="currentImage"
                :alt="t('accessibility.enlargedImage')"
                img-class="max-w-full max-h-[70vh] object-contain rounded-lg"
                sizes="100vw"
              />
            </div>

            <!-- Next image -->
            <div
              class="carousel-slide flex-shrink-0 w-full h-full flex items-center justify-center px-4"
              @click.self="close"
            >
              <AppPicture
                v-if="nextImage"
                :src="nextImage"
                :alt="t('accessibility.enlargedImage')"
                img-class="max-w-full max-h-[70vh] object-contain rounded-lg"
                sizes="100vw"
              />
            </div>
          </div>

          <!-- Next button (desktop) -->
          <button
            v-if="hasNext"
            @click="next"
            class="hidden md:flex absolute right-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            :aria-label="t('accessibility.nextImage')"
          >
            <IconChevronRight class="w-6 h-6" />
          </button>
        </div>

        <!-- Thumbnail strip -->
        <div v-if="!isSingleImage" class="pb-4">
          <div
            ref="thumbnailsRef"
            class="flex items-center gap-3 py-3 scroll-smooth thumbnail-strip"
            style="padding-left: calc(50% - 2.5rem); padding-right: calc(50% - 2.5rem)"
          >
            <button
              v-for="(image, index) in images"
              :key="image"
              @click="goTo(index)"
              class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200"
              :class="
                index === targetIndex
                  ? 'ring-2 ring-accent dark:ring-accent ring-offset-2 ring-offset-black scale-105'
                  : 'opacity-50 hover:opacity-80'
              "
            >
              <AppPicture
                :src="image"
                :alt="t('accessibility.galleryImage')"
                img-class="w-full h-full object-cover"
                sizes="64px"
              />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.gallery-modal-enter-active,
.gallery-modal-leave-active {
  transition: opacity 0.3s ease;
}

.gallery-modal-enter-from,
.gallery-modal-leave-to {
  opacity: 0;
}

/* Carousel transitions */
.carousel-track {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

.carousel-track.is-dragging,
.carousel-track.no-transition {
  transition: none;
}

.carousel-track.is-dragging {
  cursor: grabbing;
}

.carousel-slide {
  touch-action: pan-y;
  user-select: none;
}

/* Hide scrollbar but keep functionality */
.thumbnail-strip {
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.thumbnail-strip::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
</style>
