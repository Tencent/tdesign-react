import * as React from 'react';
import { IconFont } from '../icon';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import Select from '../select';

const { Option } = Select;

export interface PaginationProps {
  /**
   * 当前页数
   * @default 1
   */
  current?: number;

  /**
   * 显示模式
   * @default "default"
   */
  theme?: 'default' | 'simple';

  /**
   * 分页组件尺寸
   * @default "default"
   */
  size?: 'default' | 'small';

  /**
   * 数据总数
   * @default 0
   */
  total?: number;

  /**
   * 分页大小
   * @default 10
   */
  pageSize?: number;

  /**
   * 显示分页大小控制器
   * @default false
   */
  showSizer?: boolean;

  /**
   * 显示页面跳转输入框
   * @default false
   */
  showJumper?: boolean;

  /**
   * 显示数据总量和当前数据顺序
   * @default false
   */
  showTotal?: boolean;

  /**
   * 禁用分页功能
   * @default false
   */
  disabled?: boolean;

  /**
   * 使用返回值作为内容，可用于渲染来自列表的已选中数量
   * @default "共xxx项数据"
   */
  totalContent?: string | ((total: number, range: [number, number]) => React.ReactNode);

  /**
   * 只有一页时，是否显示分页
   * @default true
   */
  visibleWithOnePage?: boolean;

  /**
   * 指定每页可以显示多少条
   * @default [5, 10, 20 ,50]
   */
  pageSizeOption?: number[];

  /**
   * 页码变化后的回调，参数是改变后的页码
   * @default noop
   */
  onChange?: (current: number, event: { curr: number; prev: number; pageSize: number }) => void;

  /**
   * 每页条数变化后的回调，参数是改变后每页条数
   * @default noop
   */
  onPageSizeChange?: (pageSize: number, event: { curr: number; prev: number; pageSize: number }) => void;
}

enum KEY_CODE {
  ENTER = 13,
}

const blockName = 'pagination';

const Pagination: React.FC<PaginationProps> = (props: PaginationProps): React.ReactElement => {
  const {
    current: currentFromProps = 1,
    theme = 'default',
    size = 'default',
    total = 0,
    pageSize: pageSizeFromProps = 10,
    showSizer = false,
    showJumper = false,
    showTotal = false,
    disabled = false,
    totalContent = '',
    visibleWithOnePage = true,
    pageSizeOption = [5, 10, 20, 50],
    onChange = noop,
    onPageSizeChange = noop,
  } = props;

  const [current, setCurrent] = React.useState<number>(currentFromProps);
  const [pageSize, setPageSize] = React.useState<number>(pageSizeFromProps);

  const { classPrefix } = useConfig();

  const simpleInputRef = React.useRef<HTMLInputElement>(null);

  const min = React.useMemo<number>(() => 1, []);
  const max = React.useMemo<number>(() => Math.max(Math.ceil(total / pageSize), 1), [total, pageSize]);

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

  const pageList = React.useMemo<(string | number)[]>(() => {
    const gap = 2;
    const list = [] as (string | number)[];
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

  const changeCurrent = React.useCallback(
    (nextCurrent: number, nextPageSize?: number) => {
      if (disabled || max < nextCurrent || nextCurrent < min) return;
      setCurrent(nextCurrent);
      if (simpleInputRef.current) {
        simpleInputRef.current.value = String(nextCurrent);
      }
      onChange(nextCurrent, {
        curr: nextCurrent,
        prev: current,
        pageSize: nextPageSize || pageSize,
      });
    },
    [disabled, min, max, current, pageSize, onChange],
  );

  const changePageSize = React.useCallback(
    (nextPageSize: number) => {
      setPageSize(nextPageSize);
      const nextCurrent = Math.min(current, Math.ceil(total / nextPageSize));
      onPageSizeChange(nextPageSize, {
        curr: nextCurrent,
        prev: current,
        pageSize: nextPageSize,
      });
      if (current !== nextCurrent) changeCurrent(nextCurrent, nextPageSize);
    },
    [total, current, changeCurrent, onPageSizeChange],
  );

  const onPageInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { target } = event;
      const value = Number(target.value);
      if (isNaN(value) || value < min) target.value = '';
      else if (value > max) target.value = String(max);
    },
    [min, max],
  );

  const onPageInputKeyUp = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode !== KEY_CODE.ENTER) return;
      const value = Number((event.target as HTMLInputElement).value);
      if (!isNaN(value)) changeCurrent(value);
    },
    [changeCurrent],
  );

  React.useEffect(() => setCurrent(currentFromProps), [currentFromProps]);
  React.useEffect(() => setPageSize(pageSizeFromProps), [pageSizeFromProps]);

  if (!visibleWithOnePage && max === 1) return null;

  return (
    <div className={prefixCls(blockName, size === 'small' && 'size-s')}>
      {(showTotal || totalContent) && (
        <div className={prefixCls([blockName, 'total'])}>
          {((): React.ReactNode => {
            if (showTotal && !totalContent) return `共 ${total} 项数据`;
            if (typeof totalContent === 'string') return totalContent;
            if (typeof totalContent === 'function') {
              const start: number = (current - min) * pageSize;
              const end: number = Math.min(total, start + pageSize);
              return totalContent(total, [start + min, end]);
            }
            return null;
          })()}
        </div>
      )}
      {showSizer && pageSizeOption instanceof Array && (
        <div className={prefixCls([blockName, 'select'])}>
          <Select value={pageSize} disabled={disabled} onChange={changePageSize}>
            {pageSizeOption.map((item) => (
              <Option key={item} label={`${item}条/页`} value={item}>
                {item}条/页
              </Option>
            ))}
          </Select>
        </div>
      )}
      <div
        className={prefixCls(
          [blockName, 'btn'],
          [blockName, 'btn', 'prev'],
          (disabled || current === min) && 'is-disabled',
        )}
        onClick={() => changeCurrent(current - 1)}
      >
        <IconFont name="chevron-left" />
      </div>
      {theme === 'default' && (
        <ul className={prefixCls([blockName, 'pager'])}>
          {pageList.map((item, index) => {
            if (typeof item === 'number') {
              return (
                <li
                  key={item}
                  className={prefixCls(
                    [blockName, 'number'],
                    current === item && 'is-current',
                    disabled && 'is-disabled',
                  )}
                  onClick={() => changeCurrent(item)}
                >
                  {item}
                </li>
              );
            }
            return (
              <li
                key={item.concat(String(index))}
                className={prefixCls([blockName, 'number'], [blockName, 'number', 'more'], disabled && 'is-disabled')}
              >
                <IconFont name="more" />
              </li>
            );
          })}
        </ul>
      )}
      {theme === 'simple' && (
        <div className={prefixCls('input', disabled && 'is-disabled')}>
          <input
            ref={simpleInputRef}
            className={prefixCls(['input', 'inner'])}
            disabled={disabled}
            defaultValue={current}
            onChange={onPageInputChange}
            onKeyUp={onPageInputKeyUp}
          />
        </div>
      )}
      <div
        className={prefixCls(
          [blockName, 'btn'],
          [blockName, 'btn', 'next'],
          (disabled || current === max) && 'is-disabled',
        )}
        onClick={() => changeCurrent(current + 1)}
      >
        <IconFont name="chevron-right" />
      </div>
      {showJumper && (
        <div className={prefixCls([blockName, 'jump'])}>
          跳转
          <div className={prefixCls('input', disabled && 'is-disabled')}>
            <input
              className={prefixCls(['input', 'inner'])}
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
