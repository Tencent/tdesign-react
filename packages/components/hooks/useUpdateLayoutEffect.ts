import useIsFirstRender from './useIsFirstRender';
import useIsomorphicLayoutEffect from './useLayoutEffect';

import type { DependencyList, EffectCallback } from 'react';

const useUpdateLayoutEffect = (callback: EffectCallback, dependency: DependencyList) => {
  const isFirstRender = useIsFirstRender();

  useIsomorphicLayoutEffect(() => {
    if (isFirstRender) return;

    return callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependency);
};

export default useUpdateLayoutEffect;
