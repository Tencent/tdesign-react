import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Popup, { PopupVisibleChangeContext, PopupRefProps } from '../popup';
import useConfig from '../_util/useConfig';
import { TdTooltipProps } from './type';

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
  const popupRef = useRef<PopupRefProps>();
  const timerRef = useRef<number | null>(null);
  const toolTipClass = classNames(
    `${classPrefix}-tooltip`,
    {
      [`${classPrefix}-tooltip--${theme}`]: theme,
    },
    overlayClassName,
  );

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
        popupRef.current.setModifiers([{ name: 'offset', options: { offset: [x, 0] } }]);
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
      showArrow={placement === 'mouse' ? false : showArrow}
      overlayClassName={toolTipClass}
      visible={isTipShowed}
      onVisibleChange={handleShowTip}
      placement={placement === 'mouse' ? 'bottom-left' : placement}
      {...restProps}
    >
      {children}
    </Popup>
  );
});

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
  theme: PropTypes.oneOf(['default', 'primary', 'success', 'danger', 'warning', 'light']),
  showArrow: PropTypes.bool,
};
Tooltip.defaultProps = {
  theme: 'default',
  showArrow: true,
};
export default Tooltip;
