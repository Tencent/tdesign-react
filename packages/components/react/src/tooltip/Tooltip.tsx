import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import Popup, { PopupRef, PopupVisibleChangeContext } from '../popup';
import useConfig from '../hooks/useConfig';
import { TdTooltipProps } from './type';
import { tooltipDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export type TooltipProps = TdTooltipProps;

const Tooltip = forwardRef<Partial<PopupRef>, TdTooltipProps>((originalProps, ref) => {
  const props = useDefaultProps<TdTooltipProps>(originalProps, tooltipDefaultProps);
  const {
    theme,
    showArrow,
    destroyOnClose,
    overlayClassName,
    children,
    duration,
    placement,
    onVisibleChange,
    ...restProps
  } = props;

  const { classPrefix } = useConfig();
  const [timeUp, setTimeUp] = useState(false);
  const popupRef = useRef<PopupRef>(null);
  const timerRef = useRef<number | null>(null);
  const toolTipClass = classNames(
    `${classPrefix}-tooltip`,
    {
      [`${classPrefix}-tooltip--${theme}`]: theme,
    },
    overlayClassName,
  );

  function handleVisibleChange(visible: boolean, { e, trigger }: PopupVisibleChangeContext) {
    setTimeUp(false);
    onVisibleChange?.(visible, { e, trigger });
  }

  useEffect(() => {
    if (duration !== 0 && !timeUp) {
      popupRef.current?.setVisible?.(true);
      timerRef.current = window.setTimeout(() => {
        popupRef.current?.setVisible?.(false);
        setTimeUp(true);
      }, duration);
    }
    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [duration, timeUp]);

  useImperativeHandle(ref, () => ({
    ...(popupRef.current || {}),
  }));

  return (
    <Popup
      ref={popupRef}
      destroyOnClose={destroyOnClose}
      showArrow={showArrow}
      overlayClassName={toolTipClass}
      onVisibleChange={handleVisibleChange}
      placement={placement}
      {...restProps}
    >
      {children}
    </Popup>
  );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
