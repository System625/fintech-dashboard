import { useEffect, useRef } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { useGlobalLoading } from '@/stores/useLoadingStore';

function QueryLoadingBinder() {
  const isFetching = useIsFetching();
  const { show, hide } = useGlobalLoading();
  const prevRef = useRef(0);

  useEffect(() => {
    // Simple pattern: show loading when fetching starts, hide when it stops
    if (prevRef.current === 0 && isFetching > 0) {
      show('Loading data');
    } else if (prevRef.current > 0 && isFetching === 0) {
      hide();
    }
    prevRef.current = isFetching;
  }, [isFetching, show, hide]);

  return null;
}

export default QueryLoadingBinder;


