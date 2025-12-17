<script setup lang="ts">
import { useI18n } from "vue-i18n";
import AppSocialLinks from "./AppSocialLinks.vue";
import AppPicture from "./AppPicture.vue";
import IconGoogle from "./icons/IconGoogle.vue";
import { CONTACT } from "../constants";

const { t } = useI18n();
</script>

<template>
  <footer class="mt-16 lg:mt-32">
    <section class="flex justify-between">
      <section
        class="flex flex-col pt-16 lg:pt-32 lg:pl-8 px-2 grow bg-gradient-to-r from-transparent to-nude dark:from-gray-900 dark:to-gray-800"
      >
        <h2 id="cum-sa-comanzi" class="text-4xl lg:text-6xl font-serif mb-10">
          {{ t("howToOrder.title") }}
        </h2>
        <div class="how-to-order-paragraphs">
          <p>{{ t("howToOrder.step1") }}</p>
          <p>{{ t("howToOrder.step2") }}</p>
          <p>{{ t("howToOrder.step3") }}</p>
          <p>{{ t("howToOrder.step4") }}</p>
        </div>
        <div class="flex items-center gap-3 mt-2 mb-6">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ t("footer.didYouLike") }}</span>
          <a
            :href="CONTACT.googleReview"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent dark:bg-accent-vivid text-white rounded-full shadow-md shadow-accent/20 dark:shadow-accent-vivid/30 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-300"
          >
            <IconGoogle class="w-4 h-4" />
            {{ t("footer.leaveReview") }}
          </a>
        </div>
        <section class="flex h-64 lg:h-80 md:w-1/2 lg:mt-2">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11370.733221679735!2d25.9309805!3d44.562586!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xfbb397e844540bfb!2sHomemade%20by%20Dia!5e0!3m2!1sro!2sro!4v1670659460931!5m2!1sro!2sro"
            class="border-0 border-none min-w-full"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
        <section id="contact" class="mt-auto pt-8 flex flex-col lg:flex-row lg:items-end">
          <div>
            <span class="text-2xl lg:text-4xl text-accent dark:text-accent-vivid mt-10">
              Homemade by Dia
            </span>
            <AppSocialLinks class="max-lg:h-auto max-lg:py-2 lg:justify-center" :center="false" />
          </div>
          <div class="mb-4 lg:h-32 lg:mb-0 flex lg:items-center">
            <p class="text-2xl flex flex-col items-start">
              <a
                :href="`tel:${CONTACT.phone}`"
                class="mb-2 underline hover:text-accent-dark dark:hover:text-accent-vivid cursor-pointer transition-colors duration-300"
              >
                {{ CONTACT.phoneDisplay }}
              </a>
              <a
                :href="`mailto:${CONTACT.email}`"
                class="underline hover:text-accent-dark dark:hover:text-accent-vivid cursor-pointer transition-colors duration-300"
              >
                {{ CONTACT.email }}
              </a>
            </p>
          </div>
        </section>
      </section>
      <div class="bg-nude dark:bg-gray-800">
        <AppPicture
          src="/gallery/footer"
          :alt="t('footer.cakeTopViewAlt')"
          img-class="hidden 2xl:block max-h-screen"
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
