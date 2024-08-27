<script setup lang="ts">
import AppSocialLinks from "./AppSocialLinks.vue";
</script>

<template>
  <footer class="mt-16 lg:mt-32">
    <section class="flex justify-between">
      <section
        id="cum-sa-comanzi"
        class="flex flex-col pt-16 lg:pt-32 lg:pl-8 px-2 grow bg-gradient-to-r from-transparent to-nude"
      >
        <h2 class="text-4xl lg:text-6xl mb-10">Cum să comanzi</h2>
        <div class="how-to-order-paragraphs">
          <p>― Alege un produs potrivit gusturilor tale</p>
          <p>― Consultă-ne pentru a lua cea mai bună decizie</p>
          <p>― Stabilește împreună cu noi data și ora la care vrei să fie gata comanda</p>
          <p>― Te așteptăm la locația noastră să îți ridici comanda</p>
        </div>
        <section class="flex h-full mt-2 md:w-1/2 lg:mt-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11370.733221679735!2d25.9309805!3d44.562586!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xfbb397e844540bfb!2sHomemade%20by%20Dia!5e0!3m2!1sro!2sro!4v1670659460931!5m2!1sro!2sro"
            class="border-0 border-none min-w-full"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
        <section id="contact" class="h-full flex flex-col lg:flex-row lg:items-end">
          <div>
            <h1 class="text-2xl lg:text-4xl text-accent mt-10">Homemade by Dia</h1>
            <AppSocialLinks class="max-lg:h-auto max-lg:py-2 lg:justify-center" :center="false" />
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
      <div class="bg-nude">
        <picture class="hidden 2xl:block max-h-screen">
          <source srcset="/gallery/footer.webp" type="image/webp" />
          <source srcset="/gallery/footer.jpg" type="image/jpeg" />
          <img
            src="/gallery/footer.jpg"
            alt="poză cu un tort văzut de sus"
            class="hidden 2xl:block max-h-screen"
          />
        </picture>
      </div>
    </section>
  </footer>
</template>

<style scoped>
.how-to-order-paragraphs p {
  @apply text-lg lg:text-xl mb-4;
}
</style>
