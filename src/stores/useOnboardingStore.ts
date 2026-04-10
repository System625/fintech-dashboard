import { create } from 'zustand';

interface OnboardingStore {
  completed: boolean;
  markCompleted: () => void;
  reset: () => void;
}

const STORAGE_KEY = 'budgetpunk-onboarding-completed';

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  completed: localStorage.getItem(STORAGE_KEY) === 'true',

  markCompleted: () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    set({ completed: true });
  },

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ completed: false });
  },
}));
