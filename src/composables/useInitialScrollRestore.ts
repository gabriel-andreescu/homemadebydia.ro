import { nextTick, onMounted, onUnmounted } from "vue";
import { getHash } from "./useHash";
import type { RevealSectionsUpTo } from "./useLazySectionMounting";

const HASH_TARGET_ALIGNMENT_TOLERANCE = 24;
const HASH_TARGET_SHIFT_THRESHOLD = 64;
const NAVIGATION_SCROLL_STORAGE_KEY = "hbd:navigation-scroll-y";
const NAVIGATION_SCROLL_RESTORE_DELTA_THRESHOLD = 200;
const NAVIGATION_RESTORE_CHECKPOINTS = [
  "galerie",
  "despre-noi",
  "de-ce-noi",
  "testimoniale",
  "cum-sa-comanzi",
] as const;

interface InitialScrollRestoreOptions {
  revealSectionsUpTo: RevealSectionsUpTo;
}

export function useInitialScrollRestore({
  revealSectionsUpTo,
}: InitialScrollRestoreOptions) {
  const waitForAnimationFrame = () =>
    new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });

  const withInstantScrollBehavior = (action: () => void) => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    action();

    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
    });
  };

  const jumpToScrollY = (top: number) => {
    withInstantScrollBehavior(() => {
      window.scrollTo(0, top);
    });
  };

  const scrollTargetIntoView = (target: HTMLElement) => {
    withInstantScrollBehavior(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    });
  };

  const getHashTargetAlignedTop = () => {
    const scrollPaddingTop = Number.parseFloat(
      window.getComputedStyle(document.documentElement).scrollPaddingTop,
    );
    return Number.isFinite(scrollPaddingTop) ? scrollPaddingTop : 0;
  };

  const getNavigationType = () => {
    const navigationEntry = performance.getEntriesByType("navigation")[0];

    if (
      navigationEntry &&
      "type" in navigationEntry &&
      typeof navigationEntry.type === "string"
    ) {
      return navigationEntry.type as PerformanceNavigationTiming["type"];
    }

    // If Navigation Timing Level 2 is unavailable, skip the document-load enhancement
    // and let the browser's native restoration behavior stand on its own.
    return null;
  };

  const getSessionStorageItem = (key: string) => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const setSessionStorageItem = (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Ignore blocked storage so scroll restoration quietly falls back to native behavior.
    }
  };

  const removeSessionStorageItem = (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Ignore blocked storage so scroll restoration quietly falls back to native behavior.
    }
  };

  const getMaxScrollableY = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const needsNavigationScrollRecovery = (savedScrollY: number, currentScrollY: number) =>
    savedScrollY > currentScrollY + NAVIGATION_SCROLL_RESTORE_DELTA_THRESHOLD;

  const saveNavigationScrollPosition = () => {
    setSessionStorageItem(NAVIGATION_SCROLL_STORAGE_KEY, String(window.scrollY));
  };

  const getStoredNavigationScrollPosition = () => {
    const stored = getSessionStorageItem(NAVIGATION_SCROLL_STORAGE_KEY);
    removeSessionStorageItem(NAVIGATION_SCROLL_STORAGE_KEY);
    if (!stored) return null;

    const scrollY = Number.parseFloat(stored);
    return Number.isFinite(scrollY) ? scrollY : null;
  };

  const restoreInitialHashTargetIfNeeded = async () => {
    const hashTargetId = getHash();
    if (!hashTargetId) return;

    const initialTargetTop = document.getElementById(hashTargetId)?.getBoundingClientRect().top ?? null;

    await revealSectionsUpTo(hashTargetId);
    await nextTick();
    await waitForAnimationFrame();

    const target = document.getElementById(hashTargetId);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const targetBelowViewport = rect.top > window.innerHeight;
    const targetShiftedMaterially =
      initialTargetTop !== null && Math.abs(rect.top - initialTargetTop) > HASH_TARGET_SHIFT_THRESHOLD;
    const alignedTop = getHashTargetAlignedTop();
    const targetMisalignedAfterShift =
      targetShiftedMaterially &&
      Math.abs(rect.top - alignedTop) > HASH_TARGET_ALIGNMENT_TOLERANCE;

    // Let the browser handle native history restoration when it succeeds.
    // Only step in when lazy content left the target below the viewport
    // or materially displaced from its aligned position.
    if (targetBelowViewport || targetMisalignedAfterShift) {
      scrollTargetIntoView(target);
    }
  };

  const revealUntilScrollable = async (savedScrollY: number) => {
    for (const checkpoint of NAVIGATION_RESTORE_CHECKPOINTS) {
      if (getMaxScrollableY() >= savedScrollY - NAVIGATION_SCROLL_RESTORE_DELTA_THRESHOLD) {
        return;
      }

      await revealSectionsUpTo(checkpoint);
      await nextTick();
      await waitForAnimationFrame();
    }
  };

  const restoreNavigationScrollPositionIfNeeded = async () => {
    if (getHash()) return;

    const navigationType = getNavigationType();
    if (navigationType !== "reload" && navigationType !== "back_forward") return;

    const storedScrollY = getStoredNavigationScrollPosition();
    if (storedScrollY === null) return;
    if (!needsNavigationScrollRecovery(storedScrollY, window.scrollY)) return;

    await revealUntilScrollable(storedScrollY);

    if (needsNavigationScrollRecovery(storedScrollY, window.scrollY)) {
      jumpToScrollY(storedScrollY);
    }
  };

  onMounted(() => {
    window.addEventListener("pagehide", saveNavigationScrollPosition);
    void restoreInitialHashTargetIfNeeded();
    void restoreNavigationScrollPositionIfNeeded();
  });

  onUnmounted(() => {
    window.removeEventListener("pagehide", saveNavigationScrollPosition);
  });
}
