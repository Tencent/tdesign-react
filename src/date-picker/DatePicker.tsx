import React, { useState, useRef, useEffect } from 'react';
import isObject from 'lodash/isObject';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import classNames from 'classnames';
import { TimeIcon as IconTime, CalendarIcon as IconCalendar } from '@tencent/tdesign-icons-react';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import { TdDatePickerProps } from '../_type/components/date-picker';
import useCommonClassName from '../_util/useCommonClassName';
import useClickOutside from '../_util/useClickOutside';

import Popup from '../popup';
import Input from '../input';
import Button from '../button';
import CalendarPresets from './base/CalendarPresets';
import DatePanel from './panel/Date';
import DateRangePanel from './panel/DateRange';
import TimePickerPanel from '../time-picker/panel/TimePickerPanel';
import TimePickerRangePanel from '../time-picker/panel/TimePickerRangePanel';

dayjs.extend(isBetween);

export interface DatePickerProps extends TdDatePickerProps, StyledProps {}

const TIME_FORMAT = 'HH:mm:ss';

const DatePicker = (props: DatePickerProps) => {
  const {
    className,
    style,
    allowInput,
    clearable,
    disabled,
    disableDate,
    enableTimePicker,
    format,
    inputProps,
    mode,
    popupProps,
    prefixIcon,
    presets,
    range,
    size,
    suffixIcon,
    value,
    defaultValue,
    onChange,
    // onBlur,
    // onFocus,
    // onInput,
  } = props;

  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('datePicker');
  const selectTimeText = t(local.selectTime);
  const selectDateText = t(local.selectDate);
  const confirmText = t(local.confirm);
  const rangeSeparatorText = t(local.rangeSeparator);
  const placeholder = t(local.placeholder[mode]);

  const { classPrefix } = useConfig();
  const CLASSNAMES = useCommonClassName();

  const datePickerRef = useRef(null);
  const dropdownPopupRef = useRef(null);
  const inputRef = useRef(null);

  const [popupShow, setPopupShow] = useState(false);
  const [timePanelShow, setTimePanelShow] = useState(false);
  const [timeValue, setTimeValue] = useState('');
  const [timeRangeValue, setTimeRangeValue] = useState([]);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [formattedValue, setFormattedValue] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);

  function initDatePicker() {
    const val: any = value || defaultValue;

    if (val) {
      const startVal = range ? new Date(val[0]) : new Date(val);
      const endVal = range ? new Date(val[1]) : new Date(val);

      setStart(startVal);
      setEnd(endVal);
      setTimeValue(dayjs(startVal).format(TIME_FORMAT));
      setTimeRangeValue([dayjs(startVal).format(TIME_FORMAT), dayjs(endVal).format(TIME_FORMAT)]);
      setSelectedDates(range ? [val[0], val[1]] : [val]);
    }
  }

  useClickOutside([datePickerRef, dropdownPopupRef], () => {
    close();
  });

  useEffect(() => {
    initDatePicker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateFormatValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDates, value]);

  function updateFormatValue() {
    let dates = selectedDates;

    // 受控模式
    if (typeof value !== 'undefined') {
      if (Array.isArray(value)) {
        dates = value.map((d: string) => (d ? new Date(d) : new Date()));
      } else {
        dates = value ? [new Date(value)] : [];
      }
    }

    const selectedFmtDates: string[] = dates.map((d: Date) => formatDate(d));

    let pickerMode: string = mode;
    if (range) pickerMode = 'range';
    let nextValue = '';

    switch (pickerMode) {
      case 'date':
      case 'month':
      case 'year':
        nextValue = selectedFmtDates.join('');
        break;
      case 'range':
        if (popupShow) {
          nextValue = [formatDate(start), formatDate(end)].join(rangeSeparatorText);
        } else if (selectedFmtDates.length > 1) {
          nextValue = [selectedFmtDates[0], selectedFmtDates[1]].join(rangeSeparatorText);
        }
        break;
    }

    setFormattedValue(nextValue);
  }

  function showPopup() {
    if (disabled) return;
    setPopupShow(true);
  }

  function formatDate(date: Date): string {
    let dateFormat = format || '';
    const arrTime = ['H', 'h', 'm', 's'];
    const hasTime = arrTime.some((f) => String(dateFormat).includes(f));
    if (enableTimePicker && !hasTime) {
      dateFormat = [dateFormat, TIME_FORMAT].join(' ');
    }
    const d1 = new Date(date);
    return dayjs(d1).format(dateFormat);
  }

  function close() {
    if (disabled) return;

    setPopupShow(false);
    setTimePanelShow(false);
  }

  function handleClear({ e }): void {
    e.stopPropagation();
    close();

    if (!disabled) {
      setStart(new Date());
      setEnd(new Date());
      setSelectedDates([]);
      setFormattedValue('');
      setTimeValue('00:00:00');
      setTimeRangeValue(['00:00:00', '00:00:00']);
      submitInput([], true);
    }
  }

  function submitInput(selectedDates: any[], triggerChange = true) {
    const pickerMode = range ? 'range' : mode;

    switch (pickerMode) {
      case 'date':
      case 'month':
      case 'year':
        triggerChange && onChange?.(selectedDates[0]);
        break;
      case 'range':
        triggerChange && onChange?.(selectedDates);
        break;
    }
  }

  function clickRange(value) {
    const nextDates = [];
    if (Array.isArray(value)) {
      nextDates.push(...[dayjs(value[0]).toDate(), dayjs(value[1]).toDate()]);

      setStart(nextDates[0]);
      setEnd(nextDates[1]);
    } else {
      nextDates.push(dayjs(value).toDate());

      setStart(nextDates[0]);
      setEnd(nextDates[0]);
    }
    setSelectedDates(nextDates);
    clickedApply(!enableTimePicker, nextDates);
  }

  function clickedApply(closePicker = true, nextDates?: Date[]): void {
    const dates = nextDates || selectedDates;
    submitInput(
      dates.map((d: Date) => formatDate(d)),
      true,
    );

    closePicker && close();
  }

  function toggleTime() {
    setTimeValue(dayjs(start).format(TIME_FORMAT));
    setTimeRangeValue([dayjs(start).format(TIME_FORMAT), dayjs(end).format(TIME_FORMAT)]);
    setTimePanelShow(!timePanelShow);
  }

  function handleTimePick(value: any) {
    if (Array.isArray(value)) {
      const [startTime, endTime] = value;
      const [startHour, startMinute, startSecond] = startTime.split(':');
      const startDate = new Date(start);
      startDate.setHours(startHour);
      startDate.setMinutes(startMinute);
      startDate.setSeconds(startSecond);

      const [endHour, endMinute, endSecond] = endTime.split(':');
      const endDate = new Date(end);
      endDate.setHours(endHour);
      endDate.setMinutes(endMinute);
      endDate.setSeconds(endSecond);
      setTimeRangeValue(value);
      clickRange([startDate, endDate]);
    } else {
      const [hour, minute, second] = value.split(':');
      const startDate = new Date(start);
      startDate.setHours(hour);
      startDate.setMinutes(minute);
      startDate.setSeconds(second);
      setTimeValue(value);
      dateClick(startDate);
    }
  }

  function dateClick(value: Date | Date[]) {
    // @todo add year range and month range
    let pickerMode: string = mode;
    if (range) pickerMode = 'range';

    switch (pickerMode) {
      case 'year':
      case 'month':
      case 'date': {
        if (value instanceof Date) {
          setStart(value);
          setEnd(value);
          setSelectedDates([value]);
          // 有时间选择时，点击日期不关闭弹窗
          clickedApply(!enableTimePicker, [value]);
        }
        break;
      }
      case 'range': {
        if (Array.isArray(value)) {
          setStart(value[0]);
          setEnd(value[1]);
          setSelectedDates(value);
          // 有时间选择时，点击日期不关闭弹窗
          clickedApply(!enableTimePicker, value);
        }
        break;
      }
    }
  }

  function isEnabled(value: Date): boolean {
    if (!disableDate) return false;

    // 值类型为 Function 则表示返回值为 true 的日期会被禁用
    if (typeof disableDate === 'function') {
      return disableDate(value);
    }

    // 禁用日期，示例：['A', 'B'] 表示日期 A 和日期 B 会被禁用。
    if (Array.isArray(disableDate)) {
      const formatedDisabledDate = disableDate.map((item: string) => dayjs(item, format));
      return formatedDisabledDate.some((item) => item.isSame(dayjs(value)));
    }

    // { before: 'A', after: 'B' } 表示在 A 之前和在 B 之后的日期都会被禁用。
    const { before, after } = disableDate;
    if (before && after) {
      const compareMin = dayjs(new Date(disableDate.before)).startOf('day');
      const compareMax = dayjs(new Date(disableDate.after)).startOf('day');

      // check min
      return !dayjs(value).isBetween(compareMin, compareMax, null, '[]');
    }

    // { from: 'A', to: 'B' } 表示在 A 到 B 之间的日期会被禁用。
    const { from, to } = disableDate;
    if (from && to) {
      const compareMin = dayjs(new Date(from)).startOf('day');
      const compareMax = dayjs(new Date(to)).startOf('day');

      // check min
      return dayjs(value).isBetween(compareMin, compareMax, null, '[]');
    }

    return true;
  }

  function renderContent() {
    const pickerStyles = classNames(`${classPrefix}-date-picker--container`, {
      [`${classPrefix}-date-picker--container`]: popupShow,
      [`${classPrefix}-date-picker--ranges-show`]: !!presets && range,
      [`${classPrefix}-date-picker--date`]: !!presets && range,
    });

    const panelProps = {
      mode,
      firstDayOfWeek: 0,
      onChange: dateClick,
      disableDate: isEnabled,
      minDate: isObject(disableDate) && 'before' in disableDate ? new Date(disableDate.before) : null,
      maxDate: isObject(disableDate) && 'after' in disableDate ? new Date(disableDate.after) : null,
    };

    const panelComponent = range ? (
      <DateRangePanel {...panelProps} value={[start, end]} />
    ) : (
      <DatePanel {...panelProps} value={start} />
    );

    const timepickerComponent = range ? (
      <TimePickerRangePanel value={timeRangeValue} onChange={handleTimePick} />
    ) : (
      <TimePickerPanel value={timeValue} onChange={handleTimePick} />
    );

    return (
      <div ref={dropdownPopupRef} className={pickerStyles}>
        {enableTimePicker && timePanelShow && <div>{timepickerComponent}</div>}
        {!timePanelShow && panelComponent}
        {presets && range && <CalendarPresets presets={presets} onClickRange={clickRange} />}
        {enableTimePicker && (
          <div className={`${classPrefix}-date-picker--apply`}>
            {enableTimePicker && (
              <Button theme="primary" variant="text" onClick={toggleTime}>
                {timePanelShow ? selectDateText : selectTimeText}
              </Button>
            )}
            {
              <Button theme="primary" onClick={() => clickedApply(true)}>
                {confirmText}
              </Button>
            }
          </div>
        )}
      </div>
    );
  }

  const triggerClassName = classNames(`${classPrefix}-form-controls`, { [CLASSNAMES.STATUS.active]: popupShow });
  const defaultSuffixIcon = enableTimePicker ? <IconTime /> : <IconCalendar />;
  const datePickerClassName = classNames(`${classPrefix}-date-picker`, className, CLASSNAMES.SIZE[size], {
    [`${classPrefix}-date-picker--month-picker`]: mode === 'year' || mode === 'month',
  });

  return (
    <div className={datePickerClassName} ref={datePickerRef} style={style}>
      <Popup
        trigger="context-menu"
        placement="bottom-left"
        visible={popupShow}
        content={renderContent()}
        overlayClassName={`${classPrefix}-date-picker`}
        className={`${classPrefix}-date-picker-popup-reference`}
        {...popupProps}
      >
        <div className={triggerClassName} onClick={showPopup}>
          <Input
            ref={inputRef}
            size={size}
            value={formattedValue}
            disabled={disabled}
            clearable={clearable}
            placeholder={placeholder}
            readonly={!allowInput}
            onClear={handleClear}
            prefixIcon={prefixIcon}
            suffixIcon={suffixIcon || defaultSuffixIcon}
            {...inputProps}
          />
        </div>
      </Popup>
    </div>
  );
};

DatePicker.displayName = 'DatePicker';

DatePicker.defaultProps = {
  format: 'YYYY-MM-DD',
  mode: 'month',
  placeholder: '请选择',
  size: 'medium',
};

export default DatePicker;
