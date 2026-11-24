import React, { createContext, useMemo } from 'react';

export interface IndexesContextValue {
  relation: (ele: HTMLElement, index: string | number) => void;
}
export const IndexesContext = createContext<IndexesContextValue | null>(null);

export function IndexesProvider({ value, children }) {
  const memoValue = useMemo(() => value, [value]);
  return <IndexesContext.Provider value={memoValue}>{children}</IndexesContext.Provider>;
}
