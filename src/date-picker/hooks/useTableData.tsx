import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { getWeeks, getQuarters, getYears, getMonths, flagActive } from '../../_common/js/date-picker/utils';
import type { SinglePanelProps } from '../panel/SinglePanel';

export interface TableDataProps extends SinglePanelProps {
  isRange?: Boolean;
  start: Date | undefined;
  end?: Date | undefined;
  hoverStart?: Date | undefined;
  hoverEnd?: Date | undefined;
  minDate: Date | null;
  maxDate: Date | null;
}

export default function useTableData(props: TableDataProps) {
  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('datePicker');
  const monthLocal: string[] = t(local.months);
  const quarterLocal: string[] = t(local.quarters);

  const {
    start,
    end,
    hoverStart,
    hoverEnd,
    year,
    month,
    mode,
    firstDayOfWeek,
    disableDate,
    minDate,
    maxDate,
    isRange,
  } = props;

  // 列表数据
  let data = [];

  const options = {
    minDate,
    maxDate,
    disableDate,
    firstDayOfWeek,
    monthLocal,
    quarterLocal,
    showWeekOfYear: mode === 'week',
  };

  if (mode === 'date') {
    data = getWeeks({ year, month }, options);
  } else if (mode === 'week') {
    data = getWeeks({ year, month }, options);
  } else if (mode === 'quarter') {
    data = getQuarters(year, options);
  } else if (mode === 'month') {
    data = getMonths(year, options);
  } else if (mode === 'year') {
    data = getYears(year, options);
  }

  return flagActive(data, { start, end, hoverStart, hoverEnd, type: mode, isRange });
}
