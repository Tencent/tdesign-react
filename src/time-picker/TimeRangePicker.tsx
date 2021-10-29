import React, { FC, useState } from 'react';
import classNames from 'classnames';

import { TimeIcon } from '@tencent/tdesign-icons-react';
import noop from '../_util/noop';
import useDefaultValue from '../_util/useDefaultValue';
import useConfig from '../_util/useConfig';
import Popup from '../popup';
import Input from '../input';
import TimeRangePickerPanel from './panel/TimePickerRangePanel';
import InputItems from './InputItems';

import { useTimePickerTextConfig } from './consts';

import { TdTimeRangePickerProps } from '../_type/components/time-picker';
import { StyledProps } from '../_type';

export interface TimeRangePickerProps extends TdTimeRangePickerProps, StyledProps {}

const TimeRangePicker: FC<TimeRangePickerProps> = (props) => {
  const TEXT_CONFIG = useTimePickerTextConfig();

  const {
    allowInput,
    clearable,
    disabled, // TODO array形式
    format = 'HH:mm:ss',
    hideDisabledTime = true,
    placeholder = TEXT_CONFIG.placeholder, // TODO array形式
    size = 'medium',
    steps = [1, 1, 1],
    value,
    onBlur = noop,
    onChange,
    onFocus = noop,
    onInput = noop,
    style,
    className,
  } = useDefaultValue(props);

  const { classPrefix } = useConfig();

  const name = `${classPrefix}-time-picker`;

  const [isPanelShowed, setPanelShow] = useState(false);
  const inputClasses = classNames(`${name}__group`, {
    [`${classPrefix}-is-focused`]: isPanelShowed,
  });

  const handleShowPopup = (visible: boolean) => {
    setPanelShow(visible);
  };

  const handleClear = (context: { e: React.MouseEvent }) => {
    const { e } = context;
    e.stopPropagation();
    onChange(null);
  };

  return (
    <Popup
      content={
        <TimeRangePickerPanel
          steps={steps}
          format={format}
          hideDisabledTime={hideDisabledTime}
          isFooterDisplay={true}
          value={value}
          onChange={onChange}
          handleConfirmClick={() => setPanelShow(false)}
        />
      }
      disabled={disabled as boolean}
      placement="bottom-left"
      visible={isPanelShowed}
      onVisibleChange={handleShowPopup}
      trigger="click"
    >
      <div className={classNames(name, className)} style={style}>
        <Input
          size={size}
          readonly={true}
          clearable={clearable}
          className={inputClasses}
          value={value ? ' ' : undefined}
          onClear={handleClear}
          disabled={disabled as boolean}
          placeholder={!value ? (placeholder as string) : undefined}
          suffixIcon={<TimeIcon />}
        />
        {value ? (
          <InputItems
            disabled={disabled}
            format={format}
            placeholder={placeholder}
            allowInput={allowInput}
            value={value}
            onBlur={onBlur}
            onFocus={onFocus}
            onInput={onInput}
            onChange={onChange}
          />
        ) : null}
      </div>
    </Popup>
  );
};

TimeRangePicker.displayName = 'TimeRangePicker';

export default TimeRangePicker;
