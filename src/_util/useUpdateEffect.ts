import { useLayoutEffect, useRef, DependencyList } from 'react';

const useUpdateEffect = (callback: () => void, dependency: DependencyList) => {
  const ref = useRef(false);

  useLayoutEffect(() => {
    if (!ref.current) {
      ref.current = true;
      return undefined;
    }

    return callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependency);
};

export default useUpdateEffect;
