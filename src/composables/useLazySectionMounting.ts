import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { registerLazySectionReveal } from "./useLazySectionReveal";

const LAZY_SECTION_ROOT_MARGIN = "1200px 0px";

type Loader = () => Promise<unknown>;
type LazySectionKey = keyof LazySectionLoaders;

interface LazySectionLoaders {
  gallery: Loader;
  aboutUs: Loader;
  whyChooseUs: Loader;
  testimonials: Loader;
  footer: Loader;
}

export type RevealSectionsUpTo = (targetId: string) => Promise<void>;

const REVEAL_PATHS: Record<string, LazySectionKey[]> = {
  galerie: ["gallery"],
  "despre-noi": ["gallery", "aboutUs"],
  "de-ce-noi": ["gallery", "aboutUs", "whyChooseUs"],
  testimoniale: ["gallery", "aboutUs", "whyChooseUs", "testimonials"],
  "cum-sa-comanzi": ["gallery", "aboutUs", "whyChooseUs", "testimonials", "footer"],
  contact: ["gallery", "aboutUs", "whyChooseUs", "testimonials", "footer"],
};

export function useLazySectionMounting(loaders: LazySectionLoaders) {
  const showGallery = ref(false);
  const showAboutUs = ref(false);
  const showWhyChooseUs = ref(false);
  const showTestimonials = ref(false);
  const showFooter = ref(false);

  let galleryLazyObserver: IntersectionObserver | null = null;
  let aboutUsLazyObserver: IntersectionObserver | null = null;
  let whyChooseUsLazyObserver: IntersectionObserver | null = null;
  let testimonialsLazyObserver: IntersectionObserver | null = null;
  let footerLazyObserver: IntersectionObserver | null = null;

  const setupRevealObserver = (targetId: string, reveal: (visible: boolean) => void) => {
    const target = document.getElementById(targetId);
    if (!target) {
      reveal(true);
      return null;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          reveal(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: LAZY_SECTION_ROOT_MARGIN },
    );

    observer.observe(target);
    return observer;
  };

  const revealSectionsUpTo: RevealSectionsUpTo = async (targetId) => {
    const revealPath = REVEAL_PATHS[targetId];
    if (!revealPath) return;

    const preloadPromises: Promise<unknown>[] = [];

    const sectionVisibility: Record<LazySectionKey, typeof showGallery> = {
      gallery: showGallery,
      aboutUs: showAboutUs,
      whyChooseUs: showWhyChooseUs,
      testimonials: showTestimonials,
      footer: showFooter,
    };

    for (const sectionKey of revealPath) {
      const section = sectionVisibility[sectionKey];
      if (section.value) continue;

      section.value = true;
      preloadPromises.push(loaders[sectionKey]());
    }

    if (preloadPromises.length > 0) {
      await Promise.all(preloadPromises);
      await nextTick();
    }
  };

  const unregisterLazySectionReveal = registerLazySectionReveal(async (targetId) => {
    await revealSectionsUpTo(targetId);
  });

  onMounted(() => {
    if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
      showGallery.value = true;
      showAboutUs.value = true;
      showWhyChooseUs.value = true;
      showTestimonials.value = true;
      showFooter.value = true;
      return;
    }

    galleryLazyObserver = setupRevealObserver("galerie", (visible) => {
      showGallery.value = visible;
    });
    aboutUsLazyObserver = setupRevealObserver("despre-noi", (visible) => {
      showAboutUs.value = visible;
    });
    whyChooseUsLazyObserver = setupRevealObserver("de-ce-noi", (visible) => {
      showWhyChooseUs.value = visible;
    });
    testimonialsLazyObserver = setupRevealObserver("testimoniale", (visible) => {
      showTestimonials.value = visible;
    });
    footerLazyObserver = setupRevealObserver("footer-sentinel", (visible) => {
      showFooter.value = visible;
    });
  });

  onUnmounted(() => {
    galleryLazyObserver?.disconnect();
    aboutUsLazyObserver?.disconnect();
    whyChooseUsLazyObserver?.disconnect();
    testimonialsLazyObserver?.disconnect();
    footerLazyObserver?.disconnect();
    unregisterLazySectionReveal();
  });

  return {
    showGallery,
    showAboutUs,
    showWhyChooseUs,
    showTestimonials,
    showFooter,
    revealSectionsUpTo,
  };
}
