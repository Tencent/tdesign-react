import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Popup, { PopupProps } from '../popup';
import useConfig from '../_util/useConfig';
export interface TooltipProps extends PopupProps {
  /**
   * 文字提示风格
   * @default default
   */
  theme?: 'default' | 'primary' | 'success' | 'danger' | 'warning';
  /**
   * 浮层是否显示箭头
   * @default true
   */
  showArrow?: boolean;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
  const { theme, showArrow = true, children } = props;
  const { classPrefix } = useConfig();
  return (
    <>
      <Popup
        ref={ref}
        {...props}
        showArrow={showArrow}
        overlayClassName={`${classPrefix}-tooltip ${theme ? `${classPrefix}-tooltip-${theme}` : ''}`}
      >
        {children}
      </Popup>
    </>
  );
});

Tooltip.displayName = 'Tooltip';
Tooltip.propTypes = {
  theme: PropTypes.oneOf(['default', 'primary', 'success', 'danger', 'warning']),
  showArrow: PropTypes.bool,
};
Tooltip.defaultProps = {
  theme: 'default',
  showArrow: true,
};
export default Tooltip;
