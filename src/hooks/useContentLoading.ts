import { useEffect, useMemo } from 'react';
import { useContentLoading as useContentLoadingStore } from '@/stores/useLoadingStore';
import { UseQueryResult } from '@tanstack/react-query';

/**
 * Hook to manage content-area loading for React Query operations
 * Use this instead of global loading for tab switches and internal navigation
 */
export function useContentLoading<T = unknown>(
  query: UseQueryResult<T> | UseQueryResult<T>[],
  options: {
    message?: string;
    enabled?: boolean;
  } = {}
) {
  const { show, hide } = useContentLoadingStore();
  const { message = 'Loading content', enabled = true } = options;

  // Derive per-query state booleans for stable memoization
  const queryIsLoading = Array.isArray(query) ? query.some(q => q.isLoading) : query.isLoading;
  const queryIsFetching = Array.isArray(query) ? query.some(q => q.isFetching) : query.isFetching;
  const queryHasError = Array.isArray(query) ? query.some(q => !!q.error) : !!query.error;

  // Memoize loading and error states to prevent unnecessary re-renders
  const { isLoading, hasError } = useMemo(() => {
    if (!enabled) return { isLoading: false, hasError: false };
    return {
      isLoading: queryIsLoading || queryIsFetching,
      hasError: queryHasError,
    };
  }, [enabled, queryIsLoading, queryIsFetching, queryHasError]);

  useEffect(() => {
    if (!enabled) return;

    if (isLoading && !hasError) {
      show(message);
    } else {
      hide();
    }

    // Cleanup on unmount
    return () => hide();
  }, [isLoading, hasError, show, hide, message, enabled]);
}

/**
 * Hook for manual content loading control
 */
export function useManualContentLoading() {
  const { show, hide, visible, setMessage } = useContentLoadingStore();
  
  return {
    show,
    hide,
    visible,
    setMessage,
    showWithMessage: (message: string) => show(message),
  };
}