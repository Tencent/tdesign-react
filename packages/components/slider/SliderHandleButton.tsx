import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import useMouseEvent, { type MouseCallback } from '../hooks/useMouseEvent';
import Tooltip from '../tooltip/Tooltip';
import type { TdTooltipProps } from '../tooltip/type';

interface SliderHandleButtonProps {
  onChange: (event: MouseCallback) => void;
  classPrefix: string;
  style: React.CSSProperties;
  toolTipProps: TdTooltipProps;
  hideTips: boolean;
}

const SliderHandleButton: React.FC<SliderHandleButtonProps> = ({
  onChange,
  style,
  classPrefix,
  toolTipProps,
  hideTips,
}) => {
  const sliderNodeRef = useRef<HTMLDivElement>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const { isMoving } = useMouseEvent(sliderNodeRef, {
    onStart: () => {
      setPopupVisible(true);
    },
    onMove: (e: MouseCallback) => {
      onChange(e);
    },
    onEnd: () => {
      setPopupVisible(false);
    },
  });

  const handleNode = (
    <div ref={sliderNodeRef} style={style} className={`${classPrefix}-slider__button-wrapper`}>
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
    <Tooltip visible={popupVisible} placement="top" {...toolTipProps}>
      {handleNode}
    </Tooltip>
  );
};

export default SliderHandleButton;
