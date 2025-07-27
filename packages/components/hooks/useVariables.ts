import { useMemo, useState } from 'react';
import type { MutableRefObject } from 'react';
import { THEME_MODE } from '@tdesign/common-js/common';
import getColorTokenColorfrom from '@tdesign/common-js/utils/getColorTokenColor';
import useMutationObservable from './useMutationObserver';

/**
 * useVariables
 * @param variables CSS 变量名对象
 * @example
 *   const { textColor, brandColor } = useVariables({
 *      textColor: '--td-color-primary',
 *      brandColor: '--td-brand-color',
 *   });
 */
function useVariables<T extends Record<string, string>>(variables: T): Record<keyof T, MutableRefObject<string>> {
  const [, forceUpdate] = useState({});
  
  const refs = useMemo(() => {
    const values = {} as Record<keyof T, MutableRefObject<string>>;
    
    // 为每个变量创建ref
    Object.entries(variables).forEach(([key, varName]) => {
      values[key as keyof T] = { current: getColorTokenColorfrom(varName) };
    });
    
    return values;
  }, [variables]);

  const targetElement = document?.documentElement;
  
  useMutationObservable(targetElement, (mutationsList) => {
    mutationsList.some((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === THEME_MODE) {
        // 更新所有变量的值
        Object.entries(variables).forEach(([key, varName]) => {
          refs[key as keyof T].current = getColorTokenColorfrom(varName);
        });
        
        // 强制组件重新渲染以反映变化
        forceUpdate({});
        return true;
      }
      return false;
    });
  });

  return refs;
}

export default useVariables;
