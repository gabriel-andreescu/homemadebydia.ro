<script setup lang="ts">
import { makeResponsiveSrcset } from "../utils/responsiveImages";

withDefaults(
  defineProps<{
    src: string;
    alt: string;
    imgClass?: string;
    eager?: boolean;
    sizes?: string;
  }>(),
  {
    eager: false,
  },
);

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <picture>
    <source
      :srcset="makeResponsiveSrcset(src, 'avif')"
      type="image/avif"
      :sizes="sizes"
    />
    <source
      :srcset="makeResponsiveSrcset(src, 'webp')"
      type="image/webp"
      :sizes="sizes"
    />
    <img
      :src="`${src}.w640.jpg`"
      :srcset="makeResponsiveSrcset(src, 'jpg')"
      :sizes="sizes"
      :alt="alt"
      :class="imgClass"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
      decoding="async"
      @click="$emit('click', $event)"
    />
  </picture>
</template>
