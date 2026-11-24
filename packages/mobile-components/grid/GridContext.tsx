import React, { createContext, useMemo } from 'react';
import { TdGridProps } from './type';

export const GridContext = createContext<TdGridProps | null>(null);

interface GridProviderProps extends TdGridProps {
  children: React.ReactNode;
}

export function GirdProvider(props: GridProviderProps) {
  const { children, align, border, column, gutter, theme } = props;

  const memoValue = useMemo(
    () => ({
      align,
      border,
      column,
      gutter,
      theme,
    }),
    [align, border, column, gutter, theme],
  );

  return <GridContext.Provider value={memoValue}>{children}</GridContext.Provider>;
}
