import { isEqual } from 'lodash-es';
import { useEffect, useRef } from 'react';

/**
 * 与 useEffect 用法一致，但对依赖数组进行深比较
 * - 只在依赖项真正变化时才会触发副作用函数
 * - 适用于依赖为复杂对象的场景
 */
function useDeepEffect(effect, deps) {
  const isInitial = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isSame = isEqual(prevDeps.current, deps);

    if (isInitial.current || !isSame) {
      effect();
    }

    isInitial.current = false;
    prevDeps.current = deps;
  }, [effect, deps]);
}

export default useDeepEffect;
