import React from 'react';
import useConfig from '../../_util/useConfig';
import Button from '../../button';
import IconChevronLeft from '../../icon/icons/ChevronLeftIcon';
import IconChevronRight from '../../icon/icons/ChevronRightIcon';
import IconRound from '../../icon/icons/RoundIcon';

export interface DatePickerHeaderProps {
  year: number;
  month: number;
  onBtnClick: Function;
  onTypeChange: Function;
  type: 'year' | 'month' | 'date';
}

// TODO 国际化时候抽离出去
const DATE_PICKER_LOCALE = {
  rangeSeparator: ' 至 ',
  yearAriaLabel: '年',
  monthAriaLabel: '月',
  nextYear: '下一年',
  preYear: '上一年',
  nextMonth: '下个月',
  preMonth: '上个月',
  preDecade: '上个十年',
  nextDecade: '下个十年',
  now: '当前',
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
  } = DATE_PICKER_LOCALE;

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
          icon={<IconChevronLeft />}
          className={`${classPrefix}-date-picker-header-controller__btn`}
        ></Button>
        <Button
          title={now}
          variant="text"
          onClick={() => onBtnClick(0)}
          icon={<IconRound />}
          className={`${classPrefix}-date-picker-header-controller__btn ${classPrefix}-date-picker-header-controller__btn--now`}
        ></Button>
        <Button
          title={nextLabel}
          variant="text"
          onClick={() => onBtnClick(1)}
          icon={<IconChevronRight />}
          className={`${classPrefix}-date-picker-header-controller__btn`}
        ></Button>
      </span>
    </div>
  );
};

DatePickerHeader.displayName = 'DatePickerHeader';

export default DatePickerHeader;
