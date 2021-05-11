import * as React from 'react';
import dayjs from 'dayjs';
import Button from '../button';
import Select from '../select';
import Radio from '../radio';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type/StyledProps';

export interface CalendarProps extends StyledProps {
  /**
   * 周起始日（可以设置第一列显示周几，其他列就顺延下去），mode为“month”的时候有效；传入的值得必须是整数1到7其中之一
   * @default 1
   */
  firstDayOfWeek?: number;
  /**
   * 指定高亮日期
   * @default new Date()
   */
  value?: Date;
  /**
   * 初始化的时候指定高亮日期
   * @default new Date(0)
   */
  defaultValue?: Date;
  /**
   * 风格，传入值必须是"full"或"card"
   * @default 'full'
   */
  theme?: 'full' | 'card';
  /**
   * 模式，传入值必须是"month"或"year"
   * @default 'month'
   */
  mode?: 'month' | 'year';
  /**
   * 自定义日历的年月份显示范围（包含from和to）
   */
  range?: { from: Date; to: Date };
  /**
   * 是否禁用单元格右键默认系统菜单
   * @default false
   */
  preventCellContextMenu?: boolean;
  /**
   * 默认是否显示周末
   * @default true
   */
  isShowWeekendDefault?: boolean;
  /**
   * 右上角控件组的相关配置
   */
  controllerConfig?: {
    visible?: boolean;
    disabled?: boolean;
    mode?: {
      visible?: boolean;
      radioGroupProps?: object;
    };
    year?: {
      visible?: boolean;
      selectProps?: object;
    };
    month?: {
      visible?: boolean;
      selectProps?: object;
    };
    weekendToggle?: {
      visible?: boolean;
      showWeekendButtonProps?: object;
      hideWeekendButtonProps?: object;
    };
    current?: {
      visible?: boolean;
      currentDayButtonProps?: object;
      currentMonthButtonProps?: object;
    };
  };
  /**
   * 单元格插槽（替换默认内容）
   */
  header?: React.ReactNode;
  /**
   * 	单元格插槽（替换默认内容）
   */
  cell?: React.ReactNode;
  /**
   * 单元格插槽（在原来的内容之后追加）
   */
  cellAppend?: React.ReactNode;
  /**
   * 日历单元格点击事件（左键点击）
   */
  onControllerChange?: (data: { filterDate: Date; isShowWeekend: boolean; mode: string }) => void;
  /**
   * 日历单元格双击事件
   */
  onCellClick?: (data: { data: Date; filterDate: Date; mode: string }) => void;
  /**
   * 日历单元格点击事件（右键点击）
   */
  onCellDoubleClick?: (data: { data: Date; filterDate: Date; mode: string }) => void;
  /**
   * 右上角控件组选中值有变化的时候触发该事件
   */
  onCellRightClick?: (data: { data: Date; filterDate: Date; mode: string }) => void;
}

export interface CalendarMethods {
  /**
   * 显示当前月份\年份
   */
  toCurrent: () => void;
}

const fix0 = (num: number): string => (num <= 9 ? `0${num}` : String(num));

const blockName = 'calendar';

const Calendar: React.FC<CalendarProps> = React.forwardRef((props, ref: React.MutableRefObject<CalendarMethods>) => {
  const {
    className = '',
    style = {},
    mode: modeFromProps = 'month',
    value: valueFromProps = null,
    defaultValue = null,
    firstDayOfWeek = 1,
    range = null,
    header = null,
    cell = null,
    cellAppend = null,
    theme = 'full',
    controllerConfig = {},
    isShowWeekendDefault = true,
    preventCellContextMenu = false,
    onControllerChange = noop,
    onCellClick = noop,
    onCellDoubleClick = noop,
    onCellRightClick = noop,
  } = props;

  const {
    visible = true,
    disabled = false,
    mode: modeFromConfig = {},
    year: yearFromConfig = {},
    month: monthFromConfig = {},
    weekendToggle = {},
    current = {},
  } = controllerConfig;

  const { visible: visibleForMode = true, radioGroupProps: radioGroupPropsForMode = {} } = modeFromConfig;
  const { visible: visibleForYear = true, selectProps: selectPropsForYear = {} } = yearFromConfig;
  const { visible: visibleForMonth = true, selectProps: selectPropsForMonth = {} } = monthFromConfig;
  const {
    visible: visibleForWeekendToggle = true,
    showWeekendButtonProps = {},
    hideWeekendButtonProps = {},
  } = weekendToggle;
  const { visible: visibleForCurrent = true, currentDayButtonProps = {}, currentMonthButtonProps = {} } = current;

  const { classPrefix } = useConfig();
  const [mode, setMode] = React.useState<string>('month');
  const [value, setValue] = React.useState<dayjs.Dayjs>(dayjs(defaultValue || new Date()));
  const [year, setYear] = React.useState<number>(value.year());
  const [month, setMonth] = React.useState<number>(value.month());
  const [isShowWeekend, setIsShowWeekend] = React.useState<boolean>(isShowWeekendDefault);

  const weekdayList = React.useMemo(() => {
    if (mode === 'year') return [];

    return ['一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五', '六']
      .slice(firstDayOfWeek - 1)
      .slice(0, 7)
      .filter((item) => {
        if (isShowWeekend) return true;
        if (!isShowWeekend && item !== '六' && item !== '日') return true;
        return false;
      });
  }, [mode, firstDayOfWeek, isShowWeekend]);

  const [yearSelectList, monthSelectList] = React.useMemo(() => {
    const createList = (min: number, max: number): number[] => {
      if (min > max) return [];
      const list = [];
      for (let i = min; i <= max; i += 1) {
        list.push(i);
      }
      return list;
    };

    const monthList = createList(1, 12);

    if (range && range.from instanceof Date && range.to instanceof Date) {
      const fromYear = dayjs(range.from).subtract(10, 'year');
      const toYear = dayjs(range.to).add(10, 'year');
      const yearList = createList(fromYear.year(), toYear.year());

      return [yearList, monthList];
    }

    const fromYear = year - 10 < 0 ? 0 : year - 10;
    const toYear = year + 10;
    const yearList = createList(fromYear, toYear);
    return [yearList, monthList];
  }, [range, year]);

  const dateList = React.useMemo<dayjs.Dayjs[][]>(() => {
    const now = dayjs(new Date(year, month, 1));
    const list = [] as dayjs.Dayjs[];

    for (let i = 0; i < 42; i += 1) {
      list.push(now.add(i, 'day'));
    }

    if (now.day() !== firstDayOfWeek) {
      for (let i = 1; i <= 7 - firstDayOfWeek; i += 1) {
        list.unshift(now.subtract(i, 'day'));
      }
    }

    const rowList = [] as dayjs.Dayjs[][];

    for (let i = 0; i < 6; i += 1) {
      rowList.push(list.slice(i * 7, (i + 1) * 7));
    }

    return rowList;
  }, [year, month, firstDayOfWeek]);

  const monthList = React.useMemo<string[][]>(() => {
    if (theme === 'full') {
      return [
        ['一', '二', '三', '四'],
        ['五', '六', '七', '八'],
        ['九', '十', '十一', '十二'],
      ];
    }

    if (theme === 'card') {
      return [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['10', '11', '12'],
      ];
    }

    return [];
  }, [theme]);

  const prefixCls = React.useCallback(
    (...args: (string | [string, string?, string?])[]) => {
      let className = '';
      args.forEach((item, index) => {
        if (item && index > 0) className = className.concat(' ');
        if (item instanceof Array) {
          const [block, element, modifier] = item;
          className = className.concat(classPrefix, '-', block);
          if (element) className = className.concat('__', element);
          if (modifier) className = className.concat('--', modifier);
        } else if (typeof item === 'string') {
          className = className.concat(classPrefix, '-', item);
        }
      });
      return className;
    },
    [classPrefix],
  );

  const toCurrent = React.useCallback(() => {
    const now = dayjs();

    setYear(now.year());
    setMonth(now.month());
  }, []);

  const clickCell = React.useCallback(
    (event, date: dayjs.Dayjs) => {
      onCellClick({ data: date.toDate(), filterDate: new Date(year, month), mode });
    },
    [mode, year, month, onCellClick],
  );

  const doubleClickCell = React.useCallback(
    (event, date: dayjs.Dayjs) => {
      onCellDoubleClick({ data: date.toDate(), filterDate: new Date(year, month), mode });
    },
    [mode, year, month, onCellDoubleClick],
  );

  const rightClickCell = React.useCallback(
    (event, date: dayjs.Dayjs) => {
      if (preventCellContextMenu) event.preventDefault();
      onCellRightClick({ data: date.toDate(), filterDate: new Date(year, month), mode });
    },
    [mode, year, month, preventCellContextMenu, onCellRightClick],
  );

  React.useImperativeHandle(ref, () => ({ toCurrent }), [toCurrent]);

  React.useEffect(() => {
    if (valueFromProps instanceof Date) setValue(dayjs(valueFromProps));
  }, [valueFromProps]);

  React.useEffect(() => {
    setMode(modeFromProps);
  }, [modeFromProps]);

  React.useEffect(() => {
    setIsShowWeekend(isShowWeekendDefault);
  }, [isShowWeekendDefault]);

  React.useLayoutEffect(() => {
    onControllerChange({ filterDate: new Date(year, month), isShowWeekend, mode });
  }, [mode, year, month, isShowWeekend, onControllerChange]);

  return (
    <div className={prefixCls(blockName, [blockName, '', theme]).concat(' ', className)} style={style}>
      {visible && (
        <div className={prefixCls([blockName, 'control'])}>
          <div className={prefixCls([blockName, 'control-section'])}>
            <div className={prefixCls([blockName, 'control-section-cell'])}>
              {visibleForYear && (
                <Select
                  size="small"
                  style={{ width: '100px' }}
                  disabled={disabled}
                  value={year}
                  options={yearSelectList.map((item) => ({ label: `${item}年`, value: item }))}
                  onChange={(selectYear) => setYear(selectYear as number)}
                  {...selectPropsForYear}
                />
              )}
            </div>
            <div className={prefixCls([blockName, 'control-section-cell'])}>
              {visibleForMonth && mode === 'month' && (
                <Select
                  size="small"
                  style={{ width: '80px' }}
                  disabled={disabled}
                  value={month}
                  options={monthSelectList.map((item) => ({ label: `${item}月`, value: item }))}
                  onChange={(selectMonth) => setMonth(selectMonth as number)}
                  {...selectPropsForMonth}
                />
              )}
            </div>
          </div>
          <div className={prefixCls([blockName, 'control-section'])}>
            <div className={prefixCls([blockName, 'control-section-cell'])} style={{ height: 'auto' }}>
              {visibleForMode && (
                <Radio.Group
                  size="small"
                  value={mode}
                  disabled={disabled}
                  onChange={(value) => setMode(String(value))}
                  {...radioGroupPropsForMode}
                >
                  <Radio.Button value="month">月</Radio.Button>
                  <Radio.Button value="year">年</Radio.Button>
                </Radio.Group>
              )}
            </div>
            {mode === 'month' && theme === 'full' && visibleForWeekendToggle && (
              <div className={prefixCls([blockName, 'control-section-cell'])}>
                {isShowWeekend ? (
                  <Button
                    size="small"
                    disabled={disabled}
                    onClick={() => setIsShowWeekend(false)}
                    {...hideWeekendButtonProps}
                  >
                    隐藏周末
                  </Button>
                ) : (
                  <Button
                    size="small"
                    disabled={disabled}
                    onClick={() => setIsShowWeekend(true)}
                    {...showWeekendButtonProps}
                  >
                    显示周末
                  </Button>
                )}
              </div>
            )}
            {theme === 'full' && (
              <div className={prefixCls([blockName, 'control-section-cell'])}>
                {mode === 'year' && visibleForCurrent && (
                  <Button size="small" disabled={disabled} onClick={toCurrent} {...currentMonthButtonProps}>
                    本月
                  </Button>
                )}
                {mode === 'month' && visibleForCurrent && (
                  <Button size="small" disabled={disabled} onClick={toCurrent} {...currentDayButtonProps}>
                    今天
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={prefixCls([blockName, 'panel'])}>
        <div className={prefixCls([blockName, 'panel-title'])}>{React.isValidElement(header) && header}</div>
        <table className={prefixCls([blockName, 'table'])}>
          {weekdayList.length > 0 && (
            <thead className={prefixCls([blockName, 'table-head'])}>
              <tr className={prefixCls([blockName, 'table-head-row'])}>
                {weekdayList.map((item) => (
                  <th key={item} className={prefixCls([blockName, 'table-head-cell'])}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          {mode === 'month' && (
            <tbody className={prefixCls([blockName, 'table-body'])}>
              {dateList.map((dateRow, dateRowIndex) => (
                <tr key={String(dateRowIndex)} className={prefixCls([blockName, 'table-body-row'])}>
                  {dateRow.map((dateCell, dateCellIndex) => {
                    if (!isShowWeekend && [0, 6].indexOf(dateCell.day()) >= 0) return null;
                    return (
                      <td
                        key={String(dateCellIndex)}
                        className={prefixCls(
                          [blockName, 'table-body-cell'],
                          dateCell.month() !== month && 'is-disabled',
                          dateCell.isSame(value, 'date') && 'is-checked',
                        )}
                        onClick={(event) => clickCell(event, dateCell)}
                        onDoubleClick={(event) => doubleClickCell(event, dateCell)}
                        onContextMenu={(event) => rightClickCell(event, dateCell)}
                      >
                        {(() => {
                          if (cell && typeof cell === 'function') return cell(dateCell.toDate());
                          if (cell && typeof cell !== 'function') return cell;

                          return (
                            <div className={prefixCls([blockName, 'table-body-cell-value'])}>
                              {fix0(dateCell.date())}
                            </div>
                          );
                        })()}
                        {(() => {
                          if (cellAppend && typeof cellAppend === 'function') return cellAppend(dateCell.toDate());
                          if (cellAppend && typeof cellAppend !== 'function') return cellAppend;

                          return <div className={prefixCls([blockName, 'table-body-cell-content'])} />;
                        })()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          )}
          {mode === 'year' && (
            <tbody className={prefixCls([blockName, 'table-body'])}>
              {monthList.map((monthRow, monthRowIndex) => (
                <tr key={String(monthRowIndex)} className={prefixCls([blockName, 'table-body-row'])}>
                  {monthRow.map((monthCell, monthCellIndex) => (
                    <td
                      key={String(monthCellIndex)}
                      className={prefixCls(
                        [blockName, 'table-body-cell'],
                        [
                          monthList
                            .toString()
                            .split(',')
                            .findIndex((item) => item === monthCell) === month && 'is-checked',
                        ],
                      )}
                    >
                      {(() => {
                        if (cell && typeof cell === 'function') return cell(new Date(year, Number(monthCell)));
                        if (cell && typeof cell !== 'function') return cell;

                        return (
                          <div className={prefixCls([blockName, 'table-body-cell-value'])}>{`${monthCell}月`}</div>
                        );
                      })()}

                      {(() => {
                        if (cellAppend && typeof cellAppend === 'function') {
                          return cellAppend(new Date(year, Number(monthCell)));
                        }
                        if (cellAppend && typeof cellAppend !== 'function') return cellAppend;

                        return <div className={prefixCls([blockName, 'table-body-cell-content'])} />;
                      })()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
});

export default Calendar;
