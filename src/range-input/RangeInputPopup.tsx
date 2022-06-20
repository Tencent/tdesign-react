import React from 'react';
import classNames from 'classnames';
import Popup from '../popup';
import useConfig from '../_util/useConfig';
import RangeInput from './RangeInput';
import type { StyledProps } from '../common';
import type { TdRangeInputPopupProps } from './type';
import useOverlayStyle from '../select-input/useOverlayStyle';

export interface RangeInputPopupProps extends TdRangeInputPopupProps, StyledProps {}

const RangeInputPopup = React.forwardRef((props: RangeInputPopupProps, ref: React.RefObject<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-range-input-popup`;

  const { className, style, inputValue, panel, popupProps, rangeInputProps, popupVisible, onInputChange } = props;

  const { tOverlayStyle, innerPopupVisible, onInnerPopupVisibleChange } = useOverlayStyle(props);

  const popupClasses = classNames([
    name,
    {
      [`${name}--visible`]: popupVisible ?? innerPopupVisible,
    },
  ]);

  return (
    <div ref={ref} style={style} className={classNames(name, className)}>
      <Popup
        hideEmptyPopup
        content={panel}
        trigger="click"
        placement="bottom-left"
        visible={popupVisible ?? innerPopupVisible}
        onVisibleChange={onInnerPopupVisibleChange}
        {...popupProps}
        overlayStyle={tOverlayStyle}
        className={popupClasses}
      >
        <RangeInput value={inputValue} onChange={onInputChange} {...rangeInputProps} />
      </Popup>
    </div>
  );
});

RangeInputPopup.displayName = 'RangeInputPopup';

export default RangeInputPopup;
