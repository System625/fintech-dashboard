import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

let mediaQueryCleanup: (() => void) | null = null;

// Initialize theme synchronously to prevent flash
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme) return savedTheme;
  
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return systemPrefersDark ? 'dark' : 'light';
};

// Apply theme to document immediately
const applyThemeToDocument = (theme: Theme) => {
  if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
};

// Initialize theme immediately
const initialTheme = getInitialTheme();
applyThemeToDocument(initialTheme);

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initialTheme,
  
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    set({ theme: newTheme });
    applyThemeToDocument(newTheme);
    localStorage.setItem('theme', newTheme);
  },
  
  initializeTheme: () => {
    // Theme is already initialized synchronously, just set up listeners
    // Clean up any existing listener
    if (mediaQueryCleanup) {
      mediaQueryCleanup();
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        set({ theme: newTheme });
        applyThemeToDocument(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Store cleanup function
    mediaQueryCleanup = () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }
}));