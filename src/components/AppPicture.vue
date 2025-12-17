<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string;
    alt: string;
    imgClass?: string;
    eager?: boolean;
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
    <source :srcset="`${src}.webp`" type="image/webp" />
    <source :srcset="`${src}.jpg`" type="image/jpeg" />
    <img
      :src="`${src}.jpg`"
      :alt="alt"
      :class="imgClass"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
      @click="$emit('click', $event)"
    />
  </picture>
</template>
