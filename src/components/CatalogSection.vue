<script setup lang="ts">
import AppTabs from "./AppTabs.vue";
import AppTab from "./AppTab.vue";
import CatalogGallery from "./CatalogGallery.vue";
import cakes from "../assets/cakes.json";
import cookies from "../assets/cookies.json";
import pastry from "../assets/pastry.json";
</script>

<template>
  <AppTabs>
    <AppTab title="Torturi" tab-key="torturi">
      <CatalogGallery :data="cakes" />
    </AppTab>
    <AppTab title="Prajituri" tab-key="prajituri">
      <CatalogGallery :data="cookies" />
    </AppTab>
    <AppTab title="Patiserie" tab-key="patiserie">
      <CatalogGallery :data="pastry" />
    </AppTab>
  </AppTabs>
</template>
