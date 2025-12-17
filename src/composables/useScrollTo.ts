export function useScrollTo() {
  function scrollTo(id: string) {
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  }

  return { scrollTo };
}

