import { setHash } from "./useHash";

export function useScrollTo() {
  function scrollTo(id: string, updateHash = true) {
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (updateHash) setHash("");
      return;
    }

    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    if (updateHash) setHash(id);
  }

  return { scrollTo };
}

