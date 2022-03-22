import React, { useMemo } from 'react';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import Select from '../../select';
import { TdDatePickerProps } from '../type';
import Jumper from '../../common/Jumper';

export interface DatePickerHeaderProps extends Pick<TdDatePickerProps, 'mode'> {
  year: string | number;
  month: string | number;
  onMonthChange: Function;
  onYearChange: Function;
  onClickJumper: Function;
}

const useDatePickerLocalConfig = () => {
  const [local, t] = useLocaleReceiver('datePicker');

  return {
    months: t(local.months),
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

const DatePickerHeader = (props: DatePickerHeaderProps) => {
  const { classPrefix } = useConfig();

  const { mode, year, month, onMonthChange, onYearChange, onClickJumper } = props;

  const { now, months, preMonth, preYear, nextMonth, nextYear, preDecade, nextDecade } = useDatePickerLocalConfig();

  const monthOptions = months.map((item: string, index: number) => ({ label: item, value: index }));

  const yearOptions = useMemo(() => {
    const options = [{ label: year, value: year }];

    for (let i = 1; i <= 10; i++) {
      options.push({ label: `${Number(year) + i}`, value: Number(year) + i });
      options.unshift({ label: `${Number(year) - i}`, value: Number(year) - i });
    }
    return options;
  }, [year]);

  let preLabel: string;
  let nextLabel: string;
  if (mode === 'year') {
    preLabel = preDecade;
    nextLabel = nextDecade;
  } else if (mode === 'month') {
    preLabel = preYear;
    nextLabel = nextYear;
  } else if (mode === 'date') {
    preLabel = preMonth;
    nextLabel = nextMonth;
  }

  const headerClassName = `${classPrefix}-date-picker__header`;

  return (
    <div className={headerClassName}>
      <div className={`${headerClassName}-controller`}>
        <Select
          className={`${headerClassName}-controller--month`}
          value={month}
          options={monthOptions}
          onChange={(val) => onMonthChange(val)}
        />
        <Select
          className={`${headerClassName}-controller--year`}
          value={year}
          options={yearOptions}
          onChange={(val) => onYearChange(val)}
        />
      </div>

      <Jumper prevTitle={preLabel} currentTitle={now} nextTitle={nextLabel} onClickJumper={onClickJumper} />
    </div>
  );
};

DatePickerHeader.displayName = 'DatePickerHeader';

export default DatePickerHeader;
