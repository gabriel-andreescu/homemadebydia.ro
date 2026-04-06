<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import AppDeferredMedia from "./AppDeferredMedia.vue";
import AppPicture from "./AppPicture.vue";

const { t } = useI18n();
const expanded = ref(false);
const sectionRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLElement | null>(null);

function toggle() {
  if (expanded.value) {
    // Collapsing - scroll so the collapsible content is visible, then collapse
    const rect = sectionRef.value?.getBoundingClientRect();
    const imageHeight = imageRef.value?.offsetHeight ?? 200;
    if (rect) {
      // Scroll to half the image height below section top
      const targetY = window.scrollY + rect.top + imageHeight / 2;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
    setTimeout(() => {
      expanded.value = false;
    }, 400);
  } else {
    expanded.value = true;
  }
}
</script>

<template>
  <section ref="sectionRef" class="max-w-3xl mx-auto p-4">
    <div ref="imageRef" class="overflow-hidden rounded-xl shadow-lg mb-6 aspect-[16/9]">
      <AppDeferredMedia
        wrapper-class="w-full h-full"
        placeholder-class="w-full h-full bg-gray-200 dark:bg-gray-700"
      >
        <AppPicture
          src="/gallery/about-us"
          :alt="t('aboutUs.imageAlt')"
          img-class="w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </AppDeferredMedia>
    </div>

    <div class="relative p-5 bg-gray-50 dark:bg-gray-800/70 rounded-xl shadow-sm">
      <!-- Always visible: intro + p1 -->
      <p class="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {{ t("aboutUs.intro") }}
      </p>
      <p class="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        {{ t("aboutUs.p1") }}
      </p>

      <!-- Collapsible content -->
      <div
        class="grid transition-[grid-template-rows] duration-500 ease-out"
        :class="expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden">
          <p class="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t("aboutUs.p2") }}
          </p>
          <p class="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t("aboutUs.p3") }}
          </p>
          <p class="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t("aboutUs.p4") }}
          </p>
          <p class="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {{ t("aboutUs.p5") }}
          </p>
          <p class="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ t("aboutUs.p6") }}
          </p>
        </div>
      </div>

      <!-- Gradient fade overlay - extends to bottom of card -->
      <div
        class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none transition-opacity duration-300 rounded-b-xl"
        :class="expanded ? 'opacity-0' : 'opacity-100'"
      ></div>

      <!-- Read more button -->
      <button
        @click="toggle"
        class="relative z-10 mt-4 group flex items-center gap-2 mx-auto px-5 py-2.5 text-sm font-medium bg-accent dark:bg-accent text-white rounded-full shadow-md shadow-accent/20 dark:shadow-accent/30 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-300"
      >
        <span>{{ expanded ? t("aboutUs.readLess") : t("aboutUs.readMore") }}</span>
        <svg
          class="w-4 h-4 transition-transform duration-300"
          :class="expanded ? 'rotate-180' : ''"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  </section>
</template>
