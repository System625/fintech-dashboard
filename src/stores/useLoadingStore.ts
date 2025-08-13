import { create } from 'zustand';

interface LoadingStore {
  visible: boolean;
  message: string;
  counter: number;
  show: (message?: string) => void;
  hide: () => void;
  setMessage: (message: string) => void;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  visible: false,
  message: 'Loading',
  counter: 0,
  
  show: (nextMessage?: string) => {
    const currentCounter = get().counter;
    const newCounter = Math.max(0, currentCounter + 1);
    
    set({ 
      counter: newCounter, 
      visible: true,
      message: nextMessage || get().message
    });
  },
  
  hide: () => {
    const currentCounter = get().counter;
    const newCounter = Math.max(0, currentCounter - 1);
    
    set({ 
      counter: newCounter,
      visible: newCounter > 0,
      message: newCounter === 0 ? 'Loading' : get().message
    });
  },
  
  setMessage: (nextMessage: string) => {
    set({ message: nextMessage || 'Loading' });
  }
}));