import React, { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { isFunction } from 'lodash';

import { ChevronLeftIcon, MoreIcon, ChevronRightIcon } from '../icon';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import Select from '../select';

import { TdPaginationProps } from '../_type/components/pagination';
import { StyledProps } from '../_type/StyledProps';
import { pageSizeValidator, pageSizeOptionsValidator } from './validators';

export type { PageInfo } from '../_type/components/pagination';

export interface PaginationProps extends TdPaginationProps, StyledProps {}

const { Option } = Select;

enum KEY_CODE {
  ENTER = 13,
}

const Pagination: React.FC<PaginationProps> = (props: PaginationProps) => {
  const {
    current: currentFromProps = 1,
    theme = 'default',
    size = 'medium',
    total = 0,
    pageSize: pageSizeFromProps = 10,
    showJumper = false,
    disabled = false,
    foldedMaxPageBtn = 5,
    maxPageBtn = 10,
    totalContent = '',
    pageSizeOptions = [5, 10, 20, 50],
    onChange = noop,
    onCurrentChange = noop,
    onPageSizeChange = noop,
  } = props;

  const [current, setCurrent] = useState(currentFromProps);
  const [pageSize, setPageSize] = useState(pageSizeFromProps);

  const simpleInputRef = useRef<HTMLInputElement>(null);

  const { classPrefix } = useConfig();

  useEffect(() => setCurrent(currentFromProps), [currentFromProps]);
  useEffect(() => setPageSize(pageSizeFromProps), [pageSizeFromProps]);

  const name = `${classPrefix}-pagination`; // t-pagination
  const min = 1;
  const max = Math.max(Math.ceil(total / pageSize), 1);

  const pageList = useMemo<(string | number)[]>(() => {
    const gap = 2;
    const list = [] as (string | number)[];
    /**
     * @author kenzyyang
     * @date 2021-03-29
     * @desc :todo 此处逻辑需要做优化,应该可以不使用此种方式进行循环判断，避免死循环
     **/
    /* eslint operator-linebreak: ["error", "after"] */
    for (let i = min; i <= max; i += 1) {
      if (
        i === min ||
        i === max ||
        (current - gap <= i && i <= current + gap) ||
        (current - min < 2 * gap && i - min <= 2 * gap) ||
        (max - current < 2 * gap && max - i <= 2 * gap)
      ) {
        list.push(i);
      } else if (list[list.length - 1] !== '...') {
        list.push('...');
      }
    }

    return list;
  }, [current, min, max]);

  // 处理改变当前页的逻辑
  const changeCurrent = (nextCurrent: number, nextPageSize?: number) => {
    /**
     * @author kenzyyang
     * @date 2021-03-29
     * @desc currentChange 时判断 size 是否合法
     **/
    if (!nextPageSize && !pageSizeValidator(nextPageSize)) {
      if (!pageSizeOptionsValidator(pageSizeOptions)) {
        throw '[pagination]pageSize invalid and pageSizeOption invalid';
      } else {
        // eslint-disable-next-line
        nextPageSize = typeof pageSizeOptions[0] === 'number' ? pageSizeOptions[0] : pageSizeOptions[0]?.value;
      }
    }

    if (disabled || max < nextCurrent || nextCurrent < min) return;
    setCurrent(nextCurrent);
    if (simpleInputRef.current) {
      simpleInputRef.current.value = String(nextCurrent);
    }
    onChange({
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize || pageSize,
    });
    if (isFunction(onCurrentChange)) onCurrentChange();
  };

  // 处理改变pageSize的逻辑
  const changePageSize = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    const nextCurrent = Math.min(current, Math.ceil(total / nextPageSize));
    onPageSizeChange(nextPageSize, {
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize,
    });

    if (current !== nextCurrent) changeCurrent(nextCurrent, nextPageSize);
  };

  // 处理极简版的当前页ga的逻辑
  const onSimpleCurrentChange = (nextCurrent: number) => {
    if (disabled || max < nextCurrent || nextCurrent < min) return;
    setCurrent(nextCurrent);
    onChange({
      current: nextCurrent,
      previous: current,
      pageSize,
    });
  };

  const onPageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const value = Number(target.value);
    if (isNaN(value) || value < min) target.value = '';
    else if (value > max) target.value = String(max);
  };

  const onPageInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== KEY_CODE.ENTER) return;
    const value = Number((event.target as HTMLInputElement).value);
    if (!isNaN(value)) changeCurrent(value);
  };

  // 渲染total相关逻辑
  const renderTotalContent = () => {
    if (!totalContent) return `共 ${total} 项数据`;
    if (typeof totalContent === 'string') return totalContent;
    if (typeof totalContent === 'function') {
      const start: number = (current - min) * pageSize;
      const end: number = Math.min(total, start + pageSize);
      return totalContent(total, [start + min, end]);
    }
    return null;
  };

  if (max === 1) return null;

  return (
    <div
      className={classNames(name, {
        [`${classPrefix}-size-s`]: size === 'small',
      })}
    >
      {totalContent && <div className={`${name}__total`}>{renderTotalContent()}</div>}
      {pageSizeOptions instanceof Array && (
        <div className={`${name}__select`}>
          <Select size={size} value={pageSize} disabled={disabled} onChange={changePageSize}>
            {pageSizeOptions.map((item) =>
              typeof item === 'number' ? (
                <Option key={item} label={`${item}条/页`} value={item} />
              ) : (
                <Option key={item.value} label={item.label} value={item.value} />
              ),
            )}
          </Select>
        </div>
      )}
      <div
        className={classNames(`${name}__btn`, `${name}__btn--prev`, {
          [`${classPrefix}-is-disabled`]: disabled || current === min,
        })}
        onClick={() => changeCurrent(current - 1)}
      >
        <ChevronLeftIcon />
      </div>
      {theme === 'default' && (
        <ul className={`${name}__pager`}>
          {pageList.map((item, index) => {
            if (typeof item === 'number') {
              return (
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
              );
            }
            return (
              <li
                key={item.concat(String(index))}
                className={classNames(`${name}__number`, `${name}__number--more`, {
                  [`${classPrefix}-is-disabled`]: disabled,
                })}
              >
                <MoreIcon />
              </li>
            );
          })}
        </ul>
      )}
      {/* 极简版 */}
      {theme === 'simple' && (
        <div className={`${name}__select`}>
          <Select size={size} value={current} disabled={disabled} onChange={onSimpleCurrentChange}>
            {Array(max)
              .fill(0)
              .map((_, i) => i + 1)
              .map((item) => (
                <Option key={item} label={`${item}/${max}`} value={item}>
                  {item}/{max}
                </Option>
              ))}
          </Select>
        </div>
      )}
      <div
        className={classNames(`${name}__btn`, `${name}__btn--next`, {
          [`${classPrefix}-is-disabled`]: disabled || current === max,
        })}
        onClick={() => changeCurrent(current + 1)}
      >
        <ChevronRightIcon />
      </div>
      {showJumper && (
        <div className={`${name}__jump`}>
          跳转
          <div className={classNames(`${classPrefix}-input`, { [`${classPrefix}-input__is-disabled`]: disabled })}>
            <input
              className={`${classPrefix}-input__inner`}
              disabled={disabled}
              onChange={onPageInputChange}
              onKeyUp={onPageInputKeyUp}
            />
          </div>
          页
        </div>
      )}
    </div>
  );
};

export default Pagination;
