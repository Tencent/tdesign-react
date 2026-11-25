import React, { createContext, useMemo } from 'react';

import type { MutableRefObject } from 'react';
import type { ChangeHandler } from '../_util/useDefault';
import type { TdTabBarProps } from './type';

export const TabBarContext = createContext<
  {
    defaultIndex: MutableRefObject<number>;
    activeValue: number | string | (number | string)[];
    updateChild: ChangeHandler<number | string | (number | string)[], any[]>;
    itemCount: number;
  } & Pick<TdTabBarProps, 'shape' | 'split' | 'theme'>
>(null);

export function TabBarProvider({ children, value }) {
  const memoValue = useMemo(() => value, [value]);
  return <TabBarContext.Provider value={memoValue}>{children}</TabBarContext.Provider>;
}
