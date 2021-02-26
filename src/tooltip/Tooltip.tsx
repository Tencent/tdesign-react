import React, { forwardRef } from 'react';
import Popup, { PopupProps } from '../popup';

export interface TooltipProps extends PopupProps {
  /**
   * 文字提示风格
   * @default default
   */
  theme?: 'default' | 'primary' | 'success' | 'danger' | 'warning';
  /**
   * 是否显示小箭头
   * @default true
   */
  showArrow?: boolean;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(() => (
  <>
    <Popup />
  </>
));

Tooltip.displayName = 'Tooltip';

export default Tooltip;
