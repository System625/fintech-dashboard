import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

interface LoadingContextValue {
  show: (message?: string) => void;
  hide: () => void;
  setMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function useLoading(): LoadingContextValue {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
}

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessageState] = useState<string>('Loading');
  const counterRef = useRef(0);

  const setMessage = useCallback((next: string) => {
    setMessageState(next || 'Loading');
  }, []);

  const show = useCallback((nextMessage?: string) => {
    counterRef.current = Math.max(0, counterRef.current + 1);
    if (nextMessage) setMessageState(nextMessage);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    counterRef.current = Math.max(0, counterRef.current - 1);
    if (counterRef.current === 0) {
      setVisible(false);
      setMessageState('Loading');
    }
  }, []);

  const value = useMemo(
    () => ({ show, hide, setMessage }),
    [show, hide, setMessage]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay visible={visible} message={message} />
    </LoadingContext.Provider>
  );
}

export default LoadingContext;


