<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
import CatalogSection from "./components/CatalogSection.vue";
import WhyChooseUsSection from "./components/WhyChooseUsSection.vue";
import AppSection from "./components/AppSection.vue";
import IconFacebook from "./components/IconFacebook.vue";
import IconMessenger from "./components/IconMessenger.vue";
import IconInstagram from "./components/IconInstagram.vue";
import IconWhatsapp from "./components/IconWhatsapp.vue";
</script>

<template>
  <NavBar />
  <header>
    <section class="flex h-96">
      <div class="h-full w-full flex items-center justify-center flex-col">
        <h2 class="text-6xl font-serif text-center mb-8">
          Laborator artizanal de
          <br />
          torturi si prajituri
        </h2>
        <p class="h-32 flex items-center justify-center">
          <a
            href="https://www.facebook.com/homemadebyDia"
            target="_blank"
            class="m-2"
          >
            <IconFacebook class="w-8 cursor-pointer hover:text-accent" />
          </a>
          <a href="https://m.me/homemadebyDia" target="_blank" class="m-2">
            <IconMessenger class="w-8 cursor-pointer hover:text-accent" />
          </a>
          <a
            href="https://www.instagram.com/homemade.by.dia"
            target="_blank"
            class="m-2"
          >
            <IconInstagram class="w-8 cursor-pointer hover:text-accent" />
          </a>
          <a href="whatsapp://send?phone=787283917" target="_blank" class="m-2">
            <IconWhatsapp class="w-8 cursor-pointer hover:text-accent" />
          </a>
        </p>
      </div>
    </section>
  </header>
  <main class="container mx-auto h-full">
    <AppSection title="Catalog" id="catalog">
      <CatalogSection />
    </AppSection>
    <AppSection title="De ce noi?" id="de-ce-noi">
      <WhyChooseUsSection />
    </AppSection>
  </main>
  <footer></footer>
</template>
