import React, { forwardRef } from 'react';
import isObject from 'lodash/isObject';
import classNames from 'classnames';
// import { useLocaleReceiver } from '../locale/LocalReceiver';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { TdDatePickerProps } from './type';
import SelectInput from '../select-input';
import { isEnabledDate } from './utils';
import DatePanel from './panel/Date';
import useInput from './hooks/useInput';

export interface DatePickerProps extends TdDatePickerProps, StyledProps {}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const name = `${classPrefix}-date-picker`;

<<<<<<< HEAD
<<<<<<< HEAD
// TODO 下版本重构下 datepicker 逻辑，与 RangePicker 一起实现
const DatePicker = (props: DatePickerProps) => {
  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('datePicker');
  const selectTimeText = t(local.selectTime);
  const selectDateText = t(local.selectDate);
  const confirmText = t(local.confirm);
  const rangeSeparatorText = t(local.rangeSeparator);

=======
>>>>>>> e7dc10cd (feat: rebase develop)
=======
>>>>>>> 5f948837 (feat: 重构datepicker)
  const {
    className,
    style,
    timePickerProps,
    mode = 'month',
    disabled,
    disableDate,
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,
    format = 'YYYY-MM-DD',
    valueType = 'YYYY-MM-DD',
    presets,
    enableTimePicker,
<<<<<<< HEAD
<<<<<<< HEAD
    format = 'YYYY-MM-DD',
    inputProps,
    mode = 'month',
    popupProps,
    prefixIcon,
    presets,
    range,
    size = 'medium',
    suffixIcon,
    value,
    defaultValue,
    firstDayOfWeek,
    placeholder = t(local.placeholder[mode]),
    onChange,
    onPick,
    // onBlur,
    // onFocus,
    // onInput,
  } = props;

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

  const isControlled = typeof value !== 'undefined';

  function isValidDate(date: string | number | Date | (string | number | Date)[]) {
    if (isArray(date) && isDate(new Date(date[0])) && isDate(new Date(date[1]))) return true;
    if (isString(date) && isDate(new Date(date))) return true;
    return false;
  }

  function initDatePicker() {
    const val: any = value || defaultValue;
    if (val && isValidDate(val)) {
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
    if (isControlled) {
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
        dates[0] && setStart(new Date(dates[0]));
        nextValue = selectedFmtDates.join('');
        break;
      case 'range':
        if (selectedFmtDates.length > 1) {
          setStart(new Date(dates[0]));
          setEnd(new Date(dates[1]));
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
          if (!isControlled) {
            setStart(value);
            setEnd(value);
          }
          setSelectedDates([value]);
          // 有时间选择时，点击日期不关闭弹窗
          clickedApply(!enableTimePicker, [value]);
        }
        break;
      }
      case 'range': {
        if (Array.isArray(value)) {
          if (!isControlled) {
            setStart(value[0]);
            setEnd(value[1]);
          }
          setSelectedDates(value);
          // 有时间选择时，点击日期不关闭弹窗
          clickedApply(!enableTimePicker, value);
        }
        break;
      }
    }
  }

  function isEnabled(value: Date): boolean {
    if (!disableDate) return true;

    let isEnabled = true;
    // 值类型为 Function 则表示返回值为 true 的日期会被禁用
    if (typeof disableDate === 'function') {
      return !disableDate(value);
    }

    // 禁用日期，示例：['A', 'B'] 表示日期 A 和日期 B 会被禁用。
    if (Array.isArray(disableDate)) {
      let isIncludes = false;
      const formatedDisabledDate = disableDate.map((item: string) => dayjs(item, format));
      formatedDisabledDate.forEach((item) => {
        if (item.isSame(dayjs(value))) {
          isIncludes = true;
        }
      });
      return !isIncludes;
    }

    // { from: 'A', to: 'B' } 表示在 A 到 B 之间的日期会被禁用。
    const { from, to, before, after } = disableDate;
    if (from && to) {
      const compareMin = dayjs(new Date(from));
      const compareMax = dayjs(new Date(to));

      return !dayjs(value).isBetween(compareMin, compareMax, mode, '[]');
    }

    const min = before ? new Date(before) : null;
    const max = after ? new Date(after) : null;

    // { before: 'A', after: 'B' } 表示在 A 之前和在 B 之后的日期都会被禁用。
    if (max && min) {
      const compareMin = dayjs(new Date(min));
      const compareMax = dayjs(new Date(max));

      isEnabled = dayjs(value).isBetween(compareMin, compareMax, mode, '[]');
    } else if (min) {
      const compareMin = dayjs(new Date(min));
      isEnabled = !dayjs(value).isBefore(compareMin, mode);
    } else if (max) {
      const compareMax = dayjs(new Date(max));
      isEnabled = !dayjs(value).isAfter(compareMax, mode);
    }
    return isEnabled;
  }

  function renderContent() {
    const pickerStyles = classNames(`${classPrefix}-date-picker__container`, {
      [`${classPrefix}-date-picker--open`]: popupShow,
      [`${classPrefix}-date-picker--range`]: range,
    });

    const panelProps = {
      mode,
      firstDayOfWeek: firstDayOfWeek === undefined ? 1 : firstDayOfWeek,
      onChange: dateClick,
      disableDate: (d: Date) => !isEnabled(d),
      minDate: isObject(disableDate) && 'before' in disableDate ? new Date(disableDate.before) : null,
      maxDate: isObject(disableDate) && 'after' in disableDate ? new Date(disableDate.after) : null,
    };

    const handlePick = (date: DateValue, context: PickContext) => {
      onPick?.(date, context);
    };

    const panelComponent = range ? (
      <DateRangePanel {...panelProps} onPick={handlePick} value={[start, end]} />
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
        {(!!presets || enableTimePicker) && (
          <div className={`${classPrefix}-date-picker__footer`}>
            <CalendarPresets presets={presets} onClickRange={clickRange} />
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
        )}
      </div>
    );
  }

  const triggerClassName = classNames(`${classPrefix}-form-controls`, { [CLASSNAMES.STATUS.active]: popupShow });
  const defaultSuffixIcon = enableTimePicker ? <IconTime /> : <IconCalendar />;
  const datePickerClassName = classNames(`${classPrefix}-date-picker`, className, CLASSNAMES.SIZE[size], {
    [`${classPrefix}-date-picker--month-picker`]: mode === 'year' || mode === 'month',
  });
=======
  } = props;

  const {
    value,
    onChange,
    inputValue,
    setInputValue,
    popupVisible,
    setPopupVisible,
    inputProps,
    popupProps,
    formatDate,
  } = useInput(props);

  const panelProps = {
    value,
    onChange,
=======
  } = props;

  const {
    value,
    onChange,
    inputValue,
    setInputValue,
    popupVisible,
    setPopupVisible,
    inputProps,
    popupProps,
    formatDate,
  } = useInput(props);

  const panelProps = {
    value,
    onChange,
>>>>>>> 5f948837 (feat: 重构datepicker)
    inputValue,
    setInputValue,
    setPopupVisible,
    formatDate,
    timePickerProps,
    mode,
    format,
    presets,
    valueType,
    enableTimePicker,
    firstDayOfWeek: firstDayOfWeek ?? 1,
    disableDate: (date: Date) => !isEnabledDate({ value: date, disableDate, mode, format }),
    minDate: isObject(disableDate) && 'before' in disableDate ? new Date(disableDate.before) : null,
    maxDate: isObject(disableDate) && 'after' in disableDate ? new Date(disableDate.after) : null,
  };
<<<<<<< HEAD
>>>>>>> e7dc10cd (feat: rebase develop)
=======
>>>>>>> 5f948837 (feat: 重构datepicker)

  return (
    <div className={classNames(name, className)} style={style} ref={ref}>
      <SelectInput
        disabled={disabled}
        value={inputValue}
        popupProps={popupProps}
        inputProps={inputProps}
        popupVisible={popupVisible}
        onPopupVisibleChange={setPopupVisible}
        panel={<DatePanel {...panelProps} />}
      />
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
