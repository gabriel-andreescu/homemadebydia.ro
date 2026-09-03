<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import AppDeferredMedia from "./AppDeferredMedia.vue";
import AppPicture from "./AppPicture.vue";

const STORY = ["intro", "p1", "p2", "p3", "p4", "p5", "p6"] as const;

const { t } = useI18n();
const expanded = ref(false);
const sectionRef = ref<HTMLElement | null>(null);

async function toggle() {
  expanded.value = !expanded.value;
  if (expanded.value) return;

  await nextTick();
  if (sectionRef.value && sectionRef.value.getBoundingClientRect().top < 0) {
    sectionRef.value.scrollIntoView({ block: "start" });
  }
}
</script>

<template>
  <div
    ref="sectionRef"
    class="w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
  >
    <div
      class="w-full max-w-lg mx-auto lg:mx-0 lg:flex-1 lg:max-w-none lg:order-2 lg:self-start aspect-[4/3] overflow-hidden rounded-surface"
    >
      <AppDeferredMedia
        wrapper-class="w-full h-full"
        placeholder-class="w-full h-full bg-surface-sunk"
      >
        <AppPicture
          src="/gallery/about-us"
          :alt="t('aboutUs.imageAlt')"
          img-class="w-full h-full object-cover"
          sizes="(max-width: 1023px) 100vw, (max-width: 1152px) 600px, (max-width: 1536px) 910px, 1230px"
        />
      </AppDeferredMedia>
    </div>

    <div class="w-full lg:w-[30rem] lg:flex-none flex flex-col items-start gap-4 lg:order-1">
      <p class="text-meta font-semibold uppercase tracking-[0.16em] text-ink-faint">
        {{ t("sections.aboutUs") }}
      </p>
      <h2 class="text-lede font-serif text-balance text-ink">
        {{ t("aboutUs.lede") }}
      </h2>

      <div
        class="-mt-4 grid transition-[grid-template-rows] duration-[var(--duration-long)] ease-in-out"
        :class="expanded ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'"
      >
        <div class="overflow-hidden">
          <p class="pt-4 text-body text-ink-muted leading-relaxed max-w-[56ch]">
            {{ t("aboutUs.summary") }}
          </p>
        </div>
      </div>

      <div
        class="-mt-4 grid transition-[grid-template-rows] duration-[var(--duration-long)] ease-in-out"
        :class="expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden">
          <div class="flex flex-col gap-4 pt-4">
            <p
              v-for="key in STORY"
              :key="key"
              class="text-body text-ink-muted leading-relaxed max-w-[56ch]"
            >
              {{ t(`aboutUs.${key}`) }}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="toggle"
        class="-my-3 py-3 text-ui font-semibold text-brand-ink hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded-control transition-colors"
      >
        <span class="border-b border-current pb-px">
          {{ expanded ? t("aboutUs.readLess") : t("aboutUs.readMore") }}
        </span>
      </button>
    </div>
  </div>
</template>
