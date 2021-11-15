import React, { useState } from 'react';
import Tooltip from '../tooltip/Tooltip';
import { TdTooltipProps } from '../_type/components/tooltip';

interface SliderHandleButtonProps {
  onChange: (event: React.MouseEvent | MouseEvent) => void;
  classPrefix: string;
  style: React.CSSProperties;
  toolTipProps: TdTooltipProps;
}

const SliderHandleButton: React.FC<SliderHandleButtonProps> = ({ onChange, style, classPrefix, toolTipProps }) => {
  const [popupVisible, setPopupVisible] = useState(false);

  const onSliderDragging = (e: MouseEvent) => {
    onChange(e);
  };

  const onSliderDraggingEnd = () => {
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

  return (
    <div
      style={style}
      className={`${classPrefix}-slider__button-wrapper`}
      onMouseDown={(e) => handleSliderMouseDown(e)}
      onMouseEnter={(e) => handleSliderEnter(e)}
      onMouseLeave={(e) => handleSliderLeave(e)}
    >
      <Tooltip visible={popupVisible} placement="top" {...toolTipProps}>
        <div className={`${classPrefix}-slider__button`}></div>
      </Tooltip>
    </div>
  );
};

export default SliderHandleButton;
