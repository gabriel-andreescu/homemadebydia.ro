<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import AppSocialLinks from "./AppSocialLinks.vue";
import AppPicture from "./AppPicture.vue";
import { useScrollTo } from "../composables/useScrollTo";
import { useHorizontalSwipe } from "../composables/useHorizontalSwipe";
import { getCatalogCollections } from "../data/catalogData";
import type { Locale } from "../i18n";

const { t, locale } = useI18n();
const { scrollTo } = useScrollTo();

const showcaseIds = [
  "tort-fistic-zmeura",
  "profiterol-cu-fructe",
  "tort-aluna-caramel",
  "carrot-cake-caramel",
  "tortul-casei",
];

const showcaseImages = computed(() => {
  const products = getCatalogCollections(locale.value as Locale).productMap;
  return showcaseIds.map((id) => ({
    src: `/gallery/cakes/${id}`,
    label: `${products.get(id)?.title ?? ""} · ${t("home.crossSection")}`,
  }));
});

const heroRef = ref<HTMLElement | null>(null);
const currentImageIndex = ref(0);
const previousImageIndex = ref<number | null>(null);
const initialHeroImagePhase = ref(true);
const AUTOPLAY_INTERVAL_MS = 4000;
const HERO_FADE_DURATION_MS = 500;

let intervalId: number | undefined;
let previousImageTimeoutId: number | undefined;

const currentImage = computed(() => showcaseImages.value[currentImageIndex.value]);
const previousImage = computed(() =>
  previousImageIndex.value === null ? null : showcaseImages.value[previousImageIndex.value],
);

const setImageIndex = (index: number, resetAutoplay = false) => {
  const nextIndex = (index + showcaseImages.value.length) % showcaseImages.value.length;
  if (nextIndex === currentImageIndex.value) {
    if (resetAutoplay) {
      restartAutoplay();
    }
    return;
  }

  previousImageIndex.value = currentImageIndex.value;
  currentImageIndex.value = nextIndex;

  if (previousImageTimeoutId !== undefined) {
    clearTimeout(previousImageTimeoutId);
  }

  previousImageTimeoutId = window.setTimeout(() => {
    previousImageIndex.value = null;
    previousImageTimeoutId = undefined;
  }, HERO_FADE_DURATION_MS);

  if (resetAutoplay) {
    restartAutoplay();
  }
};

const goToImage = (index: number) => {
  setImageIndex(index, true);
};

const goToNextImage = (resetAutoplay = true) => {
  setImageIndex(currentImageIndex.value + 1, resetAutoplay);
};

const goToPrevImage = (resetAutoplay = true) => {
  setImageIndex(currentImageIndex.value - 1, resetAutoplay);
};

const isHeroInViewport = () => {
  const hero = heroRef.value;
  if (!hero) return true;

  const rect = hero.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.bottom > 0 && rect.top < viewportHeight;
};

const tickAutoplay = () => {
  const tabVisible = !document.hidden;
  const heroVisible = isHeroInViewport();

  if (!tabVisible || !heroVisible) {
    return;
  }

  goToNextImage(false);
};

const stopAutoplay = () => {
  if (intervalId !== undefined) {
    clearInterval(intervalId);
    intervalId = undefined;
  }
};

const startAutoplay = () => {
  stopAutoplay();
  intervalId = window.setInterval(tickAutoplay, AUTOPLAY_INTERVAL_MS);
};

const restartAutoplay = () => {
  startAutoplay();
};

const { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel } = useHorizontalSwipe({
  onSwipeLeft: () => {
    goToNextImage();
  },
  onSwipeRight: () => {
    goToPrevImage();
  },
});

onMounted(() => {
  startAutoplay();
  initialHeroImagePhase.value = false;
});

onUnmounted(() => {
  stopAutoplay();
  if (previousImageTimeoutId !== undefined) {
    clearTimeout(previousImageTimeoutId);
    previousImageTimeoutId = undefined;
  }
});
</script>

<template>
  <section ref="heroRef" class="w-full py-6 flex items-center relative overflow-visible">
    <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 px-2 w-full">
      <div class="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
        <p class="text-meta font-semibold uppercase tracking-[0.16em] text-ink-faint">
          {{ t("home.eyebrow") }}
        </p>

        <h1 class="text-hero font-serif text-ink text-balance">
          {{ t("home.title") }}
          <br />
          {{ t("home.titleLine2") }}
        </h1>

        <p class="text-ink-muted max-w-[46ch]">{{ t("home.lede") }}</p>

        <button
          @click="scrollTo('catalog')"
          class="px-8 py-3 bg-brand-solid text-on-brand text-lead font-medium tracking-wide rounded-full shadow-card hover:scale-105 hover:shadow-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-[transform,box-shadow]"
        >
          {{ t("home.viewCatalog") }}
        </button>

        <p
          class="w-full flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 border-t border-line pt-4 text-meta font-semibold uppercase tracking-[0.1em] text-ink-faint"
        >
          <span>{{ t("home.naturalIngredients") }}</span>
          <span>{{ t("home.licensedWorkshop") }}</span>
          <span>{{ t("home.madeToOrder") }}</span>
        </p>

        <AppSocialLinks />
      </div>

      <!-- Square: cropping a cross-section loses the layers it exists to show. -->
      <div class="w-full max-w-lg mx-auto lg:mx-0 lg:flex-1 lg:max-w-[32rem]">
        <!-- The glow is anchored to the carousel, not the section: the section is as wide as
             the page while the carousel is a fixed square, so section percentages walk it out
             from behind the image as the viewport grows. -->
        <div class="relative">
          <div
            class="absolute top-[7%] right-[17%] w-64 h-64 bg-brand/[0.15] lg:bg-brand/25 rounded-full blur-3xl pointer-events-none animate-float-slow"
          ></div>
          <div
            class="absolute top-[39%] right-[41%] w-80 h-80 bg-brand/10 lg:bg-brand/20 rounded-full blur-3xl pointer-events-none animate-float-slower"
          ></div>
          <div
            class="hero-carousel relative aspect-square rounded-surface overflow-hidden shadow-overlay"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            @touchcancel="onTouchCancel"
          >
            <AppPicture
              v-if="previousImage"
              :key="`${previousImage.src}-${currentImage.src}`"
              :src="previousImage.src"
              :alt="previousImage.label"
              img-class="absolute inset-0 w-full h-full object-cover hero-image hero-image--out"
              sizes="(max-width: 1024px) 100vw, min(50vw, 512px)"
            />
            <AppPicture
              :key="currentImage.src"
              :src="currentImage.src"
              :alt="currentImage.label"
              img-class="absolute inset-0 w-full h-full object-cover hero-image"
              :eager="initialHeroImagePhase && currentImageIndex === 0"
              sizes="(max-width: 1024px) 100vw, min(50vw, 512px)"
            />

            <p
              class="absolute bottom-3 left-3 rounded-control border border-line bg-surface/90 px-3 py-1.5 text-meta font-semibold uppercase tracking-[0.1em] text-ink-muted shadow-panel backdrop-blur-xs"
            >
              {{ currentImage.label }}
            </p>
          </div>
        </div>

        <!-- -my-2.5 keeps the row 24px tall while the button stays a 44px target. -->
        <div class="flex justify-center mt-2">
          <button
            v-for="(_, index) in showcaseImages"
            :key="index"
            @click="goToImage(index)"
            class="size-11 -my-2.5 grid place-items-center group rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            :aria-label="`Image ${index + 1}`"
          >
            <span
              class="block h-2 rounded-full transition-[width,background-color]"
              :class="
                currentImageIndex === index
                  ? 'bg-brand w-6'
                  : 'w-2 bg-line-strong group-hover:bg-brand/50'
              "
            />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes hero-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.hero-image--out {
  animation: hero-fade-out var(--duration-long) var(--ease-out) forwards;
}

@keyframes float-slow {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, 10px) scale(1.05);
  }
  50% {
    transform: translate(-20px, 35px) scale(0.95);
  }
  75% {
    transform: translate(20px, 50px) scale(1.08);
  }
}

@keyframes float-slower {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-50px, 35px) scale(1.1);
  }
  66% {
    transform: translate(35px, -40px) scale(0.92);
  }
}

.animate-float-slow {
  animation: float-slow 15s var(--ease-in-out) infinite;
}

.animate-float-slower {
  animation: float-slower 20s var(--ease-in-out) infinite;
}

.hero-carousel {
  touch-action: pan-y;
  user-select: none;
}
</style>
