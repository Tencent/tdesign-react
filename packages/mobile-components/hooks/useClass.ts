import { useMemo } from 'react';
import useConfig from './useConfig';

export function usePrefixClass(componentName?: string) {
  const { classPrefix } = useConfig();

  return useMemo(() => (componentName ? `${classPrefix}-${componentName}` : classPrefix), [classPrefix, componentName]);
}
