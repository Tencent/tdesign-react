import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import useConfig from '../../hooks/useConfig';
import useLatest from '../../hooks/useLatest';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { PaginationMini } from '../../pagination';
import Select from '../../select';
import { useSelectRange } from '../hooks/useSelectRange';

import type { TdPaginationMiniProps } from '../../pagination';
import type { SinglePanelProps } from '../panel/SinglePanel';
import type { TdDatePickerProps } from '../type';

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

  const handleTopRef = useLatest(handlePanelTopClick);

  const scrollAnchorRef = useRef<'default' | 'top' | 'bottom'>('default');
  const anchorRef = useRef<{
    direction: 'top' | 'bottom';
    scrollHeight: number;
    scrollTop: number;
  } | null>(null); // 顶和底加载锚点
  const yearPopupContentRef = useRef<HTMLElement | null>(null);
  const wheelBoundRef = useRef<boolean>(false); // wheel 事件是否已经绑定过
  const loadingRef = useRef<boolean>(false); // 顶和底加载共用的守卫
  const wheelDeltaRef = useRef<number>(0); // 向上超过阈值才触发（控制触控板灵敏度）

  function resetLoadState(resetDom = false) {
    scrollAnchorRef.current = 'default';
    loadingRef.current = false;
    wheelDeltaRef.current = 0;
    anchorRef.current = null;
    if (resetDom) {
      // 弹层关闭，重置 DOM 和事件绑定引用
      yearPopupContentRef.current = null;
      wheelBoundRef.current = false;
    }
  }

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
            options.push({
              label: `${i} - ${end}`,
              value: i + 9,
              disabled: false,
            });
          }
        }
      } else {
        // 中心年份（仅在可选范围内时加入）
        yearHasAnyAllowed(year) && options.push({ label: `${year}`, value: year, disabled: false });

        for (let i = 1; i <= 10; i++) {
          yearHasAnyAllowed(year + i) &&
            options.push({
              label: `${year + i}`,
              value: year + i,
              disabled: false,
            });
          yearHasAnyAllowed(year - i) &&
            options.unshift({
              label: `${year - i}`,
              value: year - i,
              disabled: false,
            });
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

  const canLoadTop = useMemo(() => {
    const options = yearOptions;
    if (!options.length) return false;
    const first = options[0].value;
    return canLoadMoreTop(first);
  }, [canLoadMoreTop, yearOptions]);

  const canLoadBottom = useMemo(() => {
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
          decadeHasAnyAllowed(i) &&
            options.unshift({
              label: `${i - 9} - ${i}`,
              value: i,
              disabled: false,
            });
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

  function loadMore(direction: 'top' | 'bottom') {
    if (loadingRef.current) return;
    if (direction === 'top' && !canLoadTop) return;
    if (direction === 'bottom' && !canLoadBottom) return;

    const options =
      direction === 'top'
        ? loadMoreYear(yearOptions[0]?.value, 'reduce')
        : loadMoreYear(yearOptions[yearOptions.length - 1]?.value, 'add');
    if (!options.length) return;

    // 记录锚点，采用 scrollHeight 差值
    // 不依赖 DOM 节点，直接用容器高度变化量补偿
    const contentEl = yearPopupContentRef.current;
    if (contentEl) {
      anchorRef.current = {
        direction,
        scrollHeight: contentEl.scrollHeight,
        scrollTop: contentEl.scrollTop,
      };
    } else {
      anchorRef.current = null;
    }

    loadingRef.current = true;
    scrollAnchorRef.current = direction;
    setYearOptions((prev) => (direction === 'top' ? [...options, ...prev] : [...prev, ...options]));
  }

  function triggerLoadTop() {
    loadMore('top');
  }

  function handlePanelTopClick() {
    triggerLoadTop();
  }

  function handlePanelBottomClick(e?: React.MouseEvent) {
    e?.stopPropagation?.();
    e?.nativeEvent?.stopImmediatePropagation();
    loadMore('bottom');
  }

  // 首次拿到弹层内容容器时绑定 wheel 事件
  // (scrollTop=0 后继续上滚不再触发 scroll，需 wheel 兜底)
  function bindWheel(target: HTMLElement) {
    if (wheelBoundRef.current || !target) return;
    wheelBoundRef.current = true;
    target.addEventListener(
      'wheel',
      (ev: WheelEvent) => {
        const el = yearPopupContentRef.current;
        if (!el || el.scrollTop > 0) {
          // 离开顶部时重置累积，确保下次到顶需要重新积累
          wheelDeltaRef.current = 0;
          return;
        }
        if (ev.deltaY < 0) {
          wheelDeltaRef.current += Math.abs(ev.deltaY);
          if (wheelDeltaRef.current >= 50) {
            wheelDeltaRef.current = 0;
            handleTopRef.current?.();
          }
        } else {
          wheelDeltaRef.current = 0;
        }
      },
      { passive: true },
    );
  }

  // 滚动顶部底部自动加载
  function handleScroll({ e }) {
    const target = e.target as HTMLElement;
    yearPopupContentRef.current = target;
    bindWheel(target);
    // 触底加载
    if (Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <= 1) {
      loadMore('bottom');
    }
  }

  function handleUpdateScrollTop(content: HTMLElement) {
    // 首次打开弹层时，将选中项滚动到可视区域
    const firstSelectedNode: HTMLDivElement = content?.querySelector(`.${classPrefix}-is-selected`);
    if (!firstSelectedNode) return;
    const { paddingBottom } = getComputedStyle(firstSelectedNode);
    const { marginBottom } = getComputedStyle(content);
    const elementBottomHeight = parseInt(paddingBottom, 10) + parseInt(marginBottom, 10);
    const updateValue =
      firstSelectedNode.offsetTop -
      content.offsetTop -
      (content.clientHeight - firstSelectedNode.clientHeight) +
      elementBottomHeight;
    content.scrollTop = updateValue;
  }

  useEffect(() => {
    const yearRange = initOptions(year);
    // year 切换时重置加载相关状态，避免 anchor 残留
    resetLoadState();
    setYearOptions(yearRange);
  }, [initOptions, year]);

  useLayoutEffect(() => {
    const contentEl = yearPopupContentRef.current;
    const anchor = scrollAnchorRef.current;
    if (anchor !== 'top' && anchor !== 'bottom') return;

    if (!contentEl || !anchorRef.current) {
      resetLoadState();
      return;
    }

    // Select 通过 Portal 渲染，useLayoutEffect 触发时 Popup 里的子 DOM 尚未更新，
    // scrollHeight 仍是旧值。使用 ResizeObserver 精确监听内容尺寸变化，避免 rAF 轮询猜测。
    const oldScrollHeight = anchorRef.current.scrollHeight;
    const oldScrollTop = anchorRef.current.scrollTop;

    const ro = new ResizeObserver(() => {
      const newScrollHeight = contentEl.scrollHeight;
      if (newScrollHeight <= oldScrollHeight) return; // DOM 尚未更新，等待下一次触发
      const heightDelta = newScrollHeight - oldScrollHeight;
      // prepend：将新增内容的高度差补偿到 scrollTop，保持用户视口不变
      // append：保持用户当前 scrollTop 不变
      contentEl.scrollTop = anchor === 'top' ? oldScrollTop + heightDelta : oldScrollTop;
      resetLoadState();
      ro.disconnect();
    });

    const target = (contentEl.firstElementChild as Element) || contentEl;
    ro.observe(target);

    return () => ro.disconnect();
  }, [yearOptions]);

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
          keyboardCircular={false}
          onKeyboardReachTop={handleTopRef.current}
          onKeyboardReachBottom={handlePanelBottomClick}
          onChange={(val) => onYearChange(val)}
          onPopupVisibleChange={(visible) => {
            if (!visible) resetLoadState(true);
          }}
          popupProps={{
            onScroll: handleScroll,
            updateScrollTop: (el) => {
              // updateScrollTop 传入的是内层 .t-select__dropdown-inner，但真正的滚动容器是外层 .t-popup__content
              // 需要向上查找到实际带 overflow 的祖先节点，否则 scrollTop 写在不滚动的元素上会失效
              const scrollEl = (el?.closest(`.${classPrefix}-popup__content`) as HTMLElement) || el;
              yearPopupContentRef.current = scrollEl;
              bindWheel(scrollEl);
              setTimeout(() => {
                handleUpdateScrollTop(el);
              }, 0);
            },
            attach: (triggerElement: HTMLElement) => triggerElement.parentNode as HTMLElement,
            overlayClassName: `${headerClassName}-controller-year-popup`,
          }}
        />
      </div>

      <PaginationMini tips={labelMap[mode]} size="small" disabled={paginationDisabled} onChange={onJumperClick} />
    </div>
  );
};

DatePickerHeader.displayName = 'DatePickerHeader';

export default React.memo(DatePickerHeader);
