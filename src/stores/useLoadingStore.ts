import { create } from 'zustand';

interface LoadingState {
  visible: boolean;
  message: string;
  counter: number;
}

interface LoadingStore {
  // Global loading (covers entire screen)
  global: LoadingState;
  // Content-area loading (only covers main content, excludes header/sidebar)
  content: LoadingState;
  
  // Global loading methods
  showGlobal: (message?: string) => void;
  hideGlobal: () => void;
  setGlobalMessage: (message: string) => void;
  
  // Content-area loading methods
  showContent: (message?: string) => void;
  hideContent: () => void;
  setContentMessage: (message: string) => void;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  global: {
    visible: false,
    message: 'Loading',
    counter: 0,
  },
  content: {
    visible: false,
    message: 'Loading content',
    counter: 0,
  },
  
  showGlobal: (nextMessage?: string) => {
    const currentState = get().global;
    const newCounter = Math.max(0, currentState.counter + 1);
    
    set({ 
      global: {
        counter: newCounter,
        visible: true,
        message: nextMessage || currentState.message
      }
    });
  },
  
  hideGlobal: () => {
    const currentState = get().global;
    const newCounter = Math.max(0, currentState.counter - 1);
    
    set({ 
      global: {
        counter: newCounter,
        visible: newCounter > 0,
        message: newCounter === 0 ? 'Loading' : currentState.message
      }
    });
  },
  
  setGlobalMessage: (nextMessage: string) => {
    const currentState = get().global;
    set({ 
      global: {
        ...currentState,
        message: nextMessage || 'Loading'
      }
    });
  },
  
  showContent: (nextMessage?: string) => {
    const currentState = get().content;
    const newCounter = Math.max(0, currentState.counter + 1);
    
    set({ 
      content: {
        counter: newCounter,
        visible: true,
        message: nextMessage || currentState.message
      }
    });
  },
  
  hideContent: () => {
    const currentState = get().content;
    const newCounter = Math.max(0, currentState.counter - 1);
    
    set({ 
      content: {
        counter: newCounter,
        visible: newCounter > 0,
        message: newCounter === 0 ? 'Loading content' : currentState.message
      }
    });
  },
  
  setContentMessage: (nextMessage: string) => {
    const currentState = get().content;
    set({ 
      content: {
        ...currentState,
        message: nextMessage || 'Loading content'
      }
    });
  }
}));

// Backwards compatibility hooks
export const useGlobalLoading = () => {
  const { global, showGlobal, hideGlobal, setGlobalMessage } = useLoadingStore();
  return {
    visible: global.visible,
    message: global.message,
    show: showGlobal,
    hide: hideGlobal,
    setMessage: setGlobalMessage
  };
};

export const useContentLoading = () => {
  const { content, showContent, hideContent, setContentMessage } = useLoadingStore();
  return {
    visible: content.visible,
    message: content.message,
    show: showContent,
    hide: hideContent,
    setMessage: setContentMessage
  };
};

// Backwards compatibility - original useLoadingStore interface that maps to global loading  
export const useOriginalLoadingStore = () => {
  const { global, showGlobal, hideGlobal, setGlobalMessage } = useLoadingStore();
  return {
    visible: global.visible,
    message: global.message,
    show: showGlobal,
    hide: hideGlobal,
    setMessage: setGlobalMessage
  };
};