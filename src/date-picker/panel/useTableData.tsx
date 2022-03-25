import { useMemo } from 'react';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../_util/useConfig';
import { getWeeks, getYears, getMonths, flagActive } from '../../_common/js/date-picker/utils-new';
import type { DatePanelProps } from './DatePanel';

export interface TableDataProps extends DatePanelProps {
  start: Date | undefined;
  end?: Date | undefined;
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
    year,
    month,
    mode = 'month',
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,
    disableDate,
    minDate,
    maxDate,
  } = props;

  // 列表数据
  const tableData = useMemo(() => {
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

    return flagActive(data, { start, end, type: mode });
  }, [year, month, mode, start, end, minDate, maxDate, disableDate, firstDayOfWeek, monthLocal]);

  return tableData;
}
