import React, { FC, useState } from 'react';
import classNames from 'classnames';

import { TimeIcon } from 'tdesign-icons-react';
// import noop from '../_util/noop';
import useDefaultValue from '../_util/useDefaultValue';
import useConfig from '../_util/useConfig';
import { RangeInputPopup } from '../range-input';
import TimePickerPanel from './panel/TimePickerPanel';

import { useTimePickerTextConfig } from './const';

import { TdTimeRangePickerProps } from './type';
import { StyledProps } from '../common';

export interface TimeRangePickerProps extends TdTimeRangePickerProps, StyledProps {}

const TimeRangePicker: FC<TimeRangePickerProps> = (props) => {
  const TEXT_CONFIG = useTimePickerTextConfig();

  const {
    allowInput,
    clearable,
    disabled,
    format = 'HH:mm:ss',
    hideDisabledTime = true,
    placeholder = TEXT_CONFIG.placeholder,
    size = 'medium',
    steps = [1, 1, 1],
    value = [undefined, undefined],
    onChange,
    // onBlur = noop,
    // onFocus = noop,
    // onInput = noop,
    style,
    className,
  } = useDefaultValue(props);

  const { classPrefix } = useConfig();
  const [isPanelShowed, setPanelShow] = useState(false);
  const [currentPanelIdx, setCurrentPanelIdx] = useState(0);

  const name = `${classPrefix}-time-picker`;

  const inputClasses = classNames(`${name}__group`, {
    [`${classPrefix}-is-focused`]: isPanelShowed,
  });

  const handleShowPopup = (visible: boolean) => {
    setPanelShow(visible);
  };

  const handleClear = (context: { e: React.MouseEvent }) => {
    const { e } = context;
    e.stopPropagation();
    onChange(undefined);
  };

  const handleClick = ({ position }: { position: 'first' | 'second' }) => {
    setCurrentPanelIdx(position === 'first' ? 0 : 1);
  };

  const handleTimeChange = (newValue: string) => {
    if (currentPanelIdx === 0) {
      onChange([newValue, value[1] ?? newValue]);
    } else {
      onChange([value[0] ?? newValue, newValue]);
    }
  };

  return (
    <div className={classNames(name, className)} style={style}>
      <RangeInputPopup
        style={style}
        disabled={disabled}
        popupVisible={isPanelShowed}
        onPopupVisibleChange={handleShowPopup}
        popupProps={{
          overlayStyle: {
            width: '280px',
          },
        }}
        rangeInputProps={{
          size,
          clearable,
          className: inputClasses,
          value: value ?? undefined,
          placeholder: !value ? placeholder : undefined,
          suffixIcon: <TimeIcon />,
          onClear: handleClear,
          onClick: handleClick,
          readonly: !allowInput,
        }}
        panel={
          <TimePickerPanel
            steps={steps}
            format={format}
            hideDisabledTime={hideDisabledTime}
            isFooterDisplay={true}
            value={value[currentPanelIdx || 0]}
            onChange={handleTimeChange}
            handleConfirmClick={() => {
              setPanelShow(false);
            }}
          />
        }
      />
    </div>
  );
};

TimeRangePicker.displayName = 'TimeRangePicker';

export default TimeRangePicker;
