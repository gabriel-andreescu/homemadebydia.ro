import { nextTick, onUnmounted, watch, type Ref } from "vue";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

export function useDialogA11y(
  isOpen: Ref<boolean>,
  dialogRef: Ref<HTMLElement | null>,
  onClose: () => void,
) {
  let previousFocus: HTMLElement | null = null;

  const handleKeydown = (event: KeyboardEvent) => {
    const dialogEl = dialogRef.value;
    if (!dialogEl) return;

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = Array.from(
      dialogEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => !el.hasAttribute("disabled"));

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialogEl.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement | null;

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  watch(isOpen, async (open) => {
    if (open) {
      previousFocus = document.activeElement as HTMLElement | null;
      window.addEventListener("keydown", handleKeydown);

      await nextTick();
      const dialogEl = dialogRef.value;
      if (!dialogEl) return;

      const firstFocusable = dialogEl.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (firstFocusable ?? dialogEl).focus();
      return;
    }

    window.removeEventListener("keydown", handleKeydown);
    previousFocus?.focus();
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
}
