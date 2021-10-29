import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, RoundIcon } from '@tencent/tdesign-icons-react';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import Button from '../../button';
import useConfig from '../../_util/useConfig';

export interface DatePickerHeaderProps {
  year: number;
  month: number;
  onBtnClick: Function;
  onTypeChange: Function;
  type: 'year' | 'month' | 'date';
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

const DatePickerHeader = (props: DatePickerHeaderProps) => {
  const { classPrefix } = useConfig();

  const { type, year, month, onBtnClick, onTypeChange } = props;

  const startYear = parseInt((year / 10).toString(), 10) * 10;
  const {
    now,
    rangeSeparator,
    yearAriaLabel,
    monthAriaLabel,
    preMonth,
    preYear,
    nextMonth,
    nextYear,
    preDecade,
    nextDecade,
  } = useDatePickerLocalConfig();

  let preLabel: string;
  let nextLabel: string;
  if (type === 'year') {
    preLabel = preDecade;
    nextLabel = nextDecade;
  } else if (type === 'date') {
    preLabel = preMonth;
    nextLabel = nextMonth;
  } else {
    preLabel = preYear;
    nextLabel = nextYear;
  }

  return (
    <div className={`${classPrefix}-date-picker-header`}>
      <span className={`${classPrefix}-date-picker-header-title`}>
        {type === 'year' && (
          <div>
            <span>{startYear}</span>
            {rangeSeparator}
            <span>{startYear + 9}</span>
          </div>
        )}
        {type !== 'year' && (
          <Button
            variant="text"
            size="small"
            onClick={() => onTypeChange('year')}
            className={`${classPrefix}-date-header__btn`}
          >
            {`${year} ${yearAriaLabel}`}
          </Button>
        )}
        {type === 'date' && (
          <Button className="t-date-header__btn" variant="text" size="small" onClick={() => onTypeChange('month')}>
            {`${month === 12 ? 1 : month + 1} ${monthAriaLabel}`}
          </Button>
        )}
      </span>

      <span className={`${classPrefix}-date-picker-header-controller`}>
        <Button
          title={preLabel}
          variant="text"
          onClick={() => onBtnClick(-1)}
          icon={<ChevronLeftIcon />}
          className={`${classPrefix}-date-picker-header-controller__btn`}
        ></Button>
        <Button
          title={now}
          variant="text"
          onClick={() => onBtnClick(0)}
          icon={<RoundIcon />}
          className={`${classPrefix}-date-picker-header-controller__btn ${classPrefix}-date-picker-header-controller__btn--now`}
        ></Button>
        <Button
          title={nextLabel}
          variant="text"
          onClick={() => onBtnClick(1)}
          icon={<ChevronRightIcon />}
          className={`${classPrefix}-date-picker-header-controller__btn`}
        ></Button>
      </span>
    </div>
  );
};

DatePickerHeader.displayName = 'DatePickerHeader';

export default DatePickerHeader;
