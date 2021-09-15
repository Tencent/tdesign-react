import React, { useState, Ref } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import useDefaultValue from '../_util/useDefaultValue';
import useConfig from '../_util/useConfig';
import noop from '../_util/noop';
import Popup from '../popup';
import Input from '../input';
import TimeRangePicker from './TimeRangePicker';
import TIconTime from '../icon/icons/TimeIcon';
import TimePickerPanel from './TimePickerPanel';
import InputItems from './InputItems';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';

import { StyledProps } from '../_type';
import { TdTimePickerProps } from '../_type/components/time-picker';

// https://github.com/iamkun/dayjs/issues/1552
dayjs.extend(customParseFormat);

export interface TimePickerProps extends TdTimePickerProps, StyledProps {}

const TimePicker = forwardRefWithStatics(
  (props: TimePickerProps, ref: Ref<HTMLDivElement>) => {
    const {
      allowInput,
      clearable = true,
      disabled,
      format = 'HH:mm:ss',
      hideDisabledTime = true,
      placeholder = '选择时间',
      size = 'medium',
      steps = [1, 1, 1],
      value,
      disableTime,
      onBlur = noop,
      onChange,
      onClose = noop,
      onFocus = noop,
      onInput = noop,
      onOpen = noop,
    } = useDefaultValue(props);

    const { classPrefix } = useConfig();
    const name = `${classPrefix}-time-picker`;

    const [isPanelShowed, togglePanelShow] = useState(false);

    const handleShowPopup = (visible: boolean, context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
      togglePanelShow(visible);
      visible ? onOpen(context) : onClose(context); // trigger on-open and on-close
    };

    return (
      <Popup
        content={
          <TimePickerPanel
            steps={steps}
            format={format}
            disableTime={disableTime}
            hideDisabledTime={hideDisabledTime}
            isFooterDisplay={true}
            isRangePicker={false}
            onChange={onChange}
            value={value}
          />
        }
        disabled={disabled}
        onVisibleChange={handleShowPopup}
        overlayClassName={classNames(`${name}-panel__container`)}
        placement="bottom-left"
        trigger="click"
      >
        <div className={name} ref={ref}>
          <Input
            readonly={true}
            disabled={disabled}
            size={size}
            clearable={clearable}
            value={value ? ' ' : null}
            onClear={() => onChange(null)}
            placeholder={!value ? placeholder : undefined}
            className={isPanelShowed ? `${classPrefix}-is-focused` : ''}
            suffixIcon={<TIconTime />}
          />
          {value ? (
            <InputItems
              disabled={disabled}
              format={format}
              allowInput={allowInput}
              value={[value]}
              onBlur={onBlur}
              onFocus={onFocus}
              onInput={onInput}
              onChange={onChange}
            />
          ) : null}
        </div>
      </Popup>
    );
  },
  {
    displayName: 'TimePicker',
    RangePicker: TimeRangePicker,
  },
);

export default TimePicker;
