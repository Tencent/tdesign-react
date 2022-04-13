import React, { useState, useMemo } from 'react';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import Select from '../../select';
import { TdDatePickerProps } from '../type';
import Jumper from '../../common/Jumper';

export interface DatePickerHeaderProps extends Pick<TdDatePickerProps, 'mode'> {
  year?: number;
  month?: number;
  onMonthChange?: Function;
  onYearChange?: Function;
  onJumperClick?: Function;
}

const useDatePickerLocalConfig = () => {
  const [local, t] = useLocaleReceiver('datePicker');

  return {
    months: t(local.months),
    nextYear: t(local.nextYear),
    preYear: t(local.preYear),
    nextMonth: t(local.nextMonth),
    preMonth: t(local.preMonth),
    preDecade: t(local.preDecade),
    nextDecade: t(local.nextDecade),
    now: t(local.now),
  };
};

const DatePickerHeader = (props: DatePickerHeaderProps) => {
  const { classPrefix } = useConfig();

  const { mode, year, month, onMonthChange, onYearChange, onJumperClick } = props;

  const { now, months, preMonth, preYear, nextMonth, nextYear, preDecade, nextDecade } = useDatePickerLocalConfig();

  const monthOptions = months.map((item: string, index: number) => ({ label: item, value: index }));

  const [yearOptions, setYearOptions] = useState(initOptions(year));

  // 年份选择展示区间
  const nearestYear: number = useMemo(
    () => yearOptions.find((option) => option.value - year <= 9 && option.value - year >= 0)?.value || year,
    [yearOptions, year],
  );

  function initOptions(year: number) {
    const options = [];
    if (mode === 'year') {
      const extraYear = year % 10;
      const minYear = year - extraYear - 100;
      const maxYear = year - extraYear + 100;

      for (let i = minYear; i <= maxYear; i += 10) {
        options.push({ label: `${i} - ${i + 9}`, value: i + extraYear });
      }
    } else {
      options.push({ label: `${year}`, value: year });

      for (let i = 1; i <= 10; i++) {
        options.push({ label: `${year + i}`, value: year + i });
        options.unshift({ label: `${year - i}`, value: year - i });
      }
    }

    return options;
  }

  function loadMoreYear(year: number, type?: 'add' | 'reduce') {
    const options = [];
    if (mode === 'year') {
      const extraYear = year % 10;
      if (type === 'add') {
        for (let i = year - extraYear + 10; i <= year - extraYear + 50; i += 10) {
          options.push({ label: `${i} - ${i + 9}`, value: i });
        }
      } else {
        for (let i = year - extraYear - 1; i > year - extraYear - 50; i -= 10) {
          options.unshift({ label: `${i - 9} - ${i}`, value: i });
        }
      }
    } else if (type === 'add') {
      for (let i = year + 1; i <= year + 10; i++) {
        options.push({ label: `${i}`, value: i });
      }
    } else {
      for (let i = year - 1; i > year - 10; i--) {
        options.unshift({ label: `${i}`, value: i });
      }
    }

    return options;
  }

  // hover title
  const labelMap = {
    year: {
      prevTitle: preDecade,
      currentTitle: now,
      nextTitle: nextDecade,
    },
    month: {
      prevTitle: preYear,
      currentTitle: now,
      nextTitle: nextYear,
    },
    date: {
      prevTitle: preMonth,
      currentTitle: now,
      nextTitle: nextMonth,
    },
  };

  const headerClassName = `${classPrefix}-date-picker__header`;
  const showMonthPicker = mode === 'date';

  function handlePanelTopClick(e: React.MouseEvent) {
    e.stopPropagation();
    e?.nativeEvent?.stopImmediatePropagation();

    const firstYear = yearOptions[0].value;
    const options = loadMoreYear(firstYear, 'reduce');
    setYearOptions([...options, ...yearOptions]);
  }

  function handlePanelBottomClick(e: React.MouseEvent) {
    e.stopPropagation();
    e?.nativeEvent?.stopImmediatePropagation();

    const lastYear = yearOptions.slice(-1)[0].value;
    const options = loadMoreYear(lastYear, 'add');
    setYearOptions([...yearOptions, ...options]);
  }

  return (
    <div className={headerClassName}>
      <div className={`${headerClassName}-controller`}>
        {showMonthPicker && (
          <Select
            className={`${headerClassName}-controller--month`}
            value={month}
            options={monthOptions}
            onChange={(val) => onMonthChange(val)}
            popupProps={{ attach: (triggerNode: HTMLDivElement) => triggerNode.parentElement }}
          />
        )}
        <Select
          className={`${headerClassName}-controller--year`}
          value={mode === 'year' ? nearestYear : year}
          options={yearOptions}
          onChange={(val) => onYearChange(val)}
          popupProps={{ attach: (triggerNode: HTMLDivElement) => triggerNode.parentElement }}
          panelTopContent={
            <div className={`${classPrefix}-select-option`} onClick={handlePanelTopClick}>
              更多...
            </div>
          }
          panelBottomContent={
            <div className={`${classPrefix}-select-option`} onClick={handlePanelBottomClick}>
              更多...
            </div>
          }
        />
      </div>

      <Jumper {...labelMap[mode]} onJumperClick={onJumperClick} />
    </div>
  );
};

DatePickerHeader.displayName = 'DatePickerHeader';

export default DatePickerHeader;
