import { computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { rememberLocalePreference, type Locale } from "../i18n";
import { useScrollTo } from "./useScrollTo";
import { getHash } from "./useHash";
import { getHashForKey, getKeyFromHash, getLocalePath } from "../siteNavigation";

export function useLocale() {
  const { locale } = useI18n();
  const router = useRouter();
  const { scrollTo } = useScrollTo();

  const currentLocale = computed(() => locale.value as Locale);
  const isEnglish = computed(() => locale.value === "en");
  const isRomanian = computed(() => locale.value === "ro");

  async function setLocale(nextLocale: Locale) {
    if (nextLocale === currentLocale.value) return;

    const currentKey = getKeyFromHash(getHash());
    const nextHash = currentKey ? getHashForKey(currentKey, nextLocale) : "";

    rememberLocalePreference(nextLocale);

    await router.push({
      path: getLocalePath(nextLocale),
      hash: nextHash,
    });

    if (currentKey) {
      await nextTick();
      await scrollTo(currentKey, false);
    }
  }

  async function toggleLocale() {
    await setLocale(currentLocale.value === "ro" ? "en" : "ro");
  }

  return {
    locale: currentLocale,
    isEnglish,
    isRomanian,
    setLocale,
    toggle: toggleLocale,
  };
}
