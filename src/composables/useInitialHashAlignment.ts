import { nextTick, onMounted, onUnmounted } from "vue";
import { getHash } from "./useHash";

const HASH_TARGET_ALIGNMENT_TOLERANCE = 24;
const HASH_TARGET_SHIFT_THRESHOLD = 64;

export function useInitialHashAlignment() {
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

  const shouldRealignTarget = (target: HTMLElement, initialTargetTop: number | null) => {
    const rect = target.getBoundingClientRect();
    const alignedTop = getHashTargetAlignedTop();
    const targetBelowViewport = rect.top > window.innerHeight;
    const targetShiftedMaterially =
      initialTargetTop !== null && Math.abs(rect.top - initialTargetTop) > HASH_TARGET_SHIFT_THRESHOLD;
    const targetMisalignedAfterShift =
      targetShiftedMaterially &&
      Math.abs(rect.top - alignedTop) > HASH_TARGET_ALIGNMENT_TOLERANCE;

    return targetBelowViewport || targetMisalignedAfterShift;
  };

  let removeLoadListener: (() => void) | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let alignmentQueued = false;
  let stopped = false;

  onMounted(() => {
    const hashTargetId = getHash();
    if (!hashTargetId) return;

    const initialTargetTop = document.getElementById(hashTargetId)?.getBoundingClientRect().top ?? null;

    const alignHashTargetIfNeeded = async () => {
      await nextTick();
      await waitForAnimationFrame();

      const target = document.getElementById(hashTargetId);
      if (!target) return;

      if (shouldRealignTarget(target, initialTargetTop)) {
        scrollTargetIntoView(target);
      }

      if (
        document.readyState === "complete" &&
        !shouldRealignTarget(target, initialTargetTop) &&
        resizeObserver
      ) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    };

    const queueAlignment = () => {
      if (stopped || alignmentQueued) return;

      alignmentQueued = true;
      void (async () => {
        try {
          await alignHashTargetIfNeeded();
        } finally {
          alignmentQueued = false;
        }
      })();
    };

    queueAlignment();

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        queueAlignment();
      });
      resizeObserver.observe(document.body);
    }

    if (document.readyState === "complete") return;

    const onLoad = () => {
      queueAlignment();
    };

    window.addEventListener("load", onLoad, { once: true });
    removeLoadListener = () => {
      window.removeEventListener("load", onLoad);
    };
  });

  onUnmounted(() => {
    stopped = true;
    removeLoadListener?.();
    removeLoadListener = null;
    resizeObserver?.disconnect();
    resizeObserver = null;
  });
}
