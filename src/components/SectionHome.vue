<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import AppSocialLinks from "./AppSocialLinks.vue";
import AppPicture from "./AppPicture.vue";
import { useScrollTo } from "../composables/useScrollTo";

const { t } = useI18n();
const { scrollTo } = useScrollTo();

// Hero showcase images
const showcaseImages = [
  "/gallery/gallery/29",
  "/gallery/gallery/28",
  "/gallery/gallery/27",
  "/gallery/gallery/25",
  "/gallery/gallery/20",
];

const currentImageIndex = ref(0);

let intervalId: number | undefined;

const rotateToNextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % showcaseImages.length;
};

onMounted(() => {
  intervalId = window.setInterval(rotateToNextImage, 4000);
});

onUnmounted(() => {
  if (intervalId !== undefined) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <section class="w-full min-h-[calc(100svh-8rem)] flex items-center relative overflow-visible">
    <!-- Floating decorative elements (outside overflow containers) -->
    <div
      class="absolute top-[15%] right-[15%] w-64 h-64 bg-accent/[0.15] lg:bg-accent/25 dark:bg-accent/20 dark:lg:bg-accent/35 rounded-full blur-3xl pointer-events-none animate-float-slow"
    ></div>
    <div
      class="absolute bottom-[15%] right-[25%] w-80 h-80 bg-accent/10 lg:bg-accent/20 dark:bg-accent/15 dark:lg:bg-accent/30 rounded-full blur-3xl pointer-events-none animate-float-slower"
    ></div>

    <div
      class="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 px-4 lg:px-8 max-w-7xl mx-auto w-full"
    >
      <!-- Left: Text content -->
      <div class="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-8 lg:pt-0 lg:self-center">
        <h1 class="text-4xl font-serif mb-4 text-gray-900 dark:text-gray-100">
          {{ t("home.title") }}
          <br />
          {{ t("home.titleLine2") }}
        </h1>

        <p
          class="text-gray-600 dark:text-gray-400 mb-6 flex flex-col sm:flex-row sm:flex-wrap justify-center lg:justify-start gap-x-4 gap-y-1"
        >
          <span>{{ t("home.naturalIngredients") }}</span>
          <span>{{ t("home.licensedWorkshop") }}</span>
          <span>{{ t("home.madeToOrder") }}</span>
        </p>

        <button
          @click="scrollTo('catalog')"
          class="mb-6 px-8 py-3 bg-accent dark:bg-accent text-white text-lg font-medium tracking-wide rounded-full shadow-md shadow-accent/20 dark:shadow-accent/30 hover:scale-105 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-accent dark:focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all duration-300"
        >
          {{ t("home.viewCatalog") }}
        </button>

        <AppSocialLinks />
      </div>

      <!-- Right: Image showcase -->
      <div class="flex-1 relative w-full max-w-md lg:max-w-none">
        <div
          class="relative aspect-[3/4] lg:aspect-auto lg:h-[calc(100svh-12rem)] rounded-3xl overflow-hidden shadow-2xl"
        >
          <!-- Images with crossfade -->
          <TransitionGroup name="fade">
            <AppPicture
              v-for="(img, index) in showcaseImages"
              v-show="currentImageIndex === index"
              :key="img"
              :src="img"
              :alt="t('accessibility.heroShowcase')"
              img-class="absolute inset-0 w-full h-full object-cover"
              :eager="index === 0"
              sizes="(max-width: 1024px) 100vw, min(50vw, 640px)"
            />
          </TransitionGroup>

          <!-- Decorative frame -->
          <div
            class="absolute inset-0 rounded-3xl ring-4 ring-accent/20 dark:ring-accent/30 pointer-events-none"
          ></div>
        </div>

        <!-- Dots indicator -->
        <div class="flex justify-center gap-1 mt-4">
          <button
            v-for="(_, index) in showcaseImages"
            :key="index"
            @click="currentImageIndex = index"
            class="p-3 group"
            :aria-label="`Image ${index + 1}`"
          >
            <span
              class="block h-2 rounded-full transition-all duration-300"
              :class="
                currentImageIndex === index
                  ? 'bg-accent dark:bg-accent w-6'
                  : 'w-2 bg-gray-300 dark:bg-gray-600 group-hover:bg-accent/50 dark:group-hover:bg-accent/50'
              "
            />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes float-slow {
  0%, 100% {
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
  0%, 100% {
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
  animation: float-slow 15s ease-in-out infinite;
}

.animate-float-slower {
  animation: float-slower 20s ease-in-out infinite;
}
</style>
