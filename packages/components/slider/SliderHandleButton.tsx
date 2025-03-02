import React, { useState } from 'react';
import classNames from 'classnames';
import Tooltip from '../tooltip/Tooltip';
import { TdTooltipProps } from '../tooltip/type';

interface SliderHandleButtonProps {
  onChange: (event: React.MouseEvent | MouseEvent) => void;
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
  const [popupVisible, setPopupVisible] = useState(false);
  const [isDragging, toggleIsDragging] = useState(false);

  const onSliderDragging = (e: MouseEvent) => {
    toggleIsDragging(true);
    onChange(e);
  };

  const onSliderDraggingEnd = () => {
    toggleIsDragging(false);
    window.removeEventListener('mousemove', onSliderDragging);
    window.removeEventListener('mouseup', onSliderDraggingEnd);
    window.removeEventListener('touchmove', onSliderDragging);
    window.removeEventListener('touchend', onSliderDraggingEnd);
  };

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPopupVisible(true);
    window.addEventListener('mousemove', onSliderDragging);
    window.addEventListener('mouseup', onSliderDraggingEnd);
    window.addEventListener('touchmove', onSliderDragging);
    window.addEventListener('touchend', onSliderDraggingEnd);
  };

  const handleSliderEnter = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPopupVisible(true);
  };

  const handleSliderLeave = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPopupVisible(false);
  };

  const handleNode = (
    <div
      style={style}
      className={`${classPrefix}-slider__button-wrapper`}
      onMouseDown={(e) => handleSliderMouseDown(e)}
      onMouseEnter={(e) => handleSliderEnter(e)}
      onMouseLeave={(e) => handleSliderLeave(e)}
    >
      <div
        className={classNames(`${classPrefix}-slider__button`, {
          [`${classPrefix}-slider__button--dragging`]: isDragging,
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
