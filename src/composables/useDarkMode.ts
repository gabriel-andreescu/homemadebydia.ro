import { ref, watch, onMounted } from 'vue';

const STORAGE_KEY = 'theme-preference';

type Theme = 'light' | 'dark' | 'system';

const theme = ref<Theme>('system');
const isDark = ref(false);

function getSystemPreference(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(dark: boolean) {
  isDark.value = dark;
  document.documentElement.classList.toggle('dark', dark);
}

function updateTheme() {
  const shouldBeDark = theme.value === 'system' 
    ? getSystemPreference() 
    : theme.value === 'dark';
  applyTheme(shouldBeDark);
}

function setTheme(newTheme: Theme) {
  theme.value = newTheme;
  localStorage.setItem(STORAGE_KEY, newTheme);
  updateTheme();
}

function toggle() {
  // Cycle: system -> light -> dark -> system (or just light <-> dark if explicitly set)
  if (isDark.value) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}

function init() {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    theme.value = stored;
  }
  updateTheme();

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme.value === 'system') {
      updateTheme();
    }
  });
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

// Initialize immediately to prevent flash
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = stored === 'dark' || (stored !== 'light' && prefersDark);
  document.documentElement.classList.toggle('dark', shouldBeDark);
}

