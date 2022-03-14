import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import DateHeader from '../base/Header';
import DateTable from '../base/Table';
import DateFooter from '../base/Footer';
import DatePresets from '../base/Presets';
import {
  getWeeks,
  getYears,
  getMonths,
  flagActive,
  subtractMonth,
  addMonth,
  getToday,
} from '../../_common/js/date-picker/utils';
import { TdDatePickerProps } from '../type';
import TimePickerPanel from '../../time-picker/panel/TimePickerPanel';

export interface DatePanelProps
  extends Pick<
    TdDatePickerProps,
    | 'mode'
    | 'enableTimePicker'
    | 'format'
    | 'presets'
    | 'firstDayOfWeek'
    | 'disableDate'
    | 'value'
    | 'onChange'
    | 'valueType'
    | 'timePickerProps'
  > {
  minDate: Date;
  maxDate: Date;
  formatDate: Function;
  inputValue: string;
  setInputValue: Function;
  setPopupVisible: Function;
}

const TODAY = getToday();
const TIME_FORMAT = 'HH:mm:ss';

const DatePanel = (props: DatePanelProps) => {
  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('datePicker');
  const monthAriaLabel = t(local.months);

  const { classPrefix } = useConfig();
  const {
    value = TODAY,
    mode = 'date',
    minDate,
    maxDate,
    firstDayOfWeek,
    disableDate,
    onChange,
    format,
    presets,
    valueType,
    enableTimePicker,
    setPopupVisible,
    inputValue,
    setInputValue,
    formatDate,
    timePickerProps,
  } = props;

  const [year, setYear] = useState(dayjs(value).year());
  const [month, setMonth] = useState(dayjs(value).month());
  const [panelType, setPanelType] = useState<any>(mode);
  const [timeValue, setTimeValue] = useState(dayjs(value).format(TIME_FORMAT));

  function clickHeader(flag: number) {
    let monthCount = 0;
    let next = null;
    switch (panelType) {
      case 'date':
        monthCount = 1;
        break;
      case 'month':
        monthCount = 12;
        break;
      case 'year':
        monthCount = 120;
    }

    const current = new Date(year, month);

    switch (flag) {
      case 1:
        next = addMonth(current, monthCount);
        break;
      case -1:
        next = subtractMonth(current, monthCount);
        break;
      case 0:
        next = new Date();
        break;
    }

    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  const tableData = useMemo(() => {
    let data: any[];

    const options = {
      minDate,
      maxDate,
      disableDate,
      firstDayOfWeek,
      monthLocal: monthAriaLabel,
    };

    switch (panelType) {
      case 'date':
        data = getWeeks({ year, month }, options);
        break;
      case 'month':
        data = getMonths(year, options);
        break;
      case 'year':
        data = getYears(year, options);
        break;
      default:
        return;
    }
    const start = dayjs(value).toDate();
    return flagActive(data, { start, type: panelType });
  }, [year, month, panelType, value, disableDate, minDate, maxDate, firstDayOfWeek, monthAriaLabel]);

  function onCellClick(date: Date) {
    onChange(dayjs(date).format(valueType), dayjs(date));
    setInputValue(formatDate(date));
    setYear(date.getFullYear());
    setMonth(date.getMonth());

    !enableTimePicker && setPopupVisible(false);
  }

  function onCellMouseEnter(val: Date) {
    setInputValue(formatDate(val));
  }

  function onCellMouseLeave() {
    if (!value) return setInputValue('');
    setInputValue(formatDate(value));
  }

  // 确定
  function onConfirmClick() {
    setPopupVisible(false);

    const isValidDate = dayjs(inputValue, format, true).isValid();
    if (isValidDate) {
      onChange(dayjs(inputValue).format(valueType), dayjs(inputValue));
    } else if (!value) {
      setInputValue('');
    } else {
      setInputValue(formatDate(value));
    }
  }

  // 预设
  function onPresetClick(preset: any) {
    let presetValue = preset;
    if (typeof preset === 'function') {
      presetValue = preset();
    }
    setPopupVisible(false);
    setInputValue(presetValue);
    onChange(dayjs(presetValue).format(valueType), dayjs(presetValue));
  }

  function handleTimePick(value: string) {
    const [hour, minute, second] = value.split(':');
    const currentDate = dayjs(inputValue).toDate();
    currentDate.setHours(Number(hour));
    currentDate.setMinutes(Number(minute));
    currentDate.setSeconds(Number(second));
    setTimeValue(value);
    setInputValue(dayjs(currentDate).format(format));
  }

  const showTimePicker = enableTimePicker && panelType === 'time';
  const showPanelFooter = enableTimePicker || presets;

  return (
    <div className={`${classPrefix}-date-picker__panel`}>
      <DateHeader
        mode={mode}
        enableTimePicker={enableTimePicker}
        panelType={panelType}
        onBtnClick={clickHeader}
        onTypeChange={setPanelType}
      />
      {showTimePicker ? (
        <TimePickerPanel value={timeValue} onChange={handleTimePick} {...timePickerProps} />
      ) : (
        <DateTable
          data={tableData}
          panelType={panelType}
          firstDayOfWeek={firstDayOfWeek}
          onCellClick={onCellClick}
          onCellMouseEnter={onCellMouseEnter}
          onCellMouseLeave={onCellMouseLeave}
        />
      )}
      {showPanelFooter && (
        <DateFooter enableTimePicker={enableTimePicker} onConfirmClick={onConfirmClick}>
          <DatePresets presets={presets} onPresetClick={onPresetClick} />
        </DateFooter>
      )}
    </div>
  );
};

DatePanel.displayName = 'DatePanel';

export default DatePanel;
