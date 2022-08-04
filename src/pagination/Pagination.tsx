import React, { useState, useMemo, forwardRef } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import noop from '../_util/noop';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import Select from '../select';
import InputNumber from '../input-number';
import { useLocaleReceiver } from '../locale/LocalReceiver';

import useBoundaryJumper from './hooks/useBoundaryJumper';
import usePrevNextJumper from './hooks/usePrevNextJumper';
import usePageNumber from './hooks/usePageNumber';
import useTotal from './hooks/useTotal';

import { TdPaginationProps } from './type';
import { StyledProps } from '../common';
import { pageSizeValidator } from './validators';
import { paginationDefaultProps } from './defaultProps';

export type { PageInfo } from './type';

export interface PaginationProps extends TdPaginationProps, StyledProps {}

const { Option } = Select;

const Pagination = forwardRef((props: PaginationProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    theme,
    size,
    total,
    showPageSize,
    showPageNumber,
    showPreviousAndNextBtn,
    showFirstAndLastPageBtn,
    showJumper,
    pageEllipsisMode,
    disabled,
    foldedMaxPageBtn,
    maxPageBtn,
    totalContent,
    pageSizeOptions,
    onChange = noop,
    onCurrentChange,
    onPageSizeChange,
    style,
    className,
    ...otherProps
  } = props;
  // 原生 html 属性透传
  const restProps = omit(otherProps, ['current', 'pageSize', 'defaultPageSize', 'defaultCurrent']);

  const [locale, t] = useLocaleReceiver('pagination');

  const [pageSize, setPageSize] = useControlled(props, 'pageSize', onPageSizeChange);
  const [current, setCurrent] = useControlled(props, 'current', onCurrentChange);
  const [jumpValue, setJumpValue] = useState(current);

  const min = 1;
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-pagination`; // t-pagination

  const pageCount = useMemo<number>(() => {
    const calCount = Math.ceil(total / pageSize);
    return calCount > 0 ? calCount : 1;
  }, [pageSize, total]);

  // 处理改变当前页的逻辑
  const changeCurrent = (_nextCurrent: number, _nextPageSize?: number) => {
    if (disabled) return;

    let nextCurrent = _nextCurrent;
    let nextPageSize = _nextPageSize;

    if (!nextPageSize && !pageSizeValidator(nextPageSize)) {
      nextPageSize =
        pageSize ?? (typeof pageSizeOptions[0] === 'number' ? pageSizeOptions[0] : pageSizeOptions[0]?.value);
    }

    // 边界处理
    if (nextCurrent < min) nextCurrent = min;
    if (nextCurrent > pageCount) nextCurrent = pageCount;

    setCurrent(nextCurrent, { current: nextCurrent, previous: current, pageSize: nextPageSize });
    setJumpValue(nextCurrent);

    onChange({
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize,
    });
  };

  // 处理改变 pageSize 的逻辑
  const changePageSize = (nextPageSize: number) => {
    const nextCurrent = Math.min(current, Math.ceil(total / nextPageSize));
    const pageInfo = {
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize,
    };
    setPageSize(nextPageSize, pageInfo);

    // 改变分页大小也需要触发 onChange 回调 如果改变分页大小会改变 currentPage 则由 changeCurrent 内去触发 onChange 否则需要自己触发
    if (current !== nextCurrent) {
      changeCurrent(nextCurrent, nextPageSize);
    } else {
      onChange(pageInfo);
    }
  };

  // 处理极简版的当前页 ga 的逻辑
  const onSimpleCurrentChange = (nextCurrent: number) => {
    if (disabled || pageCount < nextCurrent || nextCurrent < min) return;
    setCurrent(nextCurrent, { current: nextCurrent, previous: current, pageSize });
    onChange({
      current: nextCurrent,
      previous: current,
      pageSize,
    });
  };

  const { totalContrl } = useTotal({ totalContent, pageSize, current, total });

  const { firstPageJumper, lastPageJumper } = useBoundaryJumper({
    disabled,
    current,
    pageCount,
    showFirstAndLastPageBtn,
    changeCurrent,
  });

  const { prevJumper, nextJumper } = usePrevNextJumper({
    disabled,
    current,
    pageCount,
    showPreviousAndNextBtn,
    changeCurrent,
  });

  const { pageNumberContrl } = usePageNumber({
    showPageNumber,
    maxPageBtn,
    disabled,
    current,
    pageCount,
    foldedMaxPageBtn,
    changeCurrent,
    pageEllipsisMode,
  });

  const pageSizeContrl =
    showPageSize && pageSizeOptions.length ? (
      <div className={`${name}__select`}>
        <Select autoWidth={true} size={size} value={pageSize} disabled={disabled} onChange={changePageSize}>
          {pageSizeOptions.map((item) =>
            typeof item === 'number' ? (
              <Option key={item} label={t(locale.itemsPerPage, { size: item })} value={item} />
            ) : (
              <Option key={item.value} label={item.label} value={item.value} />
            ),
          )}
        </Select>
      </div>
    ) : null;

  const simplePageNumberContrl = theme === 'simple' && showPageNumber && (
    <div className={`${name}__select`}>
      <Select autoWidth={true} size={size} value={current} disabled={disabled} onChange={onSimpleCurrentChange}>
        {Array(pageCount)
          .fill(0)
          .map((_, i) => i + 1)
          .map((item) => (
            <Option key={item} label={`${item}/${pageCount}`} value={item}>
              {item}/{pageCount}
            </Option>
          ))}
      </Select>
    </div>
  );

  const Jumper = showJumper && (
    <div className={`${name}__jump`}>
      {t(locale.jumpTo)}
      <InputNumber
        className={`${classPrefix}-pagination__input`}
        min={min}
        size={size}
        theme="normal"
        max={pageCount}
        disabled={disabled}
        value={jumpValue}
        onChange={(val) => setJumpValue(val)}
        onBlur={(val) => changeCurrent(val)}
        onEnter={(val) => changeCurrent(val)}
        placeholder=""
      />
      {t(locale.page)}
    </div>
  );

  return (
    <div
      className={classNames(name, className, {
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-is-disabled`]: disabled,
      })}
      style={style}
      ref={ref}
      {...restProps}
    >
      {/* 总数据 */}
      {totalContrl}
      {/* 分页器 */}
      {pageSizeContrl}
      {/* 首页跳转 */}
      {firstPageJumper}
      {/* 上一页跳转 */}
      {prevJumper}
      {/* 常规版 */}
      {theme === 'default' && pageNumberContrl}
      {/* 极简版 */}
      {theme === 'simple' && simplePageNumberContrl}
      {/* 下一页跳转 */}
      {nextJumper}
      {/* 尾页跳转 */}
      {lastPageJumper}
      {/* 快速跳转 */}
      {Jumper}
    </div>
  );
});

Pagination.displayName = 'Pagination';
Pagination.defaultProps = paginationDefaultProps;

export default Pagination;
