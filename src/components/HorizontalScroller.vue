<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, onUpdated, ref } from "vue";

defineProps<{
  gradientClass?: string;
  gradientHeight?: string;
}>();

const emit = defineEmits<{
  (e: "end-visible"): void;
}>();

const scrollerRef = ref<HTMLElement | null>(null);
let isScrolling = false;

// Hide the right gradient "glow" when the last item is fully visible
const isAtEnd = ref(false);
let endObserver: IntersectionObserver | null = null;
let observedLastElement: HTMLElement | null = null;

function setupEndObserver() {
  const root = scrollerRef.value;
  const last = root?.lastElementChild as HTMLElement | null;

  if (!root || !last) {
    isAtEnd.value = true;
    observedLastElement = null;
    endObserver?.disconnect();
    endObserver = null;
    return;
  }

  const didLastElementChange = observedLastElement !== last;
  observedLastElement = last;

  // Only reset when the actual tail item changes; this avoids re-observe loops on normal updates.
  if (didLastElementChange) {
    isAtEnd.value = false;
  }

  endObserver?.disconnect();
  endObserver = null;

  endObserver = new IntersectionObserver(
    ([entry]) => {
      // 0.99 avoids flaky "never hits 1.0" due to subpixel rounding.
      const nextIsAtEnd = entry.isIntersecting && entry.intersectionRatio >= 0.99;
      if (nextIsAtEnd && !isAtEnd.value) {
        emit("end-visible");
      }
      isAtEnd.value = nextIsAtEnd;
    },
    { root, threshold: [0, 0.5, 0.99] },
  );

  endObserver.observe(last);
}

onMounted(() => nextTick(setupEndObserver));
onUpdated(() => nextTick(setupEndObserver));
onBeforeUnmount(() => endObserver?.disconnect());

function onWheel(e: WheelEvent) {
  if (!scrollerRef.value) return;

  // Handle horizontal tilt OR shift+vertical scroll
  const isHorizontalTilt = Math.abs(e.deltaX) >= 10;
  const isShiftScroll = e.shiftKey && Math.abs(e.deltaY) >= 10;

  if (!isHorizontalTilt && !isShiftScroll) return;

  const firstChild = scrollerRef.value.firstElementChild as HTMLElement;
  if (!firstChild) return;

  e.preventDefault();
  if (isScrolling) return;

  isScrolling = true;
  const itemWidth = firstChild.offsetWidth + 12; // width + gap
  const delta = isHorizontalTilt ? e.deltaX : e.deltaY;
  const direction = delta > 0 ? 1 : -1;

  scrollerRef.value.scrollBy({ left: direction * itemWidth, behavior: "smooth" });

  setTimeout(() => (isScrolling = false), 300);
}
</script>

<template>
  <div class="relative w-full">
    <div
      ref="scrollerRef"
      class="scroller flex gap-3 overflow-x-scroll py-4 snap-x snap-mandatory"
      @wheel="onWheel"
    >
      <slot />
    </div>
    <div
      class="absolute top-4 right-0 w-32 pointer-events-none bg-gradient-to-l from-10% via-50% to-transparent origin-right transition-[opacity,transform] duration-300 ease-out"
      :class="[
        gradientClass || 'from-white via-white/50 dark:from-gray-900 dark:via-gray-900/50',
        gradientHeight || 'h-[calc(100%-2rem)]',
        isAtEnd ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100',
      ]"
    ></div>
  </div>
</template>

<style scoped lang="postcss">
/* Mobile-first: hide scrollbar */
.scroller {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

/* Desktop: custom scrollbar */
@screen md {
  .scroller {
    scrollbar-width: thin;
    scrollbar-color: theme("colors.accent.light") transparent;

    &::-webkit-scrollbar {
      display: block;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: theme("colors.accent.light");
      border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
}
</style>
