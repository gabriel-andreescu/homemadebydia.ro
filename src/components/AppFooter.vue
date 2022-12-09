<script setup lang="ts">
import AppSocialLinks from "./AppSocialLinks.vue";
</script>

<template>
  <footer class="mt-16 lg:mt-32">
    <section class="flex justify-between">
      <section
        id="cum-sa-comanzi"
        class="flex flex-col pt-16 lg:pt-32 lg:pl-8 pl-2 items-start grow bg-gradient-to-r from-transparent to-nude"
      >
        <h2 class="text-4xl lg:text-6xl mb-10">Cum să comanzi</h2>
        <div class="how-to-order-paragraphs">
          <p>― Alege un produs potrivit gusturilor tale</p>
          <p>― Consultă-ne pentru a lua cea mai bună decizie</p>
          <p>― Stabilește împreună cu noi data și ora la care vrei să fie gata comanda</p>
          <p>― Te așteptăm la locația noastră să îți ridici comanda</p>
        </div>
        <section class="h-full flex flex-col lg:flex-row lg:items-end">
          <div>
            <h1 class="text-2xl lg:text-4xl text-accent mt-10">Homemade by Dia</h1>
            <AppSocialLinks class="max-lg:h-auto max-lg:py-2" />
          </div>
          <div class="mb-4 lg:h-32 lg:mb-0 flex lg:items-center">
            <p class="text-2xl flex flex-col items-start">
              <a
                href="tel:+40787283917"
                class="mb-2 underline hover:text-accent-dark cursor-pointer transition-colors duration-200"
              >
                +0787 283 917
              </a>
              <a
                href="mailto:diana@homemadebydia.ro"
                class="underline hover:text-accent-dark cursor-pointer transition-colors duration-200"
              >
                diana@homemadebydia.ro
              </a>
            </p>
          </div>
        </section>
      </section>
      <div>
        <img
          src="/gallery/footer.jpg"
          class="hidden lg:block max-h-screen"
          alt="poză cu un tort văzut de sus"
        />
      </div>
    </section>
  </footer>
</template>

<style scoped>
.how-to-order-paragraphs p {
  @apply text-lg lg:text-xl mb-4;
}
</style>
