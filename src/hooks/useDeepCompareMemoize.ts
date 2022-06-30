import React from 'react';
import isEqual from 'lodash/isEqual';

export function useDeepCompareMemoize(value: React.DependencyList) {
  const ref = React.useRef<React.DependencyList>([]);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}
