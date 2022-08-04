import React, { MouseEvent } from 'react';
import { CalendarCell, TdCalendarProps } from './type';
import useConfig from '../hooks/useConfig';
import usePrefixClass from './hooks/usePrefixClass';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { blockName } from './_util';

type extendType = Required<Pick<TdCalendarProps, 'fillWithZero' | 'mode' | 'theme' | 'cell' | 'cellAppend'>>;
interface CalendarCellProps extends extendType {
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
      {(() => {
        if (cell && typeof cell === 'function') return cell(mode === 'month' ? createCalendarCell(cellData) : cellData);
        if (cell && typeof cell !== 'function') return cell;
        let cellCtx;
        if (mode === 'year') {
          // year mode：输出月
          const mIndex = cellData.date.getMonth();
          cellCtx = theme === 'full' ? getMonthCN(mIndex) : t(local.monthSelection, { month: `${mIndex + 1}` });
        } else {
          // month mode：输出天
          cellCtx = fix0(cellData.date.getDate());
        }
        return <div className={prefixCls([blockName, 'table-body-cell-display'])}>{cellCtx}</div>;
      })()}
      {(() => {
        let cellCtx;
        if (cellAppend && typeof cellAppend === 'function') {
          cellCtx = cellAppend(mode === 'month' ? createCalendarCell(cellData) : cellData);
        }
        if (cellAppend && typeof cellAppend !== 'function') {
          cellCtx = cellAppend;
        }
        return cellAppend && <div className={prefixCls([blockName, 'table-body-cell-content'])}>{cellCtx}</div>;
      })()}
    </td>
  );
};

export default CalendarCellComp;
