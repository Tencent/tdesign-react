import React, { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import {
  ChevronLeftIcon,
  EllipsisIcon,
  ChevronLeftDoubleIcon,
  ChevronRightIcon,
  ChevronRightDoubleIcon,
} from '@tencent/tdesign-icons-react';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import Select from '../select';
import { useLocaleReceiver } from '../locale/LocalReceiver';

import { TdPaginationProps } from '../_type/components/pagination';
import { StyledProps } from '../_type/StyledProps';
import { pageSizeValidator } from './validators';

export type { PageInfo } from '../_type/components/pagination';

export interface PaginationProps extends TdPaginationProps, StyledProps {}

const { Option } = Select;

enum KeyCode {
  ENTER = 13,
}

const Pagination: React.FC<PaginationProps> = (props: PaginationProps) => {
  const {
    defaultCurrent = 1,
    current: currentFromProps,
    theme = 'default',
    size = 'medium',
    total = 0,
    defaultPageSize = 10,
    pageSize: pageSizeFromProps,
    showJumper = false,
    disabled = false,
    foldedMaxPageBtn = 5,
    maxPageBtn = 10,
    totalContent = true,
    pageSizeOptions = [5, 10, 20, 50],
    onChange = noop,
    onCurrentChange,
    onPageSizeChange,
  } = props;

  const [locale, t] = useLocaleReceiver('pagination');

  const [pageSize, setPageSize] = useDefault(pageSizeFromProps, defaultPageSize, onPageSizeChange);
  const [current, setCurrent] = useDefault(currentFromProps, defaultCurrent, onCurrentChange);

  const [pageCount, setPageCount] = useState(1);
  const [hoverPreMore, toggleHoverPreMore] = useState(false); // 处理left ellipsis展示逻辑
  const [hoverNextMore, toggleHoverNextMore] = useState(false); // 处理right ellipsis展示逻辑
  const simpleInputRef = useRef<HTMLInputElement>(null);

  const min = 1;
  const pivot = Math.ceil((foldedMaxPageBtn - 1) / 2);
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-pagination`; // t-pagination

  useEffect(() => {
    const calCount = Math.ceil(total / pageSize);
    setPageCount(calCount > 0 ? calCount : 1);
  }, [pageSize, total]);

  // 计算pageList的逻辑，用memo避免每次重复计算的消耗
  const pageList = useMemo<Array<number>>(() => {
    const isPrevMoreShow = 2 + pivot < current;
    const isNextMoreShow = pageCount - 1 - pivot > current;
    const array: Array<number> = [];
    let start: number;
    let end: number;

    if (pageCount > maxPageBtn) {
      if (isPrevMoreShow && isNextMoreShow) {
        start = current - pivot;
        end = current + pivot;
      } else {
        start = isPrevMoreShow ? pageCount - foldedMaxPageBtn + 1 : 2;
        end = isPrevMoreShow ? pageCount - 1 : foldedMaxPageBtn;
      }
    } else {
      start = 1;
      end = pageCount;
    }

    for (let i = start; i <= end; i++) {
      array.push(i);
    }
    return array;
  }, [current, pageCount, foldedMaxPageBtn, maxPageBtn, pivot]);

  // 处理改变当前页的逻辑
  const changeCurrent = (nextCurrent: number, nextPageSize?: number) => {
    if (!nextPageSize && !pageSizeValidator(nextPageSize)) {
      // eslint-disable-next-line
      nextPageSize =
        pageSize ?? (typeof pageSizeOptions[0] === 'number' ? pageSizeOptions[0] : pageSizeOptions[0]?.value);
    }

    if (disabled) return;
    if (pageCount < nextCurrent) {
      setCurrent(pageCount, { current: pageCount, previous: current, pageSize: nextPageSize });
      return;
    }
    if (nextCurrent < min) {
      setCurrent(min, { current: min, previous: current, pageSize: nextPageSize });

      return;
    }
    setCurrent(nextCurrent, { current: nextCurrent, previous: current, pageSize: nextPageSize });

    if (simpleInputRef.current) {
      simpleInputRef.current.value = String(nextCurrent);
    }
    onChange({
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize,
    });
  };

  // 处理改变pageSize的逻辑
  const changePageSize = (nextPageSize: number) => {
    const nextCurrent = Math.min(current, Math.ceil(total / nextPageSize));
    const pageInfo = {
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize,
    };
    setPageSize(nextPageSize, pageInfo);

    // 改变分页大小也需要触发onChange回调 如果改变分页大小会改变currentPage 则由changeCurrent内去触发onChange 否则需要自己触发
    if (current !== nextCurrent) {
      changeCurrent(nextCurrent, nextPageSize);
    } else {
      onChange(pageInfo);
    }
  };

  // 处理极简版的当前页ga的逻辑
  const onSimpleCurrentChange = (nextCurrent: number) => {
    if (disabled || pageCount < nextCurrent || nextCurrent < min) return;
    setCurrent(nextCurrent, { current: nextCurrent, previous: current, pageSize });
    onChange({
      current: nextCurrent,
      previous: current,
      pageSize,
    });
  };

  const onPageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const value = Number(target.value);
    if (Number.isNaN(value) || value < min) target.value = '';
    else if (value > pageCount) target.value = String(pageCount);

    setCurrent(value, { current: value, previous: current, pageSize });
  };

  const onPageInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== KeyCode.ENTER) return;
    const value = Number((event.target as HTMLInputElement).value);
    if (!Number.isNaN(value)) changeCurrent(value);
  };

  // 渲染total相关逻辑
  const renderTotalContent = () => {
    if (typeof totalContent === 'boolean') {
      return totalContent ? t(locale.total, { total }) : null;
    }
    if (typeof totalContent === 'string') return totalContent;
    if (typeof totalContent === 'function') {
      const start = (current - min) * pageSize;
      const end = Math.min(total, start + pageSize);
      return totalContent(total, [start + min, end]);
    }
  };

  const renderPaginationBtns = () => {
    const isFolded = pageCount > maxPageBtn; // 判断是否为需要折叠

    return (
      <>
        {isFolded && (
          <>
            <li
              key={1}
              className={classNames(`${name}__number`, {
                [`${classPrefix}-is-disabled`]: disabled,
                [`${classPrefix}-is-current`]: current === 1,
              })}
              onClick={() => changeCurrent(1)}
            >
              1
            </li>
            {2 + pivot < current && (
              <li
                className={classNames(`${name}__number`, `${name}__number--more`, {
                  [`${classPrefix}-is-disabled`]: disabled,
                })}
                onMouseOver={() => toggleHoverPreMore(true)}
                onMouseOut={() => toggleHoverPreMore(false)}
                onClick={() => changeCurrent(current - foldedMaxPageBtn)}
              >
                {!hoverPreMore ? <EllipsisIcon /> : <ChevronLeftDoubleIcon />}
              </li>
            )}
          </>
        )}
        {pageList.map((item) => (
          <li
            key={item}
            className={classNames(`${name}__number`, {
              [`${classPrefix}-is-disabled`]: disabled,
              [`${classPrefix}-is-current`]: current === item,
            })}
            onClick={() => changeCurrent(item)}
          >
            {item}
          </li>
        ))}
        {isFolded && (
          <>
            {pageCount - 1 - pivot > current && (
              <li
                className={classNames(`${name}__number`, `${name}__number--more`, {
                  [`${classPrefix}-is-disabled`]: disabled,
                })}
                onMouseOver={() => toggleHoverNextMore(true)}
                onMouseOut={() => toggleHoverNextMore(false)}
                onClick={() => changeCurrent(current + foldedMaxPageBtn)}
              >
                {!hoverNextMore ? <EllipsisIcon /> : <ChevronRightDoubleIcon />}
              </li>
            )}
            <li
              key={pageCount}
              className={classNames(`${name}__number`, {
                [`${classPrefix}-is-disabled`]: disabled,
                [`${classPrefix}-is-current`]: current === pageCount,
              })}
              onClick={() => changeCurrent(pageCount)}
            >
              {pageCount}
            </li>
          </>
        )}
      </>
    );
  };

  return (
    <div
      className={classNames(name, {
        [`${classPrefix}-size-s`]: size === 'small',
      })}
    >
      {totalContent && <div className={`${name}__total`}>{renderTotalContent()}</div>}
      {pageSizeOptions instanceof Array && pageSizeOptions.length ? (
        <div className={`${name}__select`}>
          <Select size={size} value={pageSize} disabled={disabled} onChange={changePageSize}>
            {pageSizeOptions.map(
              // eslint-disable-next-line no-confusing-arrow
              (item) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                typeof item === 'number' ? (
                  <Option key={item} label={t(locale.itemsPerPage, { size: item })} value={item} />
                ) : (
                  <Option key={item.value} label={item.label} value={item.value} />
                ),
            )}
          </Select>
        </div>
      ) : null}
      <div
        className={classNames(`${name}__btn`, `${name}__btn--prev`, {
          [`${classPrefix}-is-disabled`]: disabled || current === min,
        })}
        onClick={() => changeCurrent(current - 1)}
      >
        <ChevronLeftIcon />
      </div>
      {theme === 'default' && <ul className={`${name}__pager`}>{renderPaginationBtns()}</ul>}
      {/* 极简版 */}
      {theme === 'simple' && (
        <div className={`${name}__select`}>
          <Select size={size} value={current} disabled={disabled} onChange={onSimpleCurrentChange}>
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
      )}
      <div
        className={classNames(`${name}__btn`, `${name}__btn--next`, {
          [`${classPrefix}-is-disabled`]: disabled || current === pageCount,
        })}
        onClick={() => changeCurrent(current + 1)}
      >
        <ChevronRightIcon />
      </div>
      {showJumper && (
        <div className={`${name}__jump`}>
          {t(locale.jumpTo)}
          <div className={classNames(`${classPrefix}-input`, { [`${classPrefix}-input__is-disabled`]: disabled })}>
            <input
              className={`${classPrefix}-input__inner`}
              disabled={disabled}
              onChange={onPageInputChange}
              onKeyUp={onPageInputKeyUp}
            />
          </div>
          {t(locale.page)}
        </div>
      )}
    </div>
  );
};

export default Pagination;
