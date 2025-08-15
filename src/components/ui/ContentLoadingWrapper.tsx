import { ReactNode, useEffect } from 'react';
import { useContentLoading } from '@/hooks/useContentLoading';
import { useContentLoading as useContentLoadingStore } from '@/stores/useLoadingStore';
import { UseQueryResult } from '@tanstack/react-query';

interface ContentLoadingWrapperProps {
  children: ReactNode;
  queries?: UseQueryResult<any> | UseQueryResult<any>[];
  isLoading?: boolean;
  message?: string;
  enabled?: boolean;
  className?: string;
}

/**
 * Wrapper component that shows content-area loading for its children
 * Can be used with React Query results or manual loading state
 */
export function ContentLoadingWrapper({
  children,
  queries,
  isLoading: manualLoading,
  message = 'Loading content',
  enabled = true,
  className = ''
}: ContentLoadingWrapperProps) {
  // Get manual loading controls
  const { show, hide } = useContentLoadingStore();

  // If queries are provided, use the hook to manage loading from React Query
  if (queries && enabled) {
    useContentLoading(queries, { message, enabled });
  }
  
  // If manual loading is provided and enabled, use the manual loading state
  useEffect(() => {
    if (manualLoading && enabled && !queries) {
      show(message);
    } else if (!manualLoading && enabled && !queries) {
      hide();
    }
    
    return () => {
      if (!queries) hide();
    };
  }, [manualLoading, enabled, message, queries, show, hide]);

  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}