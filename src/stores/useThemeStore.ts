import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

let mediaQueryCleanup: (() => void) | null = null;

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',
  
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    set({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  },
  
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    set({ theme: initialTheme });
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    
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
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Store cleanup function
    mediaQueryCleanup = () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }
}));