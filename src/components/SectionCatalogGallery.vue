<script setup lang="ts">
interface CatalogGalleryDataItem {
  imageUrl: string;
  title: string;
  assortments?: string;
  desc?: string | string[];
  price: number;
  min?: number;
  unit?: string;
}

defineProps<{
  data: CatalogGalleryDataItem[];
}>();
</script>

<template>
  <div class="flex flex-wrap justify-center text-center">
    <div
      v-for="item in data"
      :key="item.title"
      class="flex flex-col w-64 lg:w-96 m-4 items-center bg-pink-50"
    >
      <div class="lg:w-96 lg:h-96 w-64 h-64 mb-1 overflow-hidden">
        <div v-if="Array.isArray(item.imageUrl)" class="grid grid-cols-2">
          <div v-for="image in item.imageUrl" :key="image" class="">
            <picture class="min-w-full object-cover">
              <source :srcset="image + '.webp'" type="image/webp" />
              <source :srcset="image + '.jpg'" type="image/jpeg" />
              <img
                :src="image + '.jpg'"
                :alt="item.title + ' la cofetăria Homemade by Dia din Buftea'"
                class="min-w-full object-cover"
              />
            </picture>
          </div>
        </div>
        <picture v-else class="lg:h-96 h-64 min-w-full object-cover">
          <source :srcset="item.imageUrl + '.webp'" type="image/webp" />
          <source :srcset="item.imageUrl + '.jpg'" type="image/jpeg" />
          <img
            :src="item.imageUrl + '.jpg'"
            :alt="item.title + ' la cofetăria Homemade by Dia din Buftea'"
            class="lg:h-96 h-64 min-w-full object-cover"
            loading="lazy"
          />
        </picture>
      </div>

      <h2 class="text-xl w-64 mt-0.5 font-medium" :class="{ 'mb-1': !item.assortments }">
        {{ item.title }}
      </h2>
      <h3 class="text-sm w-64 mb-1" v-if="item.assortments">
        {{ item.assortments }}
      </h3>
      <div v-if="item.desc" class="text-sm font-light text-left mb-1 p-2">
        <p v-for="desc in item.desc" :key="desc">
          {{ desc }}
        </p>
      </div>
      <p class="text-md" :class="{ 'mb-1': !item.min }">
        <span class="font-bold">{{ item.price }}</span>
        lei
        <span class="text-sm" v-if="item.unit">/{{ item.unit }}</span>
      </p>
      <p class="text-xs mb-2" v-if="item.min">(minim {{ item.min }} {{ item.unit }})</p>
    </div>
  </div>
</template>
