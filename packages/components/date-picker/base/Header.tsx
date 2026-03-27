import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useConfig from '../../hooks/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { PaginationMini, type TdPaginationMiniProps } from '../../pagination';
import Select from '../../select';
import type { TdDatePickerProps } from '../type';
import { SinglePanelProps } from '../panel/SinglePanel';
import { useSelectRange } from '../hooks/useSelectRange';

export interface DatePickerHeaderProps extends Pick<TdDatePickerProps, 'mode'> {
  year?: number;
  month?: number;
  range?: SinglePanelProps['range'];
  internalYear: Array<number>;
  partial: 'start' | 'end';
  onMonthChange?: Function;
  onYearChange?: Function;
  onJumperClick?: TdPaginationMiniProps['onChange'];
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

  const { mode, year, month, range, onMonthChange, onYearChange, onJumperClick, partial, internalYear = [] } = props;

  const { now, months, preMonth, preYear, nextMonth, nextYear, preDecade, nextDecade } = useDatePickerLocalConfig();

  const scrollAnchorRef = useRef('default');
  const {
    paginationDisabled,
    monthHasAnyAllowed,
    yearHasAnyAllowed,
    decadeHasAnyAllowed,
    canLoadMoreTop,
    canLoadMoreBottom,
  } = useSelectRange({
    range,
    mode,
    year,
    month,
  });

  const initOptions = useCallback(
    (year: number) => {
      const options = [];
      if (mode === 'year') {
        const extraYear = year % 10;
        const minYear = year - extraYear - 100;
        const maxYear = year - extraYear + 100;

        for (let i = minYear; i <= maxYear; i += 10) {
          const end = i + 9;
          // 仅加入可选的年代
          if (decadeHasAnyAllowed(end)) {
            options.push({ label: `${i} - ${end}`, value: i + 9, disabled: false });
          }
        }
      } else {
        // 中心年份（仅在可选范围内时加入）
        yearHasAnyAllowed(year) && options.push({ label: `${year}`, value: year, disabled: false });

        for (let i = 1; i <= 10; i++) {
          yearHasAnyAllowed(year + i) && options.push({ label: `${year + i}`, value: year + i, disabled: false });
          yearHasAnyAllowed(year - i) && options.unshift({ label: `${year - i}`, value: year - i, disabled: false });
        }
      }

      return options;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode],
  );

  const [yearOptions, setYearOptions] = useState(() => initOptions(year));

  // 年份选择展示区间
  const nearestYear: number = useMemo(() => {
    // 右侧面板年份选择需要保持大于左侧面板年份选择
    const extraYear = partial === 'end' && mode === 'year' && internalYear[1] - internalYear[0] <= 9 ? 9 : 0;
    return (
      yearOptions.find((option) => option.value - (year + extraYear) <= 9 && option.value - (year + extraYear) >= 0)
        ?.value || year
    );
  }, [yearOptions, year, mode, partial, internalYear]);

  const monthOptions = months.map((item: string, index: number) => ({
    label: item,
    value: index,
    disabled: !monthHasAnyAllowed(year, index),
  }));

  // 顶部/底部是否展示“加载更多”内容（...）
  const showPanelTop = useMemo(() => {
    const options = yearOptions;
    if (!options.length) return false;
    const first = options[0].value;
    return canLoadMoreTop(first);
  }, [canLoadMoreTop, yearOptions]);

  const showPanelBottom = useMemo(() => {
    const options = yearOptions;
    if (!options.length) return false;
    const last = options[options.length - 1].value;
    return canLoadMoreBottom(last);
  }, [canLoadMoreBottom, yearOptions]);

  function loadMoreYear(year: number, type?: 'add' | 'reduce') {
    const options = [];
    if (mode === 'year') {
      const extraYear = year % 10;
      if (type === 'add') {
        for (let i = year - extraYear + 10; i <= year - extraYear + 50; i += 10) {
          const end = i + 9;
          // 仅加入可选的年
          decadeHasAnyAllowed(end) && options.push({ label: `${i} - ${end}`, value: i, disabled: false });
        }
      } else {
        for (let i = year - extraYear - 1; i > year - extraYear - 50; i -= 10) {
          decadeHasAnyAllowed(i) && options.unshift({ label: `${i - 9} - ${i}`, value: i, disabled: false });
        }
      }
    } else if (type === 'add') {
      for (let i = year + 1; i <= year + 10; i++) {
        yearHasAnyAllowed(i) && options.push({ label: `${i}`, value: i, disabled: false });
      }
    } else {
      for (let i = year - 1; i > year - 10; i--) {
        yearHasAnyAllowed(i) && options.unshift({ label: `${i}`, value: i, disabled: false });
      }
    }

    return options;
  }

  // hover title
  const labelMap = {
    year: {
      prev: preDecade,
      current: now,
      next: nextDecade,
    },
    month: {
      prev: preYear,
      current: now,
      next: nextYear,
    },
    date: {
      prev: preMonth,
      current: now,
      next: nextMonth,
    },
  };

  const headerClassName = `${classPrefix}-date-picker__header`;
  const showMonthPicker = mode === 'date' || mode === 'week';

  function handlePanelTopClick(e?: React.MouseEvent) {
    e?.stopPropagation?.();
    e?.nativeEvent?.stopImmediatePropagation?.();

    const firstYear = yearOptions[0].value;
    const options = loadMoreYear(firstYear, 'reduce');
    setYearOptions([...options, ...yearOptions]);
  }

  function handlePanelBottomClick(e?: React.MouseEvent) {
    e?.stopPropagation?.();
    e?.nativeEvent?.stopImmediatePropagation();

    const lastYear = yearOptions.slice(-1)[0].value;
    const options = loadMoreYear(lastYear, 'add');
    setYearOptions([...yearOptions, ...options]);
  }

  // 滚动顶部底部自动加载
  function handleScroll({ e }) {
    if (e.target.scrollTop === 0) {
      showPanelTop && handlePanelTopClick();
      scrollAnchorRef.current = 'top';
    } else if (e.target.scrollTop === e.target.scrollHeight - e.target.clientHeight) {
      showPanelBottom && handlePanelBottomClick();
      scrollAnchorRef.current = 'bottom';
    }
  }

  function handleUpdateScrollTop(content: HTMLElement) {
    if (scrollAnchorRef.current === 'top') {
      // eslint-disable-next-line no-param-reassign
      content.scrollTop = 30 * 10;
    } else if (scrollAnchorRef.current === 'bottom') {
      // eslint-disable-next-line no-param-reassign
      content.scrollTop = content.scrollHeight - 30 * 10;
    } else {
      const firstSelectedNode: HTMLDivElement = content?.querySelector(`.${classPrefix}-is-selected`);

      if (firstSelectedNode) {
        const { paddingBottom } = getComputedStyle(firstSelectedNode);
        const { marginBottom } = getComputedStyle(content);
        const elementBottomHeight = parseInt(paddingBottom, 10) + parseInt(marginBottom, 10);
        // 小于0时不需要特殊处理，会被设为0
        const updateValue =
          firstSelectedNode.offsetTop -
          content.offsetTop -
          (content.clientHeight - firstSelectedNode.clientHeight) +
          elementBottomHeight;
        // eslint-disable-next-line no-param-reassign
        content.scrollTop = updateValue;
      }
    }
  }

  useEffect(() => {
    const yearRange = initOptions(year);
    setYearOptions(yearRange);
  }, [initOptions, year]);

  return (
    <div className={headerClassName}>
      <div className={`${headerClassName}-controller`}>
        {showMonthPicker && (
          <Select
            className={`${headerClassName}-controller-month`}
            value={month}
            options={monthOptions}
            onChange={(val) => onMonthChange(val)}
            popupProps={{
              attach: (triggerElement: HTMLElement) => triggerElement.parentNode as HTMLElement,
              overlayClassName: `${headerClassName}-controller-month-popup`,
            }}
          />
        )}
        <Select
          className={`${headerClassName}-controller-year`}
          value={mode === 'year' ? nearestYear : year}
          options={yearOptions}
          onChange={(val) => onYearChange(val)}
          onPopupVisibleChange={(visible) => {
            if (!visible) scrollAnchorRef.current = 'default';
          }}
          popupProps={{
            onScroll: handleScroll,
            updateScrollTop: (el) => {
              setTimeout(() => {
                handleUpdateScrollTop(el);
              }, 0);
            },
            attach: (triggerElement: HTMLElement) => triggerElement.parentNode as HTMLElement,
            overlayClassName: `${headerClassName}-controller-year-popup`,
          }}
          panelTopContent={
            showPanelTop && (
              <div className={`${classPrefix}-select-option`} onClick={handlePanelTopClick}>
                ...
              </div>
            )
          }
          panelBottomContent={
            showPanelBottom && (
              <div className={`${classPrefix}-select-option`} onClick={handlePanelBottomClick}>
                ...
              </div>
            )
          }
        />
      </div>

      <PaginationMini tips={labelMap[mode]} size="small" disabled={paginationDisabled} onChange={onJumperClick} />
    </div>
  );
};

DatePickerHeader.displayName = 'DatePickerHeader';

export default React.memo(DatePickerHeader);
