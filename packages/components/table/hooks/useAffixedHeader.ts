import { createContext, useContext } from 'react';

/**
 * 表头吸顶和虚拟滚动都会在常规表头之外额外渲染一份表头，
 * 同一列因此存在两份表头单元格。用于让表头单元格内部的组件感知自己属于哪一份表头。
 */
export const AffixedHeaderContext = createContext(false);

export function useIsAffixedHeader() {
  return useContext(AffixedHeaderContext);
}
