import { computed } from "vue";
import { useHead } from "@unhead/vue";
import { useI18n } from "vue-i18n";
import { CONTACT } from "../constants";
import {
  getHashForKey,
  getLocalePath,
  type SectionKey,
} from "../siteNavigation";
import type { Locale } from "../i18n";

const SITE_URL = "https://homemadebydia.ro";
const BUSINESS_NAME = "Homemade by Dia";
const OG_IMAGE_URL = `${SITE_URL}/hbd_og.jpg`;
const TWITTER_IMAGE_URL = `${SITE_URL}/hbd_twitter.jpg`;

const META_COPY: Record<Locale, { description: string; imageAlt: string; founderDescription: string }> =
  {
    ro: {
      description:
        "Laborator autorizat de cofetărie în Buftea (Ilfov). Torturi personalizate și prăjituri la comandă. Candy Bar pentru evenimente, cu ingrediente naturale.",
      imageAlt: "Candy bar cu prăjituri asortate și logo Homemade by Dia",
      founderDescription: "Concurentă la emisiunea Chefi la cuțite (sezonul 16)",
    },
    en: {
      description:
        "Licensed pastry workshop in Buftea (Ilfov). Custom cakes and made-to-order pastries. Candy Bar for events, made with natural ingredients.",
      imageAlt: "Candy bar with assorted desserts and the Homemade by Dia logo",
      founderDescription: "Contestant on the Chefi la cuțite TV show (season 16)",
    },
  };

const WEBPAGE_DESCRIPTION: Record<Locale, string> = {
  ro: "Descoperă cofetăria Homemade by Dia din Buftea, unde toate produsele sunt realizate din ingrediente naturale. Savurează gusturi autentice și delicioase!",
  en: "Discover Homemade by Dia in Buftea, where every dessert is made with natural ingredients and crafted to order.",
};

export function useSiteHead() {
  const { t, locale } = useI18n();

  const currentLocale = computed(() => locale.value as Locale);
  const canonicalUrl = computed(() => new URL(getLocalePath(currentLocale.value), SITE_URL).toString());
  const ogLocale = computed(() => (currentLocale.value === "ro" ? "ro_RO" : "en_US"));
  const alternateOgLocale = computed(() => (currentLocale.value === "ro" ? "en_US" : "ro_RO"));
  const metaCopy = computed(() => META_COPY[currentLocale.value]);
  const navigationSections = computed<
    { key: SectionKey; name: string; description: string; url: string }[]
  >(() => {
    const localeValue = currentLocale.value;

    return [
      {
        key: "catalog",
        name: t("nav.catalog"),
        description:
          localeValue === "ro"
            ? "Torturi, prăjituri și fursecuri artizanale"
            : "Custom cakes, pastries, and artisan desserts",
        url: `${canonicalUrl.value}${getHashForKey("catalog", localeValue)}`,
      },
      {
        key: "gallery",
        name: t("nav.gallery"),
        description:
          localeValue === "ro" ? "Creațiile noastre în imagini" : "A visual gallery of our creations",
        url: `${canonicalUrl.value}${getHashForKey("gallery", localeValue)}`,
      },
      {
        key: "aboutUs",
        name: t("nav.aboutUs"),
        description:
          localeValue === "ro" ? "Povestea cofetăriei Homemade by Dia" : "The story behind Homemade by Dia",
        url: `${canonicalUrl.value}${getHashForKey("aboutUs", localeValue)}`,
      },
      {
        key: "whyUs",
        name: t("nav.whyUs"),
        description:
          localeValue === "ro"
            ? "Calitate, unicitate și profesionalism"
            : "Quality, uniqueness, and professionalism",
        url: `${canonicalUrl.value}${getHashForKey("whyUs", localeValue)}`,
      },
      {
        key: "reviews",
        name: t("nav.reviews"),
        description:
          localeValue === "ro" ? "Ce spun clienții noștri" : "What our clients say about us",
        url: `${canonicalUrl.value}${getHashForKey("reviews", localeValue)}`,
      },
      {
        key: "howToOrder",
        name: t("nav.howToOrder"),
        description:
          localeValue === "ro" ? "Ghid de plasare comandă" : "How to place an order",
        url: `${canonicalUrl.value}${getHashForKey("howToOrder", localeValue)}`,
      },
      {
        key: "contact",
        name: t("nav.contact"),
        description:
          localeValue === "ro" ? "Contactează-ne pentru comenzi" : "Get in touch to place an order",
        url: `${canonicalUrl.value}${getHashForKey("contact", localeValue)}`,
      },
    ];
  });

  const structuredData = computed(() =>
    JSON.stringify(
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Bakery",
            "@id": `${canonicalUrl.value}#business`,
            name: BUSINESS_NAME,
            description: metaCopy.value.description,
            url: canonicalUrl.value,
            mainEntityOfPage: canonicalUrl.value,
            logo: `${SITE_URL}/logo.svg`,
            image: [OG_IMAGE_URL, `${SITE_URL}/gallery/cakes/tort-fistic-zmeura.jpg`],
            telephone: "(+40) 787 283 917",
            priceRange: "$$",
            openingHours: "Mo-Su 09:00-18:00",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Cloșca 22A",
              addressLocality: "Buftea",
              addressRegion: "Ilfov",
              postalCode: "070000",
              addressCountry: "RO",
            },
            sameAs: [CONTACT.facebook],
            founder: {
              "@type": "Person",
              name: "Diana Andreescu",
              jobTitle: currentLocale.value === "ro" ? "Cofetar" : "Pastry chef",
              description: metaCopy.value.founderDescription,
              sameAs: [
                "https://www.facebook.com/diana.anitei1996",
                "https://www.instagram.com/diana.andreescu19",
                "https://www.facebook.com/ChefiLaCutite/photos/1257994683029871/",
                "https://a1.ro/chefi-la-cutite/video/chefi-la-cutite-sezonul-16-30-noiembrie-2025-diana-andreescu-cofetar-a-venit-insotita-de-mama-fostului-ei-prieten-am-ramas-prietene-id1148073.html",
              ],
            },
          },
          {
            "@type": "WebPage",
            "@id": `${canonicalUrl.value}#webpage`,
            name: t("meta.title"),
            url: canonicalUrl.value,
            inLanguage: currentLocale.value,
            description: WEBPAGE_DESCRIPTION[currentLocale.value],
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: OG_IMAGE_URL,
              caption: metaCopy.value.imageAlt,
            },
            mainEntity: {
              "@id": `${canonicalUrl.value}#business`,
            },
            hasPart: navigationSections.value.map((section) => ({
              "@type": "SiteNavigationElement",
              name: section.name,
              description: section.description,
              url: section.url,
            })),
          },
          {
            "@type": "HowTo",
            name: t("howToOrder.title"),
            description:
              currentLocale.value === "ro"
                ? "Află cum să plasezi o comandă pentru torturi și prăjituri de la Homemade by Dia."
                : "Learn how to place a cake or pastry order with Homemade by Dia.",
            step: [
              {
                "@type": "HowToStep",
                name: t("howToOrder.step1"),
                text: t("howToOrder.step1"),
                url: `${canonicalUrl.value}${getHashForKey("catalog", currentLocale.value)}`,
              },
              {
                "@type": "HowToStep",
                name: t("howToOrder.step2"),
                text: t("howToOrder.step2"),
                url: `${canonicalUrl.value}${getHashForKey("catalog", currentLocale.value)}`,
              },
              {
                "@type": "HowToStep",
                name: t("howToOrder.step3"),
                text: t("howToOrder.step3"),
                url: `${canonicalUrl.value}${getHashForKey("contact", currentLocale.value)}`,
              },
              {
                "@type": "HowToStep",
                name: t("howToOrder.step4"),
                text: t("howToOrder.step4"),
                url: `${canonicalUrl.value}${getHashForKey("howToOrder", currentLocale.value)}`,
              },
            ],
          },
        ],
      },
      null,
      0,
    ),
  );

  useHead(() => ({
    htmlAttrs: {
      lang: currentLocale.value,
    },
    title: t("meta.title"),
    meta: [
      {
        name: "description",
        content: metaCopy.value.description,
      },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large",
      },
      {
        name: "googlebot",
        content: "index, follow, max-image-preview:large",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:locale",
        content: ogLocale.value,
      },
      {
        property: "og:locale:alternate",
        content: alternateOgLocale.value,
      },
      {
        property: "og:url",
        content: canonicalUrl.value,
      },
      {
        property: "og:title",
        content: t("meta.title"),
      },
      {
        property: "og:description",
        content: metaCopy.value.description,
      },
      {
        property: "og:image",
        content: OG_IMAGE_URL,
      },
      {
        property: "og:image:alt",
        content: metaCopy.value.imageAlt,
      },
      {
        property: "og:image:width",
        content: "1200",
      },
      {
        property: "og:image:height",
        content: "630",
      },
      {
        property: "og:site_name",
        content: BUSINESS_NAME,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: t("meta.title"),
      },
      {
        name: "twitter:description",
        content: metaCopy.value.description,
      },
      {
        name: "twitter:image",
        content: TWITTER_IMAGE_URL,
      },
      {
        name: "twitter:image:alt",
        content: metaCopy.value.imageAlt,
      },
    ],
    link: [
      {
        rel: "canonical",
        href: canonicalUrl.value,
      },
      {
        rel: "alternate",
        hreflang: "ro",
        href: new URL(getLocalePath("ro"), SITE_URL).toString(),
      },
      {
        rel: "alternate",
        hreflang: "en",
        href: new URL(getLocalePath("en"), SITE_URL).toString(),
      },
      {
        rel: "alternate",
        hreflang: "x-default",
        href: new URL(getLocalePath("ro"), SITE_URL).toString(),
      },
    ],
    script: [
      {
        key: "structured-data",
        type: "application/ld+json",
        textContent: structuredData.value,
      },
    ],
  }));

  return {
    canonicalUrl,
  };
}
