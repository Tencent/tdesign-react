import React, { useMemo } from 'react';
import { useDeepCompareMemoize } from './useDeepCompareMemoize';

export function useDeepCompareMemo<T>(factory: () => T, deps: React.DependencyList) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, useDeepCompareMemoize(deps));
}
