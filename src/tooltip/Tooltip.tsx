import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import Popup, { PopupVisibleChangeContext } from '../popup';
import useConfig from '../hooks/useConfig';
import { TdTooltipProps } from './type';
import { tooltipDefaultProps } from './defaultProps';

export type TooltipProps = TdTooltipProps;

const Tooltip = forwardRef((props: TdTooltipProps, ref) => {
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
  const popupRef = useRef(null);
  const timerRef = useRef<number | null>(null);
  const [offset, setOffset] = useState([0, 0]);
  const toolTipClass = classNames(
    `${classPrefix}-tooltip`,
    {
      [`${classPrefix}-tooltip--${theme}`]: theme,
    },
    overlayClassName,
  );
  const isPlacedByMouse = placement === 'mouse';

  const calculatePos = (e) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  function handleVisibleChange(visible: boolean, { e, trigger }: PopupVisibleChangeContext) {
    setTimeUp(false);
    onVisibleChange?.(visible, { e, trigger });

    if (placement !== 'mouse' || !visible) return;

    const { x } = calculatePos(e);
    setOffset([x, 0]);
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
    ...((popupRef.current || {}) as any),
  }));

  return (
    <Popup
      ref={popupRef}
      destroyOnClose={destroyOnClose}
      showArrow={isPlacedByMouse ? false : showArrow}
      overlayClassName={toolTipClass}
      onVisibleChange={handleVisibleChange}
      popperOptions={{
        modifiers: isPlacedByMouse ? [{ name: 'offset', options: { offset } }] : [],
      }}
      placement={isPlacedByMouse ? 'bottom-left' : placement}
      {...restProps}
    >
      {children}
    </Popup>
  );
});

Tooltip.displayName = 'Tooltip';
Tooltip.defaultProps = tooltipDefaultProps;

export default Tooltip;
