import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import { getWeeks, getYears, getMonths, flagActive } from '../../_common/js/date-picker/utils-new';
import type { DatePanelProps } from './DatePanel';

export interface TableDataProps extends DatePanelProps {
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

  const { datePicker: globalDatePickerConfig } = useConfig();
  const {
    start,
    end,
    hoverStart,
    hoverEnd,
    year,
    month,
    mode,
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,
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
  };

  if (mode === 'date') {
    data = getWeeks({ year, month }, options);
  } else if (mode === 'month') {
    data = getMonths(year, options);
  } else if (mode === 'year') {
    data = getYears(year, options);
  }

  return flagActive(data, { start, end, hoverStart, hoverEnd, type: mode, isRange });
}
