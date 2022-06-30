import React, { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

export const useDeepCompareEffect = (effect: React.EffectCallback, deps: any) => {
  const ref = useRef<any>();
  useEffect(() => {
    if (isEqual(ref.current, deps)) {
      return;
    }
    ref.current = cloneDeep(deps);
    effect();
  });
};
