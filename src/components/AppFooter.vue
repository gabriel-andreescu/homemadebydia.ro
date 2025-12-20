<script setup lang="ts">
import { useI18n } from "vue-i18n";
import AppSocialLinks from "./AppSocialLinks.vue";
import AppPicture from "./AppPicture.vue";
import IconGoogle from "./icons/IconGoogle.vue";
import IconMail from "./icons/IconMail.vue";
import IconMapPin from "./icons/IconMapPin.vue";
import IconPhone from "./icons/IconPhone.vue";
import { CONTACT } from "../constants";

const { t } = useI18n();
</script>

<template>
  <footer class="mt-16 lg:mt-32">
    <section class="flex flex-col xl:flex-row">
      <section
        class="flex flex-col w-full xl:w-1/2 pt-16 lg:pl-8 px-2 bg-gradient-to-r from-transparent to-nude dark:bg-none"
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
        <div class="flex items-center gap-3 my-6">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ t("footer.didYouLike") }}</span>
          <a
            :href="CONTACT.googleReview"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent dark:bg-accent text-white rounded-full shadow-md shadow-accent/20 dark:shadow-accent/30 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-300"
          >
            <IconGoogle class="w-4 h-4" />
            {{ t("footer.leaveReview") }}
          </a>
        </div>
        <section class="flex h-80">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11370.733221679735!2d25.9309805!3d44.562586!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xfbb397e844540bfb!2sHomemade%20by%20Dia!5e0!3m2!1sro!2sro!4v1670659460931!5m2!1sro!2sro"
            class="border-0 border-none min-w-full"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
        <section id="contact" class="mt-6 flex flex-col">
          <AppSocialLinks class="h-auto mb-2" :center="false" />
          <div class="mb-4 flex">
            <div class="lg:text-lg flex flex-col gap-2">
              <a
                :href="`tel:${CONTACT.phone}`"
                class="inline-flex items-center gap-2 underline hover:text-accent-dark dark:hover:text-accent-light cursor-pointer transition-colors duration-300"
              >
                <IconPhone class="w-5 h-5 shrink-0" aria-hidden="true" />
                <span class="sr-only">{{ t("accessibility.callNow") }}:</span>
                {{ CONTACT.phoneDisplay }}
              </a>
              <a
                :href="`mailto:${CONTACT.email}`"
                class="inline-flex items-center gap-2 underline hover:text-accent-dark dark:hover:text-accent-light cursor-pointer transition-colors duration-300"
              >
                <IconMail class="w-5 h-5 shrink-0" aria-hidden="true" />
                <span class="sr-only">{{ t("accessibility.sendEmail") }}:</span>
                {{ CONTACT.email }}
              </a>
              <a
                :href="CONTACT.maps"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 underline hover:text-accent-dark dark:hover:text-accent-light cursor-pointer transition-colors duration-300"
              >
                <IconMapPin class="w-5 h-5 shrink-0" aria-hidden="true" />
                <span class="sr-only">{{ t("accessibility.openInMaps") }}:</span>
                {{ t("contact.address") }}
              </a>
            </div>
          </div>
        </section>
      </section>
      <section class="hidden xl:block xl:w-1/2 bg-nude dark:bg-none self-end">
        <!-- Footer images are gradient-heavy; keep them as hand-tuned originals (no responsive variants). -->
        <img
          src="/gallery/footer.jpg"
          :alt="t('footer.cakeTopViewAlt')"
          class="w-full max-w-full h-auto object-cover dark:hidden max-h-[min(100vh,1284px)]"
          loading="lazy"
          decoding="async"
        />
        <img
          src="/gallery/footer-dark.min.png"
          :alt="t('footer.cakeTopViewAlt')"
          class="hidden dark:block w-full max-w-full h-auto object-cover max-h-[min(100vh,1284px)]"
          loading="lazy"
          decoding="async"
        />
      </section>
    </section>
  </footer>
</template>

<style scoped>
.how-to-order-paragraphs p {
  @apply lg:text-lg mb-4;
}
</style>
