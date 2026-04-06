import { onMounted, ref } from "vue";

const STORAGE_KEY = "theme-preference";

type Theme = "light" | "dark" | "system";

const theme = ref<Theme>("system");
const isDark = ref(false);

let initialized = false;
let stopSystemListener: (() => void) | null = null;

function getSystemPreference(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(dark: boolean) {
  isDark.value = dark;
  document.documentElement.classList.toggle("dark", dark);
}

function updateTheme() {
  const shouldBeDark = theme.value === "system" ? getSystemPreference() : theme.value === "dark";
  applyTheme(shouldBeDark);
}

function setTheme(newTheme: Theme) {
  theme.value = newTheme;

  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, newTheme);
  }

  updateTheme();
}

function toggle() {
  if (isDark.value) {
    setTheme("light");
    return;
  }

  setTheme("dark");
}

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored && ["light", "dark", "system"].includes(stored)) {
    theme.value = stored;
  }

  updateTheme();

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (theme.value === "system") {
      updateTheme();
    }
  };

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", onSystemChange);
    stopSystemListener = () => mediaQuery.removeEventListener("change", onSystemChange);
    return;
  }

  mediaQuery.addListener(onSystemChange);
  stopSystemListener = () => mediaQuery.removeListener(onSystemChange);
}

export function useDarkMode() {
  onMounted(() => {
    init();
  });

  return {
    theme,
    isDark,
    toggle,
    setTheme,
  };
}

if (typeof window !== "undefined") {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = stored === "dark" || (stored !== "light" && prefersDark);
  document.documentElement.classList.toggle("dark", shouldBeDark);
}
