import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import Popup, { PopupVisibleChangeContext } from '../popup';
import useConfig from '../_util/useConfig';
import { TdTooltipProps } from './type';
import { tooltipDefaultProps } from './defaultProps';

export type TooltipProps = TdTooltipProps;

interface RefProps {
  setVisible?: (v: boolean) => void;
}

const Tooltip = forwardRef((props: TdTooltipProps, ref) => {
  const {
    theme,
    showArrow = true,
    destroyOnClose = true,
    overlayClassName,
    children,
    duration = 0,
    placement = 'top',
    ...restProps
  } = props;
  const { classPrefix } = useConfig();
  const [isTipShowed, setTipshow] = useState(duration !== 0);
  const [timeup, setTimeup] = useState(false);
  const popupRef = useRef<HTMLDivElement>();
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

  const setVisible = (v: boolean) => {
    if (duration !== 0) setTimeup(false);
    setTipshow(v);
  };

  const calculatePos = (e) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return {
      x,
      y,
    };
  };

  const handleShowTip = (visible: boolean, { e, trigger }: PopupVisibleChangeContext) => {
    if (duration === 0 || (duration !== 0 && timeup)) {
      if (
        visible &&
        placement === 'mouse' &&
        (trigger === 'trigger-element-hover' || trigger === 'trigger-element-click')
      ) {
        const { x } = calculatePos(e);
        setOffset([x, 0]);
      }
      setTipshow(visible);
    }
  };

  useEffect(() => {
    if (duration !== 0 && !timeup) {
      timerRef.current = window.setTimeout(() => {
        setTipshow(false);
        setTimeup(true);
      }, duration);
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [duration, timeup]);

  useImperativeHandle(
    ref,
    (): RefProps => ({
      setVisible,
    }),
  );

  return (
    <Popup
      ref={popupRef}
      destroyOnClose={destroyOnClose}
      showArrow={isPlacedByMouse ? false : showArrow}
      overlayClassName={toolTipClass}
      visible={isTipShowed}
      onVisibleChange={handleShowTip}
      popperModifiers={isPlacedByMouse ? [{ name: 'offset', options: { offset } }] : []}
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
