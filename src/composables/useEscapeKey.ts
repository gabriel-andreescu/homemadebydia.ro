import { watch, onUnmounted, type Ref } from "vue";

export function useEscapeKey(isOpen: Ref<boolean>, onEscape: () => void) {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onEscape();
  };

  watch(isOpen, (open) => {
    if (open) {
      window.addEventListener("keydown", handleKeydown);
    } else {
      window.removeEventListener("keydown", handleKeydown);
    }
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
}

