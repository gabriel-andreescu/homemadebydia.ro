<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const MEDIA_REVEAL_ROOT_MARGIN = "1200px 0px";

const props = withDefaults(
  defineProps<{
    tag?: string;
    wrapperClass?: string;
    placeholderClass?: string;
    rootMargin?: string;
  }>(),
  {
    tag: "div",
    wrapperClass: "",
    placeholderClass: "",
    rootMargin: MEDIA_REVEAL_ROOT_MARGIN,
  },
);

const revealed = ref(false);
const containerRef = ref<HTMLElement | null>(null);

let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (typeof window === "undefined") return;

  if (!("IntersectionObserver" in window)) {
    revealed.value = true;
    return;
  }

  const target = containerRef.value;
  if (!target) {
    revealed.value = true;
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;

      revealed.value = true;
      observer?.disconnect();
      observer = null;
    },
    { threshold: 0, rootMargin: props.rootMargin },
  );

  observer.observe(target);
});

onUnmounted(() => {
  observer?.disconnect();
  observer = null;
});
</script>

<template>
  <component :is="tag" ref="containerRef" :class="wrapperClass">
    <slot v-if="revealed" />
    <div v-else :class="placeholderClass" aria-hidden="true"></div>
  </component>
</template>
