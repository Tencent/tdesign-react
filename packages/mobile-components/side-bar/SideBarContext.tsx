import React, { createContext, MutableRefObject, useMemo } from 'react';
import { ChangeHandler } from '../_util/useDefault';
import { TdSideBarProps } from './type';

interface BaseSidebarContext {
  defaultIndex: MutableRefObject<number>;
  activeValue: number | string | (number | string)[];
  updateChild: ChangeHandler<number | string | (number | string)[], any[]>;
  relation: (child: any) => void;
  removeRelation: (child: any) => void;
  onClickItem: (cur: any, label: any) => void;
}

/**
 * SideBarContext is a React context that stores the state and actions related to the SideBar component.
 */
export const SideBarContext = createContext<BaseSidebarContext & Pick<TdSideBarProps, 'onChange' | 'onClick'>>(null);

export function SideBarProvider({ children, value }) {
  const memoValue = useMemo(() => value, [value]);
  return <SideBarContext.Provider value={memoValue}>{children}</SideBarContext.Provider>;
}
