import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
  const { theme, showArrow = true, overlayClassName, children, ...restProps } = props;
  const { classPrefix } = useConfig();
  const toolTipClass = classNames(
    `${classPrefix}-tooltip`,
    {
      [`${classPrefix}-tooltip-${theme}`]: theme,
    },
    overlayClassName,
  );
  return (
    <>
      <Popup ref={ref} {...restProps} showArrow={showArrow} overlayClassName={toolTipClass}>
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
