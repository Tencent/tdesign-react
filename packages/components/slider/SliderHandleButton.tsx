import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import useMouseEvent, { type MouseCallback } from '../hooks/useMouseEvent';
import Tooltip from '../tooltip/Tooltip';

import type { TdTooltipProps } from '../tooltip/type';
import type { SliderProps } from './Slider';

interface SliderHandleButtonProps {
  onChange: (event: MouseCallback) => void;
  onChangeEnd?: (event: MouseCallback) => void;
  classPrefix: string;
  style: React.CSSProperties;
  toolTipProps: TdTooltipProps;
  hideTips: boolean;
  layout: SliderProps['layout'];
}

const SliderHandleButton: React.FC<SliderHandleButtonProps> = ({
  onChange,
  onChangeEnd,
  style,
  classPrefix,
  toolTipProps,
  hideTips,
  layout,
}) => {
  const sliderNodeRef = useRef<HTMLDivElement>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const { isMoving } = useMouseEvent(sliderNodeRef, {
    onEnter() {
      setPopupVisible(true);
    },
    onDown: () => {
      setPopupVisible(true);
    },
    onMove: (e) => {
      setPopupVisible(true);
      onChange(e);
    },
    onLeave: () => {
      setPopupVisible(false);
    },
    onUp: (e) => {
      setPopupVisible(false);
      onChange(e);
      onChangeEnd?.(e);
    },
  });

  const handleNode = (
    <div
      ref={sliderNodeRef}
      style={style}
      className={`${classPrefix}-slider__button-wrapper`}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={classNames(`${classPrefix}-slider__button`, {
          [`${classPrefix}-slider__button--dragging`]: isMoving,
        })}
      ></div>
    </div>
  );

  return hideTips ? (
    handleNode
  ) : (
    <Tooltip visible={popupVisible} placement={layout === 'horizontal' ? 'top' : 'right'} {...toolTipProps}>
      {handleNode}
    </Tooltip>
  );
};

export default SliderHandleButton;
