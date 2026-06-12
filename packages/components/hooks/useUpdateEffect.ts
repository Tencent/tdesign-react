import { useEffect } from 'react';

import useIsFirstRender from './useIsFirstRender';

import type { DependencyList, EffectCallback } from 'react';

const useUpdateEffect = (callback: EffectCallback, dependency: DependencyList) => {
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (isFirstRender) return;

    return callback();
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, dependency);
};

export default useUpdateEffect;
