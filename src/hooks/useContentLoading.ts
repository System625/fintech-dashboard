import { useEffect, useMemo } from 'react';
import { useContentLoading as useContentLoadingStore } from '@/stores/useLoadingStore';
import { UseQueryResult } from '@tanstack/react-query';

/**
 * Hook to manage content-area loading for React Query operations
 * Use this instead of global loading for tab switches and internal navigation
 */
export function useContentLoading<T = any>(
  query: UseQueryResult<T> | UseQueryResult<T>[],
  options: {
    message?: string;
    enabled?: boolean;
  } = {}
) {
  const { show, hide } = useContentLoadingStore();
  const { message = 'Loading content', enabled = true } = options;

  // Memoize loading and error states to prevent unnecessary re-renders
  const { isLoading, hasError } = useMemo(() => {
    if (!enabled) return { isLoading: false, hasError: false };
    
    const queries = Array.isArray(query) ? query : [query];
    return {
      isLoading: queries.some(q => q.isLoading || q.isFetching),
      hasError: queries.some(q => q.error)
    };
  }, [
    query,
    enabled,
    // Dependencies for query state changes
    ...(Array.isArray(query) 
      ? query.flatMap(q => [q.isLoading, q.isFetching, !!q.error])
      : [query.isLoading, query.isFetching, !!query.error]
    )
  ]);

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