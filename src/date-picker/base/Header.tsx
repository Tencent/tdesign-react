import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, RoundIcon } from 'tdesign-icons-react';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import Button from '../../button';
import useConfig from '../../_util/useConfig';
import Radio from '../../radio';
import { TdDatePickerProps } from '../type';

export interface DatePickerHeaderProps extends Pick<TdDatePickerProps, 'mode' | 'enableTimePicker'> {
  onBtnClick: Function;
  onTypeChange: Function;
  panelType: 'year' | 'month' | 'date';
}

const useDatePickerLocalConfig = () => {
  const [local, t] = useLocaleReceiver('datePicker');

  return {
    rangeSeparator: t(local.rangeSeparator),
    yearAriaLabel: t(local.yearAriaLabel),
    monthAriaLabel: t(local.monthAriaLabel),
    nextYear: t(local.nextYear),
    preYear: t(local.preYear),
    nextMonth: t(local.nextMonth),
    preMonth: t(local.preMonth),
    preDecade: t(local.preDecade),
    nextDecade: t(local.nextDecade),
    now: t(local.now),
  };
};

const useControllerGroup = (mode, enableTimePicker) => {
  let controllerGroup = [];
  if (mode === 'year') {
    controllerGroup = [{ label: 'Year', value: 'year' }];
  } else if (mode === 'month') {
    controllerGroup = [
      { label: 'Year', value: 'year' },
      { label: 'Month', value: 'month' },
    ];
  } else {
    controllerGroup = [
      { label: 'Year', value: 'year' },
      { label: 'Month', value: 'month' },
      { label: 'Date', value: 'date' },
    ];
  }

  if (enableTimePicker) {
    controllerGroup.push({ label: 'Time', value: 'time' });
  }

  return controllerGroup;
};

const DatePickerHeader = (props: DatePickerHeaderProps) => {
  const { classPrefix } = useConfig();

  const { mode, panelType, onBtnClick, onTypeChange, enableTimePicker } = props;

  const { now, preMonth, preYear, nextMonth, nextYear, preDecade, nextDecade } = useDatePickerLocalConfig();

  let preLabel: string;
  let nextLabel: string;
  if (panelType === 'year') {
    preLabel = preDecade;
    nextLabel = nextDecade;
  } else if (panelType === 'month') {
    preLabel = preYear;
    nextLabel = nextYear;
  } else if (panelType === 'date') {
    preLabel = preMonth;
    nextLabel = nextMonth;
  }

  const controllerGroup = useControllerGroup(mode, enableTimePicker);

  return (
    <div className={`${classPrefix}-date-picker__header`}>
      <div className={`${classPrefix}-date-picker__header-controller`}>
        <Radio.Group size="small" variant="default-filled" value={panelType} onChange={(val) => onTypeChange(val)}>
          {controllerGroup.map((item) => (
            <Radio.Button key={item.value} value={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <span className={`${classPrefix}-date-picker__header-jumper`}>
        <Button
          title={preLabel}
          variant="text"
          onClick={() => onBtnClick(-1)}
          icon={<ChevronLeftIcon />}
          className={`${classPrefix}-date-picker__header-jumper__btn`}
        ></Button>
        <Button
          title={now}
          variant="text"
          onClick={() => onBtnClick(0)}
          icon={<RoundIcon />}
          className={`${classPrefix}-date-picker__header-jumper__btn`}
        ></Button>
        <Button
          title={nextLabel}
          variant="text"
          onClick={() => onBtnClick(1)}
          icon={<ChevronRightIcon />}
          className={`${classPrefix}-date-picker__header-jumper__btn`}
        ></Button>
      </span>
    </div>
  );
};

DatePickerHeader.displayName = 'DatePickerHeader';

export default DatePickerHeader;
