import { isFunction, get, isObject } from 'lodash-es';
import { getIEVersion } from '@tdesign/common-js/utils/helper';
import {
  BaseTableCellParams,
  CellData,
  RowClassNameParams,
  TableColumnClassName,
  TableRowData,
  TdBaseTableProps,
} from './type';
import { ClassName, HTMLElementAttributes } from '../common';
import { AffixProps } from '../affix';

export function toString(obj: any): string {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

export function debounce<T = any>(fn: Function, delay = 200): () => void {
  let timer: ReturnType<typeof setTimeout>;
  return function newFn(this: T, ...args: Array<any>): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

export interface FormatRowAttributesParams {
  row: TableRowData;
  rowIndex: number;
  type: 'body' | 'foot';
}

// 行属性
export function formatRowAttributes(attributes: TdBaseTableProps['rowAttributes'], params: FormatRowAttributesParams) {
  if (!attributes) return undefined;
  const attrList = attributes instanceof Array ? attributes : [attributes];
  let result: HTMLElementAttributes = {};
  for (let i = 0; i < attrList.length; i++) {
    const attrItem = attrList[i];
    if (!attrItem) continue;
    const attrProperty = isFunction(attrItem) ? attrItem(params) : attrItem;
    result =
      attrProperty instanceof Array ? formatRowAttributes(attrProperty, params) : Object.assign(result, attrProperty);
  }
  return result;
}

// 行类名，['A', 'B']，[() => 'A', () => 'B']
export function formatRowClassNames(
  rowClassNames: TdBaseTableProps['rowClassName'],
  params: RowClassNameParams<TableRowData>,
  rowKey: string,
): ClassName {
  const rowClassList = rowClassNames instanceof Array ? rowClassNames : [rowClassNames];
  const { row, rowIndex } = params;
  // 自定义行类名
  let customClasses: ClassName = [];
  for (let i = 0, len = rowClassList.length; i < len; i++) {
    const rName = rowClassList[i];
    let tClass = isFunction(rName) ? rName(params) : rName;
    if (isObject(tClass) && !(tClass instanceof Array)) {
      // 根据下标设置行类名
      tClass[rowIndex] && (tClass = tClass[rowIndex]);
      // 根据行唯一标识设置行类名
      const rowId = get(row, rowKey || 'id');
      tClass[rowId] && (tClass = tClass[rowId]);
    } else if (tClass instanceof Array) {
      tClass = formatRowClassNames(tClass, params, rowKey);
    }
    customClasses = customClasses.concat(tClass);
  }
  return customClasses;
}

export function formatClassNames(
  classNames: TableColumnClassName<TableRowData> | TableColumnClassName<TableRowData>[],
  params: CellData<TableRowData> | BaseTableCellParams<TableRowData>,
) {
  const classes = classNames instanceof Array ? classNames : [classNames];
  const arr: any[] = [];
  for (let i = 0, len = classes.length; i < len; i++) {
    const cls = classes[i];
    if (isFunction(cls)) {
      arr.push(cls(params as CellData<TableRowData>));
    } else {
      arr.push(cls);
    }
  }
  return arr;
}

export const INNER_PRE_NAME = '@@inner-';

// 多级表头，列配置场景，获取 currentRow
export function getCurrentRowByKey<T extends { colKey?: string; children?: any[] }>(columns: T[], key: string): T {
  if (!columns || !key) return;
  const col = columns?.find((t) => t.colKey === key);
  if (col) return col;
  for (let i = 0, len = columns.length; i < len; i++) {
    if (columns[i]?.children?.length) {
      return getCurrentRowByKey(columns[i]?.children, key);
    }
  }
}

/** 透传 Affix 组件全部特性 */
export function getAffixProps(mainAffixProps: boolean | Partial<AffixProps>, subAffixProps?: Partial<AffixProps>) {
  if (typeof mainAffixProps === 'object') return mainAffixProps;
  if (typeof subAffixProps === 'object') return subAffixProps;
  return {};
}

// 判断是否小于 ie11 版本 或者没有 ResizeObserver 对象
export const isLessThanIE11OrNotHaveResizeObserver = () =>
  typeof window === 'undefined' || getIEVersion() < 11 || typeof window.ResizeObserver === 'undefined';

/**
 * IE 11 版本以上或者支持 ResizeObserver API 的浏览器中，
 * 使用 ResizeObserver API 来监听元素的尺寸变化
 *
 * 注意：建议 callback 使用前经过 useDebounce 包裹
 *
 * @param tableElement - 要监听的表格元素
 * @param callback - 尺寸变化时调用的回调函数
 */
export const resizeObserverElement = (tableElement: HTMLDivElement, callback: () => void) => {
  if (isLessThanIE11OrNotHaveResizeObserver()) return;
  const resizeObserver = new window.ResizeObserver(() => {
    // 注意：这里的回调会比较频繁，建议 callback 使用前经过 useDebounce 包裹
    callback?.();
  });
  resizeObserver.observe(tableElement);
  return () => {
    resizeObserver?.unobserve?.(tableElement);
    resizeObserver?.disconnect?.();
  };
};
