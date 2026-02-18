import { ref } from "vue";

interface UseHorizontalSwipeOptions {
  threshold?: number;
  velocityThreshold?: number;
  quickSwipeThresholdMultiplier?: number;
  isEnabled?: () => boolean;
  isInteractionBlocked?: () => boolean;
  canSwipeLeft?: () => boolean;
  canSwipeRight?: () => boolean;
  mapOffset?: (rawOffset: number) => number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const DEFAULT_THRESHOLD = 80;
const DEFAULT_VELOCITY_THRESHOLD = 0.3;
const DEFAULT_QUICK_SWIPE_THRESHOLD_MULTIPLIER = 0.5;

export function useHorizontalSwipe(options: UseHorizontalSwipeOptions = {}) {
  const touchStartX = ref(0);
  const touchStartTime = ref(0);
  const isDragging = ref(false);
  const dragOffset = ref(0);

  const threshold = options.threshold ?? DEFAULT_THRESHOLD;
  const velocityThreshold = options.velocityThreshold ?? DEFAULT_VELOCITY_THRESHOLD;
  const quickSwipeThresholdMultiplier =
    options.quickSwipeThresholdMultiplier ?? DEFAULT_QUICK_SWIPE_THRESHOLD_MULTIPLIER;

  const isEnabled = () => options.isEnabled?.() ?? true;
  const isInteractionBlocked = () => options.isInteractionBlocked?.() ?? false;
  const canSwipeLeft = () => options.canSwipeLeft?.() ?? true;
  const canSwipeRight = () => options.canSwipeRight?.() ?? true;
  const mapOffset = (rawOffset: number) => options.mapOffset?.(rawOffset) ?? rawOffset;

  const resetDrag = () => {
    dragOffset.value = 0;
  };

  const onTouchStart = (e: TouchEvent) => {
    if (!isEnabled() || isInteractionBlocked()) return;

    touchStartX.value = e.touches[0].clientX;
    touchStartTime.value = Date.now();
    isDragging.value = true;
    resetDrag();
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging.value || !isEnabled() || isInteractionBlocked()) return;

    const currentX = e.touches[0].clientX;
    const rawOffset = currentX - touchStartX.value;
    dragOffset.value = mapOffset(rawOffset);
  };

  const onTouchEnd = () => {
    if (!isDragging.value) return;

    isDragging.value = false;

    const elapsed = Math.max(Date.now() - touchStartTime.value, 1);
    const velocity = Math.abs(dragOffset.value) / elapsed;
    const isQuickSwipe = velocity > velocityThreshold;
    const swipeThreshold = isQuickSwipe ? threshold * quickSwipeThresholdMultiplier : threshold;

    if (dragOffset.value < -swipeThreshold && canSwipeLeft()) {
      resetDrag();
      options.onSwipeLeft?.();
      return;
    }

    if (dragOffset.value > swipeThreshold && canSwipeRight()) {
      resetDrag();
      options.onSwipeRight?.();
      return;
    }

    resetDrag();
  };

  const onTouchCancel = () => {
    if (!isDragging.value) return;
    isDragging.value = false;
    resetDrag();
  };

  return {
    isDragging,
    dragOffset,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  };
}
