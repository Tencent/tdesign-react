import { createContext } from 'react';
import type { TNode } from '../common';
import type { CollapseValue } from './type';

export interface CollapseContextValue {
  activeValue: CollapseValue | undefined;
  disabled: boolean;
  expandIcon: TNode;
  onPanelChange: (
    name: string | number,
    args: { e: React.MouseEvent<HTMLDivElement> },
    isDefaultExpandAll?: boolean,
  ) => void;
  defaultExpandAll: boolean;
}

export const CollapseContext = createContext<CollapseContextValue | null>(null);

export const CollapseProvider = CollapseContext.Provider;
