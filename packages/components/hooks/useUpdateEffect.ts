import { useEffect } from 'react';
import type { DependencyList, EffectCallback } from 'react';
import useIsFirstRender from './useIsFirstRender';

const useUpdateEffect = (callback: EffectCallback, dependency: DependencyList) => {
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (isFirstRender) return;

    return callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependency);
};

export default useUpdateEffect;
