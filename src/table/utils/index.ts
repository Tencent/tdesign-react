import { get, isFunction, isObject } from 'lodash-es';
import type { ReactNode } from 'react';
import {
  BaseTableCellParams,
  BaseTableCol,
  CellData,
  RowClassNameParams,
  TableColumnClassName,
  TableRowData,
  TdBaseTableProps,
  TdPrimaryTableProps,
} from '../type';
import { ClassName, HTMLElementAttributes, TNode } from '../../common';
import { SkipSpansValue } from '../hooks/useRowspanAndColspan';

export function toString(obj: any): string {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

export function debounce<T = any, A extends any[] = any[]>(
  fn: (this: T, ...args: A) => void,
  delay = 200,
): (this: T, ...args: A) => void {
  let timer: ReturnType<typeof setTimeout>;
  return function newFn(this: T, ...args: A) {
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
      // TODO: 这里其实是两点原因导致的
      // 1. isObject(tClass) && !(tClass instanceof Array) 直接用 isPlainObject 就可以了吧，或者 tClass && typeof tClass === 'object'
      // 2. lodash-es 类型不全
      // 根据下标设置行类名
      if (tClass[rowIndex]) {
        tClass = tClass[rowIndex];
      }
      // 根据行唯一标识设置行类名
      const rowId = get(row, rowKey || 'id');
      if (tClass[rowId]) {
        tClass = tClass[rowId];
      }
    } else if (tClass instanceof Array) {
      tClass = formatRowClassNames(tClass, params, rowKey);
    }
    customClasses = customClasses.concat(tClass);
  }
  return customClasses;
}

export function formatClassNames(
  classNames: TableColumnClassName<TableRowData> | TableColumnClassName<TableRowData>[],
  params: CellData<TableRowData>,
) {
  const classes = classNames instanceof Array ? classNames : [classNames];
  const arr: any[] = [];
  for (let i = 0, len = classes.length; i < len; i++) {
    const cls = classes[i];
    if (isFunction(cls)) {
      arr.push(cls(params));
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

export interface CellSpanResult {
  /** 单元格的 rowspan 属性 */
  rowspan?: number;
  /** 单元格的 colspan 属性 */
  colspan?: number;
  /** 是否跳过渲染该单元格 */
  skipped: boolean;
}

/**
 * 获取单元格合并状态
 * @param cellKey 单元格唯一标识
 * @param skipSpansMap 合并单元格映射表
 * @returns 合并单元格的结果
 */
export const handleCellSpan = (cellKey: string, skipSpansMap?: Map<string, SkipSpansValue>): CellSpanResult => {
  const result: CellSpanResult = { skipped: false };

  if (!skipSpansMap?.size) return result;

  const spanState = skipSpansMap.get(cellKey);
  if (!spanState) return result;

  if (spanState.rowspan > 1) result.rowspan = spanState.rowspan;
  if (spanState.colspan > 1) result.colspan = spanState.colspan;
  if (spanState.skipped) result.skipped = true;

  return result;
};

/**
 * 判断单元格是否是最后一行（合并单元格场景移除底部边框）
 */
export const isLastRowInSpan = (rowIndex: number, rowspan?: number, totalDataLength?: number): boolean =>
  !!(rowspan && totalDataLength && rowIndex + rowspan === totalDataLength);

/**
 * 判断单元格是否是第一列（合并单元格场景移除左边框）
 * 在合并单元格场景下，所有行的第一列都应该移除左边框
 */
export const isFirstColumnInSpan = (colIndex: number): boolean => colIndex === 0;

/**
 * 是否启用行拖拽
 */
export const enableRowDrag = (dragSort: TdPrimaryTableProps['dragSort']) => {
  if (!dragSort) return false;
  const validType = ['row', 'row-handler', 'row-handler-col'];
  return validType.includes(dragSort);
};

// ------- 超出省略（ellipsis / ellipsisTitle） -------

export interface EllipsisResult {
  /** 是否开启超出省略 */
  enabled: boolean;
  /** 浮层展示内容，缺省时回退为单元格/表头完整内容 */
  content?: string | TNode;
  /** 透传给 Popup 组件的属性 */
  props: Record<string, any>;
}

/**
 * 解析 `ellipsis` / `ellipsisTitle` 配置，支持 boolean / Object / { props, content } / Function。
 */
export function resolveEllipsis(value: any, params: Record<string, any>): EllipsisResult {
  const disabled: EllipsisResult = { enabled: false, props: {} };
  const result = isFunction(value) ? value(params) : value;

  if (result === false || result === null || result === undefined) return disabled;
  if (typeof result === 'string') return { enabled: true, content: result, props: {} };
  if (typeof result !== 'object') return { enabled: !!result, props: {} };

  // props 存在则透传，否则将对象整体作为 Popup 属性
  const props: Record<string, any> = result.props && typeof result.props === 'object' ? { ...result.props } : {};
  if (!result.props) {
    Object.keys(result).forEach((key) => {
      if (key !== 'content') props[key] = result[key];
    });
  }

  const content = isFunction(result.content) ? result.content(params) : result.content;
  return { enabled: true, content, props };
}

/** 是否存在列开启了超出省略 */
export function hasEllipsisColumn(columns: BaseTableCol[]): boolean {
  return (columns || []).some((col) => !!col.ellipsis || !!col.ellipsisTitle);
}

/**
 * 计算单元格渲染内容。
 * 优先级：序号列 > col.cell > col.render > get(row, colKey) > cellEmptyContent
 */
export function renderCell(
  params: BaseTableCellParams<TableRowData>,
  cellEmptyContent?: TdBaseTableProps['cellEmptyContent'],
): ReactNode {
  const { col, row, rowIndex } = params;
  if (col.colKey === 'serial-number') {
    return rowIndex + 1;
  }
  if (isFunction(col.cell)) {
    return col.cell(params);
  }
  if (isFunction(col.render)) {
    return col.render({ ...params, type: 'cell' });
  }
  const r = get(row, col.colKey);
  // 0 和 false 是正常值，不走空值兜底
  if (![undefined, '', null].includes(r)) return r;
  if (cellEmptyContent) {
    return isFunction(cellEmptyContent) ? cellEmptyContent(params) : cellEmptyContent;
  }
  return r;
}
