import React from 'react';
import { TdCollapseProps, CollapseValue, CollapsePanelValue } from './type';

const CollapseContext = React.createContext<{
  defaultExpandAll?: TdCollapseProps['defaultExpandAll'];
  disabled?: TdCollapseProps['disabled'];
  expandIconPlacement?: TdCollapseProps['expandIconPlacement'];
  expandOnRowClick?: TdCollapseProps['expandOnRowClick'];
  expandIcon?: TdCollapseProps['expandIcon'];
  updateCollapseValue?: (v: CollapsePanelValue, context?: { e: React.MouseEvent }) => void;
  collapseValue?: CollapseValue;
}>({
  defaultExpandAll: false,
  disabled: false,
  expandIconPlacement: 'left',
  expandOnRowClick: true,
  expandIcon: true,
});

export const useCollapseContext = () => React.useContext(CollapseContext);
export default CollapseContext;
