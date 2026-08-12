import { useEffect, useRef } from 'react';
import { isEqualWith } from 'lodash-es';

/**
 * 与 useEffect 用法一致，但对依赖数组进行深比较
 * - 只在依赖真正变化时才会触发副作用函数
 * - 适用于依赖为复杂对象的场景
 */
function useDeepEffect(effect: React.EffectCallback, deps: React.DependencyList) {
  const isInitial = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isSame = isEqualWith(prevDeps.current, deps, (value1, value2) => {
      // 函数类型比较字符串表示
      if (typeof value1 === 'function' && typeof value2 === 'function') {
        return value1.toString() === value2.toString();
      }
      // 其他类型使用默认比较
      return undefined;
    });

    if (isInitial.current || !isSame) {
      effect();
    }

    isInitial.current = false;
    prevDeps.current = deps;
  }, [effect, deps]);
}

export default useDeepEffect;
