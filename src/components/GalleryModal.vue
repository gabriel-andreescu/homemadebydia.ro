<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import IconClose from "./icons/IconClose.vue";
import IconChevronLeft from "./icons/IconChevronLeft.vue";
import IconChevronRight from "./icons/IconChevronRight.vue";
import AppPicture from "./AppPicture.vue";
import { useDialogA11y } from "../composables/useDialogA11y";
import { useHorizontalSwipe } from "../composables/useHorizontalSwipe";

const props = defineProps<{
  images: string[];
}>();

const { t } = useI18n();

const isOpen = ref(false);
const currentIndex = ref(0);
const targetIndex = ref(0); // For immediate thumbnail highlight
const thumbnailsRef = ref<HTMLElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);

const currentImage = computed(() => props.images[currentIndex.value]);
const prevImage = computed(() => props.images[currentIndex.value - 1]);
const nextImage = computed(() => props.images[currentIndex.value + 1]);
const hasNext = computed(() => currentIndex.value < props.images.length - 1);
const hasPrev = computed(() => currentIndex.value > 0);
const isSingleImage = computed(() => props.images.length === 1);

const slideOffset = ref(0); // -1, 0, or 1 for slide animation
const isAnimating = ref(false);
const skipTransition = ref(false); // Skip transition during index swap
const currentZoomImageRef = ref<HTMLElement | null>(null);

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_RESET_THRESHOLD = 1.05;

type TouchPoint = {
  x: number;
  y: number;
};

type ImageGeometry = {
  baseWidth: number;
  baseHeight: number;
  baseCenter: TouchPoint;
  stageWidth: number;
  stageHeight: number;
};

const zoomScale = ref(MIN_ZOOM);
const zoomPanX = ref(0);
const zoomPanY = ref(0);
const isZoomInteracting = ref(false);
const touchMode = ref<"swipe" | "pinch" | "pan" | null>(null);
const pinchStartDistance = ref(0);
const pinchStartScale = ref(MIN_ZOOM);
const pinchStartBaseCenter = ref<TouchPoint>({ x: 0, y: 0 });
const pinchStartContentOffset = ref<TouchPoint>({ x: 0, y: 0 });
const panStartTouch = ref<TouchPoint>({ x: 0, y: 0 });
const panStartOffset = ref<TouchPoint>({ x: 0, y: 0 });

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

const isZoomed = computed(() => zoomScale.value > ZOOM_RESET_THRESHOLD);
const zoomTransform = computed(
  () => `translate3d(${zoomPanX.value}px, ${zoomPanY.value}px, 0) scale(${zoomScale.value})`,
);

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getTouchPoint = (touch: Touch): TouchPoint => ({
  x: touch.clientX,
  y: touch.clientY,
});

const getTouchCenter = (touches: TouchList): TouchPoint => ({
  x: (touches[0].clientX + touches[1].clientX) / 2,
  y: (touches[0].clientY + touches[1].clientY) / 2,
});

const getTouchDistance = (touches: TouchList): number => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
};

const getCurrentImageGeometry = (): ImageGeometry | null => {
  const image = currentZoomImageRef.value?.querySelector("img");
  if (!image) return null;

  const imageRect = image.getBoundingClientRect();
  const stage = currentZoomImageRef.value?.closest<HTMLElement>(".modal-image-stage");
  const stageRect = stage?.getBoundingClientRect();
  const currentScale = Math.max(zoomScale.value, MIN_ZOOM);
  const baseWidth = imageRect.width / currentScale;
  const baseHeight = imageRect.height / currentScale;

  return {
    baseWidth,
    baseHeight,
    baseCenter: {
      x: imageRect.left + imageRect.width / 2 - zoomPanX.value,
      y: imageRect.top + imageRect.height / 2 - zoomPanY.value,
    },
    stageWidth: stageRect?.width ?? baseWidth,
    stageHeight: stageRect?.height ?? baseHeight,
  };
};

const getClampedPan = (scale: number, panX: number, panY: number): TouchPoint => {
  if (scale <= MIN_ZOOM) {
    return { x: 0, y: 0 };
  }

  const geometry = getCurrentImageGeometry();
  if (!geometry) {
    return { x: panX, y: panY };
  }

  const maxPanX = Math.max(0, (geometry.baseWidth * scale - geometry.stageWidth) / 2);
  const maxPanY = Math.max(0, (geometry.baseHeight * scale - geometry.stageHeight) / 2);

  return {
    x: clamp(panX, -maxPanX, maxPanX),
    y: clamp(panY, -maxPanY, maxPanY),
  };
};

const applyZoom = (scale: number, panX: number, panY: number) => {
  const nextScale = clamp(scale, MIN_ZOOM, MAX_ZOOM);
  const nextPan = getClampedPan(nextScale, panX, panY);

  zoomScale.value = nextScale;
  zoomPanX.value = nextPan.x;
  zoomPanY.value = nextPan.y;
};

const resetZoom = () => {
  zoomScale.value = MIN_ZOOM;
  zoomPanX.value = 0;
  zoomPanY.value = 0;
  isZoomInteracting.value = false;
  touchMode.value = null;
};

const startPinchZoom = (e: TouchEvent) => {
  onTouchCancel();
  const center = getTouchCenter(e.touches);
  const geometry = getCurrentImageGeometry();
  const currentScale = Math.max(zoomScale.value, MIN_ZOOM);
  const baseCenter = geometry?.baseCenter ?? {
    x: center.x - zoomPanX.value,
    y: center.y - zoomPanY.value,
  };
  const visualCenter = {
    x: baseCenter.x + zoomPanX.value,
    y: baseCenter.y + zoomPanY.value,
  };

  touchMode.value = "pinch";
  isZoomInteracting.value = true;
  pinchStartDistance.value = Math.max(getTouchDistance(e.touches), 1);
  pinchStartScale.value = currentScale;
  pinchStartBaseCenter.value = baseCenter;
  pinchStartContentOffset.value = {
    x: (center.x - visualCenter.x) / currentScale,
    y: (center.y - visualCenter.y) / currentScale,
  };
};

const startPanZoom = (touch: Touch) => {
  touchMode.value = "pan";
  isZoomInteracting.value = true;
  panStartTouch.value = getTouchPoint(touch);
  panStartOffset.value = { x: zoomPanX.value, y: zoomPanY.value };
};

const finishZoomGesture = () => {
  if (zoomScale.value <= ZOOM_RESET_THRESHOLD) {
    resetZoom();
    return;
  }

  applyZoom(zoomScale.value, zoomPanX.value, zoomPanY.value);
  isZoomInteracting.value = false;
  touchMode.value = null;
};

const { isDragging, dragOffset, onTouchStart, onTouchMove, onTouchEnd, onTouchCancel } =
  useHorizontalSwipe({
    isEnabled: () => isOpen.value && !isZoomed.value,
    isInteractionBlocked: () => isAnimating.value,
    canSwipeLeft: () => hasNext.value,
    canSwipeRight: () => hasPrev.value,
    mapOffset: getElasticOffset,
    onSwipeLeft: () => {
      next();
    },
    onSwipeRight: () => {
      prev();
    },
  });

const onModalTouchStart = (e: TouchEvent) => {
  if (e.touches.length >= 2) {
    e.preventDefault();
    startPinchZoom(e);
    return;
  }

  if (isZoomed.value && e.touches.length === 1) {
    e.preventDefault();
    startPanZoom(e.touches[0]);
    return;
  }

  touchMode.value = "swipe";
  onTouchStart(e);
};

const onModalTouchMove = (e: TouchEvent) => {
  if (touchMode.value === "pinch" && e.touches.length >= 2) {
    e.preventDefault();
    const distance = Math.max(getTouchDistance(e.touches), 1);
    const center = getTouchCenter(e.touches);
    const nextScale = clamp(
      pinchStartScale.value * (distance / pinchStartDistance.value),
      MIN_ZOOM,
      MAX_ZOOM,
    );

    applyZoom(
      nextScale,
      center.x - pinchStartBaseCenter.value.x - pinchStartContentOffset.value.x * nextScale,
      center.y - pinchStartBaseCenter.value.y - pinchStartContentOffset.value.y * nextScale,
    );
    return;
  }

  if (touchMode.value === "pan" && e.touches.length === 1) {
    e.preventDefault();
    const touch = getTouchPoint(e.touches[0]);
    applyZoom(
      zoomScale.value,
      panStartOffset.value.x + touch.x - panStartTouch.value.x,
      panStartOffset.value.y + touch.y - panStartTouch.value.y,
    );
    return;
  }

  if (e.touches.length >= 2) {
    e.preventDefault();
    startPinchZoom(e);
    return;
  }

  if (touchMode.value === "swipe") {
    onTouchMove(e);
  }
};

const onModalTouchEnd = (e: TouchEvent) => {
  if (touchMode.value === "pinch") {
    if (e.touches.length === 1 && zoomScale.value >= ZOOM_RESET_THRESHOLD) {
      startPanZoom(e.touches[0]);
      return;
    }

    finishZoomGesture();
    return;
  }

  if (touchMode.value === "pan") {
    finishZoomGesture();
    return;
  }

  if (touchMode.value === "swipe") {
    onTouchEnd();
  }

  touchMode.value = null;
};

const onModalTouchCancel = () => {
  if (touchMode.value === "pinch" || touchMode.value === "pan") {
    finishZoomGesture();
    return;
  }

  onTouchCancel();
  touchMode.value = null;
};

const openAt = (index: number) => {
  if (props.images.length === 0) return;

  const safeIndex = Math.min(Math.max(index, 0), props.images.length - 1);
  currentIndex.value = safeIndex;
  targetIndex.value = safeIndex;
  slideOffset.value = 0;
  dragOffset.value = 0;
  resetZoom();
  isOpen.value = true;
  document.documentElement.style.scrollbarGutter = "stable";
  document.documentElement.style.transition = "background 0.3s ease";
  document.documentElement.style.background = "black";
  document.body.style.overflow = "hidden";
};

const close = () => {
  resetZoom();
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
    resetZoom();
    targetIndex.value = currentIndex.value + 1;
    scrollToIndex(targetIndex.value);
    animateToSlide(1, () => {
      currentIndex.value++;
    });
  }
};

const prev = () => {
  if (hasPrev.value && !isAnimating.value) {
    resetZoom();
    targetIndex.value = currentIndex.value - 1;
    scrollToIndex(targetIndex.value);
    animateToSlide(-1, () => {
      currentIndex.value--;
    });
  }
};

const goTo = (index: number) => {
  if (isAnimating.value) return;

  resetZoom();

  if (index === currentIndex.value) {
    scrollToIndex(index);
    return;
  }

  // For thumbnail clicks, center and change instantly
  targetIndex.value = index;
  scrollToIndex(index);
  isAnimating.value = true;
  currentIndex.value = index;
  setTimeout(() => {
    isAnimating.value = false;
  }, 100);
};

// Keyboard handlers
const onKeydown = (e: KeyboardEvent) => {
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

watch(currentIndex, () => {
  resetZoom();
  scrollToActiveThumbnail();
});
useDialogA11y(isOpen, dialogRef, close);

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
        id="gallery-modal"
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-modal-title"
        tabindex="-1"
        class="fixed inset-0 z-[70] flex flex-col bg-black/95 backdrop-blur-sm"
        @click.self="close"
      >
        <h2 id="gallery-modal-title" class="sr-only">
          {{ t("sections.gallery") }}
        </h2>

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
          class="modal-image-stage flex-1 flex items-center justify-center relative overflow-hidden"
          :class="{ 'is-zoomed': isZoomed }"
          @click.self="close"
          @touchstart="onModalTouchStart"
          @touchmove="onModalTouchMove"
          @touchend="onModalTouchEnd"
          @touchcancel="onModalTouchCancel"
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
                img-class="w-auto max-w-full max-h-[70vh] object-contain rounded-lg"
                sizes="100vw"
              />
            </div>

            <!-- Current image -->
            <div
              class="carousel-slide flex-shrink-0 w-full h-full flex items-center justify-center px-4"
              :class="{ 'is-zoomed': isZoomed }"
              @click.self="close"
            >
              <div
                ref="currentZoomImageRef"
                class="zoom-content"
                :class="{ 'is-interacting': isZoomInteracting }"
                :style="{ transform: zoomTransform }"
              >
                <AppPicture
                  :key="currentImage"
                  :src="currentImage"
                  :alt="t('accessibility.enlargedImage')"
                  img-class="w-auto max-w-full max-h-[70vh] object-contain rounded-lg select-none"
                  sizes="100vw"
                />
              </div>
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
                img-class="w-auto max-w-full max-h-[70vh] object-contain rounded-lg"
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

.modal-image-stage {
  overscroll-behavior: contain;
  touch-action: pan-y;
}

.modal-image-stage.is-zoomed {
  touch-action: none;
}

.carousel-slide {
  touch-action: pan-y;
  user-select: none;
}

.carousel-slide.is-zoomed {
  cursor: grab;
  touch-action: none;
}

.zoom-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  will-change: transform;
}

.zoom-content:not(.is-interacting) {
  transition: transform 0.18s ease;
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
