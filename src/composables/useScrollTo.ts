import { setHash } from "./useHash";
import { revealLazySectionsForTarget } from "./useLazySectionReveal";

const FOOTER_SENTINEL_ID = "footer-sentinel";
const LAZY_FOOTER_TARGET_IDS = new Set(["cum-sa-comanzi", "contact"]);
const TARGET_WAIT_TIMEOUT_MS = 4000;

function waitForAnimationFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

function waitForElementAndScroll(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const observer = new MutationObserver(() => {
    const lazyTarget = document.getElementById(id);
    if (!lazyTarget) return;

    lazyTarget.scrollIntoView({ behavior: "smooth" });
    observer.disconnect();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), TARGET_WAIT_TIMEOUT_MS);
}

export function useScrollTo() {
  async function scrollTo(id: string, updateHash = true) {
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (updateHash) setHash("");
      return;
    }

    await revealLazySectionsForTarget(id);
    await waitForAnimationFrame();

    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (LAZY_FOOTER_TARGET_IDS.has(id)) {
      // The footer is lazy-mounted; scroll near it first so it mounts, then scroll to the exact anchor.
      document.getElementById(FOOTER_SENTINEL_ID)?.scrollIntoView({ behavior: "smooth" });
      waitForElementAndScroll(id);
    }

    if (updateHash) setHash(id);
  }

  return { scrollTo };
}

