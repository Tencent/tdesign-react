import { useMemo, useState, useCallback } from 'react';
import type { MutableRefObject } from 'react';
import { THEME_MODE } from '@tdesign/common-js/common';
import getColorTokenColor from '@tdesign/common-js/utils/getColorTokenColor';
import useMutationObservable from './useMutationObserver';

/**
 * useVariables Hook - 监听CSS变量变化并返回实时值
 * @param variables CSS 变量名对象，键为返回对象的属性名，值为CSS变量名（带--前缀）
 * @returns 包含每个变量当前值的ref对象
 * @example
 *   const { textColor, brandColor } = useVariables({
 *      textColor: '--td-text-color-primary',
 *      brandColor: '--td-brand-color',
 *   });
 *   
 *   // 使用变量值
 *   console.log(textColor.current); // 获取当前文本颜色
 */
function useVariables<T extends Record<string, string>>(
  variables: T
): Record<keyof T, MutableRefObject<string>> {
  const [, forceUpdate] = useState<Record<string, never>>({});
  
  // 确保 variables 参数有效
  if (!variables || Object.keys(variables).length === 0) {
    throw new Error('useVariables: variables parameter cannot be empty');
  }
  
  const refs = useMemo(() => {
    const values = {} as Record<keyof T, MutableRefObject<string>>;
    
    // 为每个变量创建ref并获取初始值
    Object.entries(variables).forEach(([key, varName]) => {
      try {
        const initialValue = getColorTokenColor(varName);
        values[key as keyof T] = { current: initialValue };
      } catch (error) {
        console.warn(`Failed to get initial value for CSS variable ${varName}:`, error);
        values[key as keyof T] = { current: '' };
      }
    });
    
    return values;
  }, [variables]);

  // 缓存更新函数，避免每次渲染都创建新函数
  const updateVariables = useCallback(() => {
    try {
      Object.entries(variables).forEach(([key, varName]) => {
        const newValue = getColorTokenColor(varName);
        if (refs[key as keyof T] && refs[key as keyof T].current !== newValue) {
          refs[key as keyof T].current = newValue;
        }
      });
      forceUpdate({});
    } catch (error) {
      console.warn('Failed to update CSS variables:', error);
    }
  }, [variables, refs]);

  const targetElement = typeof document !== 'undefined' ? document.documentElement : null;
  
  useMutationObservable(targetElement, (mutationsList) => {
    // 使用 for 循环而不是 some，提高性能
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === THEME_MODE) {
        updateVariables();
        return;
      }
    }
  });

  return refs;
}

export default useVariables;
