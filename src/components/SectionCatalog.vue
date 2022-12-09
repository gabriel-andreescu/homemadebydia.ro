<script setup lang="ts">
import AppTabs from "./AppTabs.vue";
import AppTab from "./AppTab.vue";
import SectionCatalogGallery from "./SectionCatalogGallery.vue";
import cakes from "../assets/cakes.json";
import cookies from "../assets/cookies.json";
import pastry from "../assets/pastry.json";
</script>

<template>
  <AppTabs class="">
    <AppTab title="Torturi" tab-key="torturi">
      <SectionCatalogGallery :data="cakes" />
    </AppTab>
    <AppTab title="Prăjituri" tab-key="prajituri">
      <SectionCatalogGallery :data="cookies" />
    </AppTab>
    <AppTab title="Patiserie" tab-key="patiserie">
      <SectionCatalogGallery :data="pastry" />
    </AppTab>
  </AppTabs>
</template>
