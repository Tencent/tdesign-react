import React, { createContext, useMemo } from 'react';
import { TdStepsProps } from './type';

interface StepsContextProps {
  childrenNodes: HTMLElement[];
  current: TdStepsProps['current'];
  relation: (ele: HTMLElement) => void;
  removeRelation: (ele: HTMLElement) => void;
  onClickItem: TdStepsProps['onChange'];
  sequence: TdStepsProps['sequence'];
  currentStatus: TdStepsProps['currentStatus'];
  readonly: boolean;
  theme: TdStepsProps['theme'];
  layout: TdStepsProps['layout'];
}

export const StepsContext = createContext<StepsContextProps>(null);

export function StepsProvider({ value, children }) {
  const memoValue = useMemo(() => value, [value]);
  return <StepsContext.Provider value={memoValue}>{children}</StepsContext.Provider>;
}
