import React from 'react';

import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { blockName } from './_util';
import usePrefixClass from './hooks/usePrefixClass';

import type { MouseEvent } from 'react';
import type { CalendarCell, TdCalendarProps } from './type';

type ExtendType = Required<Pick<TdCalendarProps, 'fillWithZero' | 'mode' | 'theme' | 'cell' | 'cellAppend'>>;

interface CalendarCellProps extends ExtendType {
  cellData: CalendarCell;
  isCurrent: boolean;
  isNow: boolean;
  isDisabled?: boolean;
  createCalendarCell: (cellData: CalendarCell) => CalendarCell;
  onCellClick: (e: MouseEvent<HTMLDivElement>) => void;
  onCellDoubleClick: (e: MouseEvent<HTMLDivElement>) => void;
  onCellRightClick: (e: MouseEvent<HTMLDivElement>) => void;
}

const CalendarCellComp: React.FC<CalendarCellProps> = (props) => {
  const {
    mode,
    cell,
    cellAppend,
    theme,
    isDisabled = false,
    cellData,
    isCurrent,
    isNow,
    fillWithZero,
    createCalendarCell,
    onCellClick,
    onCellDoubleClick,
    onCellRightClick,
  } = props;

  const [local, t] = useLocaleReceiver('calendar');
  const monthLabelList = t(local.cellMonth).split(',');
  /**
   * 将 month 映射为文字输出
   * @param month 月份下标值（起始值为0）
   */
  const getMonthCN = (month: number): string => monthLabelList[month];

  const { calendar: calendarConfig } = useConfig();

  const fix0 = (num: number) => {
    const fillZero = num < 10 && (fillWithZero ?? calendarConfig.fillWithZero ?? true);
    return fillZero ? `0${num}` : num;
  };

  const prefixCls = usePrefixClass();

  const cellValue = mode === 'month' ? createCalendarCell(cellData) : cellData;

  function renderCellContent() {
    if (typeof cell === 'function') return cell(cellValue);
    if (cell) return cell;

    if (mode === 'year') {
      const monthIndex = cellData.date.getMonth();
      return (
        <div className={prefixCls([blockName, 'table-body-cell-display'])}>
          {theme === 'full'
            ? getMonthCN(monthIndex)
            : t(local.monthSelection, {
                month: `${monthIndex + 1}`,
              })}
        </div>
      );
    }

    return <div className={prefixCls([blockName, 'table-body-cell-display'])}>{fix0(cellData.date.getDate())}</div>;
  }

  function renderAppendContent() {
    if (!cellAppend) return null;
    const appendValue = typeof cellAppend === 'function' ? cellAppend(cellValue) : cellAppend;
    return <div className={prefixCls([blockName, 'table-body-cell-content'])}>{appendValue}</div>;
  }

  return (
    <td
      className={prefixCls(
        [blockName, 'table-body-cell'],
        isDisabled ? 'is-disabled' : null,
        isCurrent ? 'is-checked' : null,
        isNow ? [blockName, 'table-body-cell--now'] : null,
      )}
      onClick={onCellClick}
      onDoubleClick={onCellDoubleClick}
      onContextMenu={onCellRightClick}
    >
      {renderCellContent()}
      {renderAppendContent()}
    </td>
  );
};

export default CalendarCellComp;
