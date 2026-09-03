<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import AppDeferredMedia from "./AppDeferredMedia.vue";
import AppPicture from "./AppPicture.vue";
import IconMail from "./icons/IconMail.vue";
import IconMapPin from "./icons/IconMapPin.vue";
import IconPhone from "./icons/IconPhone.vue";
import IconWhatsapp from "./icons/IconWhatsapp.vue";
import { CONTACT } from "../constants";
import type { Locale } from "../i18n";
import { getLocalizedAnchor } from "../siteNavigation";

const { t, locale } = useI18n();
const currentLocale = computed(() => locale.value as Locale);
const howToOrderId = computed(() => getLocalizedAnchor("howToOrder", currentLocale.value));
const contactId = computed(() => getLocalizedAnchor("contact", currentLocale.value));
const steps = ["step1", "step2", "step3", "step4"] as const;
const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-16">
    <section :id="howToOrderId" class="bg-surface-sunk py-16">
      <div class="container mx-auto px-2">
        <p class="text-meta font-semibold uppercase tracking-[0.16em] text-ink-faint">
          {{ t("howToOrder.title") }}
        </p>
        <h2 class="mt-2 text-display font-serif text-balance">
          {{ t("howToOrder.heading") }}
        </h2>
        <ol class="mt-8 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 xl:grid-cols-4">
          <li v-for="(step, index) in steps" :key="step">
            <p class="text-body font-semibold text-brand-ink tabular-nums">
              {{ String(index + 1).padStart(2, "0") }}
            </p>
            <p class="mt-2 text-ink-muted leading-relaxed max-w-[40ch]">
              {{ t(`howToOrder.${step}`) }}
            </p>
          </li>
        </ol>
      </div>
    </section>

    <section :id="contactId" class="py-16">
      <div class="container mx-auto px-2 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div class="flex flex-col items-start gap-4">
          <p class="text-meta font-semibold uppercase tracking-[0.16em] text-ink-faint">
            {{ t("nav.contact") }}
          </p>
          <h2 class="text-display font-serif text-balance">
            {{ t("contact.heading") }}
          </h2>

          <div class="flex flex-col items-start">
            <a
              :href="`tel:${CONTACT.phone}`"
              class="inline-flex items-center gap-2 py-2.5 underline decoration-line-strong/70 underline-offset-4 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded-control transition-colors"
            >
              <IconPhone class="w-5 h-5 shrink-0" aria-hidden="true" />
              <span class="sr-only">{{ t("accessibility.callNow") }}:</span>
              {{ CONTACT.phoneDisplay }}
            </a>
            <a
              :href="`mailto:${CONTACT.email}`"
              class="inline-flex items-center gap-2 py-2.5 underline decoration-line-strong/70 underline-offset-4 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded-control transition-colors"
            >
              <IconMail class="w-5 h-5 shrink-0" aria-hidden="true" />
              <span class="sr-only">{{ t("accessibility.sendEmail") }}:</span>
              {{ CONTACT.email }}
            </a>
            <a
              :href="CONTACT.maps"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 py-2.5 underline decoration-line-strong/70 underline-offset-4 hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded-control transition-colors"
            >
              <IconMapPin class="w-5 h-5 shrink-0" aria-hidden="true" />
              <span class="sr-only">{{ t("accessibility.openInMaps") }}:</span>
              {{ t("contact.address") }}
            </a>
          </div>

          <div class="mt-2 flex flex-wrap gap-3">
            <a
              :href="CONTACT.whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-whatsapp text-on-whatsapp font-medium hover:brightness-95 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-[transform,filter]"
            >
              <IconWhatsapp class="w-5 h-5" aria-hidden="true" />
              {{ t("footer.writeWhatsApp") }}
            </a>
            <a
              :href="CONTACT.maps"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-line-strong font-medium hover:border-brand hover:text-brand-ink active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-[transform,color,border-color]"
            >
              <IconMapPin class="w-5 h-5" aria-hidden="true" />
              {{ t("footer.openMap") }}
            </a>
          </div>
        </div>

        <div class="aspect-[16/10] overflow-hidden rounded-surface">
          <AppDeferredMedia
            wrapper-class="w-full h-full"
            placeholder-class="w-full h-full bg-surface-sunk"
          >
            <AppPicture
              src="/gallery/footer"
              :alt="t('footer.cakeTopViewAlt')"
              img-class="w-full h-full object-cover"
              sizes="(max-width: 1024px) 100vw, 620px"
            />
          </AppDeferredMedia>
        </div>
      </div>
    </section>

    <section class="border-t border-line">
      <div
        class="container mx-auto px-2 py-6 flex flex-wrap items-center justify-between gap-4 text-meta text-ink-faint"
      >
        <p>© {{ year }} Homemade by Dia</p>
        <a
          href="https://reclamatiisal.anpc.ro/"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          :aria-label="t('footer.salBadgeAlt')"
        >
          <img
            src="/SAL-PICTOGRAMA.png"
            :alt="t('footer.salBadgeAlt')"
            width="201"
            height="50"
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>
    </section>
  </footer>
</template>
