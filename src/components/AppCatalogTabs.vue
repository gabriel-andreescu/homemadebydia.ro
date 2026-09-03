<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { CatalogTabKey } from "../siteNavigation";

const props = defineProps<{
  tabs: { title: string; tabKey: CatalogTabKey }[];
  selected: CatalogTabKey | "";
}>();

defineEmits<{ select: [tabKey: CatalogTabKey] }>();

const strip = ref<HTMLElement | null>(null);
const indicator = ref({ left: 0, width: 0 });
const ready = ref(false);

const measure = () => {
  const active = strip.value?.querySelector<HTMLElement>('[aria-current="true"]');
  if (!active) {
    ready.value = false;
    return;
  }

  indicator.value = { left: active.offsetLeft, width: active.offsetWidth };
  ready.value = true;
};

// mount, the masthead's slide-in and the font swap can all land in one frame
let frame = 0;
const scheduleMeasure = () => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    measure();
  });
};

const remeasure = async () => {
  await nextTick();
  scheduleMeasure();
};

let observer: ResizeObserver | null = null;

onMounted(() => {
  void remeasure();

  // the strip also arrives inside the masthead's slide-in, so its width settles after mount
  if (typeof ResizeObserver !== "undefined" && strip.value) {
    observer = new ResizeObserver(scheduleMeasure);
    observer.observe(strip.value);
  }

  void document.fonts?.ready.then(scheduleMeasure);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  if (frame) cancelAnimationFrame(frame);
});

watch(() => [props.selected, props.tabs.map((tab) => tab.title).join("|")], remeasure);
</script>

<template>
  <!-- The caller owns the rule the active tab sits on. -->
  <ul ref="strip" class="tab-strip relative flex w-full overflow-x-auto">
    <li v-for="tab in tabs" :key="tab.tabKey">
      <button
        type="button"
        :aria-current="tab.tabKey === selected ? 'true' : undefined"
        class="-mb-px whitespace-nowrap px-3.5 pt-3 pb-3.5 text-ui font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
        :class="tab.tabKey === selected ? 'text-ink' : 'text-ink-muted hover:text-ink'"
        @click="$emit('select', tab.tabKey)"
      >
        {{ tab.title }}
      </button>
    </li>
    <!-- Sits where each button's own bottom border would, so the rule alignment is unchanged. -->
    <span
      v-show="ready"
      aria-hidden="true"
      class="tab-underline pointer-events-none absolute -bottom-px h-0.5 bg-brand"
      :style="{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }"
    ></span>
  </ul>
</template>

<style scoped>
.tab-strip {
  scrollbar-width: none;
}

.tab-strip::-webkit-scrollbar {
  display: none;
}

.tab-underline {
  transition:
    transform var(--duration-base) var(--ease-out),
    width var(--duration-base) var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .tab-underline {
    transition: none;
  }
}
</style>
