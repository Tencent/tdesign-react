/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { LoadingProps } from '../loading';
import { PopupProps } from '../popup';
import { CheckboxGroupValue } from '../checkbox';
import { SortableEvent, SortableOptions } from 'sortablejs';
import { CheckboxProps } from '../checkbox';
import { RadioProps } from '../radio';
import { InputProps } from '../input';
import type { TNode, TElement, OptionData, ClassName, Styles, HTMLElementAttributes, ComponentType } from '../common';
import type { MouseEvent, ChangeEvent, UIEvent } from 'react';

export interface TdBaseTableProps<T extends TableRowData = TableRowData> {
  /**
   * 是否显示表格边框
   * @default false
   */
  bordered?: boolean;
  /**
   * 单元格数据为空时呈现的内容
   */
  cellEmptyContent?: string | TNode<BaseTableCellParams<T>>;
  /**
   * 列配置，泛型 T 指表格数据类型
   * @default []
   */
  columns?: Array<BaseTableCol<T>>;
  /**
   * 数据源，泛型 T 指表格数据类型
   * @default []
   */
  data?: Array<T>;
  /**
   * 空表格呈现样式，支持全局配置 `GlobalConfigProvider`
   * @default ''
   */
  empty?: TNode;
  /**
   * 固定行（冻结行），示例：[M, N]，表示冻结表头 M 行和表尾 N 行。M 和 N 值为 0 时，表示不冻结行
   */
  fixedRows?: Array<number>;
  /**
   * 表尾总结行
   */
  footerSummary?: TNode;
  /**
   * 表格高度，超出后会出现滚动条。示例：100,  '30%',  '300'。值为数字类型，会自动加上单位 px。如果不是绝对固定表格高度，建议使用 `maxHeight`
   */
  height?: string | number;
  /**
   * 加载中状态。值为 `true` 会显示默认加载中样式，可以通过 Function 和 插槽 自定义加载状态呈现内容和样式。值为 `false` 则会取消加载状态
   */
  loading?: TNode;
  /**
   * 数据加载模式
   * @default pull-refresh
   */
  loadingMode?: 'pull-refresh' | 'pagination';
  /**
   * 透传加载组件全部属性
   */
  loadingProps?: Partial<LoadingProps>;
  /**
   * 表格最大高度，超出后会出现滚动条。示例：100, '30%', '300'。值为数字类型，会自动加上单位 px
   */
  maxHeight?: string | number;
  /**
   * 分页配置，值为空则不显示。具体 API 参考分页组件。当 `data` 数据长度超过分页大小时，会自动对本地数据 `data` 进行排序，如果不希望对于 `data` 进行排序，可以设置 `disableDataPage = true`
   */
  pagination?: PaginationProps;
  /**
   * HTML 标签 `tr` 的属性。类型为 Function 时，参数说明：`params.row` 表示行数据；`params.rowIndex` 表示行下标；`params.type=body` 表示属性作用于 `tbody` 中的元素；`params.type=foot` 表示属性作用于 `tfoot` 中的元素。<br />示例一：{ draggable: true }，<br />示例二：[{ draggable: true }, { title: '超出省略显示' }]。<br /> 示例三：() => [{ draggable: true }]
   */
  rowAttributes?: TableRowAttributes<T>;
  /**
   * 行类名，泛型 T 指表格数据类型。`params.row` 表示行数据；`params.rowIndex` 表示行下标；`params.type=body`  表示类名作用于 `tbody` 中的元素；`params.type= tfoot` 表示类名作用于 `tfoot` 中的元素
   */
  rowClassName?: ClassName | ((params: RowClassNameParams<T>) => ClassName);
  /**
   * 唯一标识一行数据的字段名，来源于 `data` 中的字段。如果是字段嵌套多层，可以设置形如 `item.a.id` 的方法
   * @default 'id'
   */
  rowKey: string;
  /**
   * 用于自定义合并单元格，泛型 T 指表格数据类型。示例：`({ row, col, rowIndex, colIndex }) => { rowspan: 2, colspan: 3 }`
   */
  rowspanAndColspan?: TableRowspanAndColspanFunc<T>;
  /**
   * 是否显示表头
   * @default true
   */
  showHeader?: boolean;
  /**
   * 是否显示斑马纹
   * @default false
   */
  stripe?: boolean;
  /**
   * 表格内容的总宽度，注意不是表格可见宽度。主要应用于 `table-layout: auto` 模式下的固定列显示。`tableContentWidth` 内容宽度的值必须大于表格可见宽度
   * @default ''
   */
  tableContentWidth?: string;
  /**
   * 表格布局方式
   * @default fixed
   */
  tableLayout?: 'auto' | 'fixed';
  /**
   * 行内容上下方向对齐
   * @default middle
   */
  verticalAlign?: 'top' | 'middle' | 'bottom';
  /**
   * 单元格点击时触发
   */
  onCellClick?: (context: BaseTableCellEventContext<T>) => void;
  /**
   * 分页发生变化时触发。参数 newDataSource 表示分页后的数据。本地数据进行分页时，newDataSource 和源数据 data 会不一样。泛型 T 指表格数据类型
   */
  onPageChange?: (pageInfo: PageInfo, newDataSource: Array<T>) => void;
  /**
   * 行点击时触发，泛型 T 指表格数据类型
   */
  onRowClick?: (context: RowEventContext<T>) => void;
  /**
   * 表格内容滚动时触发
   */
  onScroll?: (params: { e: UIEvent<HTMLDivElement> }) => void;
}

/** 组件实例方法 */
export interface BaseTableInstanceFunctions<T extends TableRowData = TableRowData> {
  /**
   * 全部重新渲染表格
   */
  refreshTable: () => void;
}

export interface BaseTableCol<T extends TableRowData = TableRowData> {
  /**
   * 列横向对齐方式
   * @default left
   */
  align?: 'left' | 'right' | 'center';
  /**
   * 自定义单元格渲染，优先级高于 `render`。泛型 T 指表格数据类型
   */
  cell?: string | TNode<BaseTableCellParams<T>>;
  /**
   * 列类名，值类型是 Function 使用返回值作为列类名；值类型不为 Function 时，值用于整列类名（含表头）。泛型 T 指表格数据类型
   */
  className?: TableColumnClassName<T> | TableColumnClassName<T>[];
  /**
   * 渲染列所需字段，值为 `serial-number` 表示当前列为「序号」列
   * @default ''
   */
  colKey?: string;
  /**
   * 单元格和表头内容超出时，是否显示省略号。如果仅希望单元格超出省略，可设置 `ellipsisTitle = false`。<br/> 值为 `true`，则超出省略浮层默认显示单元格内容；<br/>值类型为 `Function` 则自定义超出省略浮中层显示的内容。<br/>值类型为 `Object`，则自动透传属性到 Popup 组件，可用于调整弹窗方向等特性。<br/> 同时透传 Popup 属性和自定义浮层内容，请使用 `{ props: { showOverlay: false }, content: () => 'something' }`。<br /> 请注意单元格超出省略的两个基本点：1. 内容元素是内联元素或样式（自定义单元格内容时需特别注意）；2. 内容超出父元素
   * @default false
   */
  ellipsis?:
    | boolean
    | TNode<BaseTableCellParams<T>>
    | (PopupProps & { title?: TNode })
    | { props: PopupProps; content: TNode<BaseTableCellParams<T>>; title?: TNode };
  /**
   * 表头内容超出时，是否显示省略号。优先级高于 `ellipsis`。<br/>值为 `true`，则超出省略的浮层默认显示表头全部内容；<br/>值类型为 `Function` 用于自定义超出省略浮层显示的表头内容；<br/>值类型为 `Object`，则自动透传属性到 Popup 组件，可用于调整弹窗方向等特性。<br/> 同时透传 Popup 属性和自定义浮层内容，请使用 `{ props: { showOverlay: false }, content: () => 'something' }`
   * @default undefinde
   */
  ellipsisTitle?:
    | boolean
    | TNode<BaseTableColParams<T>>
    | (PopupProps & { title?: TNode })
    | { props: PopupProps; content: TNode<BaseTableColParams<T>>; title?: TNode };
  /**
   * 固定列显示位置
   * @default left
   */
  fixed?: 'left' | 'right';
  /**
   * 透传 CSS 属性 `min-width` 到 `<col>` 元素。⚠️ 仅少部分浏览器支持，如：使用 [TablesNG](https://docs.google.com/document/d/16PFD1GtMI9Zgwu0jtPaKZJ75Q2wyZ9EZnVbBacOfiNA/preview) 渲染的 Chrome 浏览器支持 `minWidth`
   */
  minWidth?: string | number;
  /**
   * 自定义表头或单元格，泛型 T 指表格数据类型
   */
  render?: TNode<BaseTableRenderParams<T>>;
  /**
   * 自定义表头渲染，优先级高于 render
   */
  title?: string | TNode | TNode<{ col: BaseTableCol; colIndex: number }>;
  /**
   * 列宽，可以作为最小宽度使用。当列宽总和小于 `table` 元素时，浏览器根据宽度设置情况自动分配宽度；当列宽总和大于 `table` 元素，表现为定宽。可以同时调整 `table` 元素的宽度来达到自己想要的效果
   */
  width?: string | number;
}

export interface TdPrimaryTableProps<T extends TableRowData = TableRowData> extends Omit<
  TdBaseTableProps<T>,
  'columns' | 'onCellClick'
> {
  /**
   * 列配置，泛型 T 指表格数据类型
   * @default []
   */
  columns?: Array<PrimaryTableCol<T>>;
  /**
   * 列配置功能中，当前显示的列
   */
  displayColumns?: CheckboxGroupValue;
  /**
   * 列配置功能中，当前显示的列，非受控属性
   */
  defaultDisplayColumns?: CheckboxGroupValue;
  /**
   * 拖拽排序方式，值为 `row` 表示行拖拽排序，这种方式无法进行文本复制，慎用。值为`row-handler` 表示通过拖拽手柄进行行拖拽排序。值为 `col` 表示列顺序拖拽。值为 `row-handler-col` 表示同时支持行拖拽和列拖拽。⚠️`drag-col` 已废弃，请勿使用
   */
  dragSort?: 'row' | 'row-handler' | 'col' | 'row-handler-col' | 'drag-col';
  /**
   * 拖拽排序扩展参数，具体参数见 [Sortable](https://github.com/SortableJS/Sortable)
   */
  dragSortOptions?: SortableOptions;
  /**
   * 用于控制是否显示「展开图标列」，值为 `false` 则不会显示。可以精确到某一行是否显示，还可以自定义展开图标内容。`expandedRow` 存在时，该参数有效。支持全局配置 `GlobalConfigProvider`
   * @default true
   */
  expandIcon?: boolean | TNode<ExpandArrowRenderParams<T>>;
  /**
   * 是否允许点击行展开
   */
  expandOnRowClick?: boolean;
  /**
   * 展开行内容，泛型 T 指表格数据类型
   */
  expandedRow?: TNode<TableExpandedRowParams<T>>;
  /**
   * 展开行
   * @default []
   */
  expandedRowKeys?: Array<string | number>;
  /**
   * 展开行，非受控属性
   * @default []
   */
  defaultExpandedRowKeys?: Array<string | number>;
  /**
   * 自定义过滤图标，支持全局配置 `GlobalConfigProvider`
   */
  filterIcon?: TNode<{ col: PrimaryTableCol<T>; colIndex: number }>;
  /**
   * 自定义过滤状态行及清空筛选等
   */
  filterRow?: TNode;
  /**
   * 过滤数据的值
   */
  filterValue?: FilterValue;
  /**
   * 过滤数据的值，非受控属性
   */
  defaultFilterValue?: FilterValue;
  /**
   * 隐藏排序文本提示，支持全局配置 `GlobalConfigProvider`，默认全局配置值为 `false`
   */
  hideSortTips?: boolean;
  /**
   * 半选状态行。选中行请更为使用 `selectedRowKeys` 控制
   */
  indeterminateSelectedRowKeys?: Array<string | number>;
  /**
   * 是否支持多列排序
   * @default false
   */
  multipleSort?: boolean;
  /**
   * 行选中功能，是否在分页时保留上一页选中结果不清空。分页场景下，会全选所有页数据，保留跨分页数据。值为 `false` 则表示全部选中操作停留在当前页，不跨分页。
   * @default true
   */
  reserveSelectedRowOnPaginate?: boolean;
  /**
   * 是否在点击整行时选中
   */
  selectOnRowClick?: boolean;
  /**
   * 选中行。半选状态行请更为使用 `indeterminateSelectedRowKeys` 控制
   * @default []
   */
  selectedRowKeys?: Array<string | number>;
  /**
   * 选中行。半选状态行请更为使用 `indeterminateSelectedRowKeys` 控制，非受控属性
   * @default []
   */
  defaultSelectedRowKeys?: Array<string | number>;
  /**
   * 当前排序列是否显示背景色
   * @default false
   */
  showSortColumnBgColor?: boolean;
  /**
   * 排序控制。sortBy 排序字段；descending 是否进行降序排列。值为数组时，表示正进行多字段排序
   */
  sort?: TableSort;
  /**
   * 排序控制。sortBy 排序字段；descending 是否进行降序排列。值为数组时，表示正进行多字段排序，非受控属性
   */
  defaultSort?: TableSort;
  /**
   * 自定义排序图标，支持全局配置 `GlobalConfigProvider`
   */
  sortIcon?: TElement;
  /**
   * 单元格点击时触发
   */
  onCellClick?: (context: PrimaryTableCellEventContext<T>) => void;
  /**
   * 分页、排序、过滤等内容变化时触发，泛型 T 指表格数据类型，`currentData` 表示变化后的数据
   */
  onChange?: (data: TableChangeData, context: TableChangeContext<T>) => void;
  /**
   * 确认操作之前列配置发生变化时触发。`context.columns` 表示已选中的列；`context.currentColumn` 表示本次变化操作的列，值不存在表示全选操作；`context.type` 表示当前操作属于选中列或是取消列
   */
  onColumnChange?: (context: PrimaryTableColumnChange<T>) => void;
  /**
   * 本地数据排序导致 `data` 变化时触发，第一个参数指变化后的数据，第二个参数 `context.trigger` 表示触发本次变化的来源
   */
  onDataChange?: (data: Array<T>, context: TableDataChangeContext) => void;
  /**
   * 确认列配置时触发
   */
  onDisplayColumnsChange?: (value: CheckboxGroupValue) => void;
  /**
   * 拖拽排序时触发，`data` 表示排序前的数据，`newData` 表示拖拽排序结束后的新数据，`sort=row` 表示行拖拽事件触发，`sort=col` 表示列拖拽事件触发
   */
  onDragSort?: (context: DragSortContext<T>) => void;
  /**
   * 展开行发生变化时触发，泛型 T 指表格数据类型
   */
  onExpandChange?: (expandedRowKeys: Array<string | number>, options: ExpandOptions<T>) => void;
  /**
   * 过滤参数发生变化时触发，泛型 T 指表格数据类型
   */
  onFilterChange?: (filterValue: FilterValue, context: TableFilterChangeContext<T>) => void;
  /**
   * 选中行发生变化时触发，泛型 T 指表格数据类型。两个参数，第一个参数为选中行 keys，第二个参数为更多参数，具体如下：`type = uncheck` 表示当前行操作为「取消行选中」；`type = check` 表示当前行操作为「行选中」； `currentRowKey` 表示当前操作行的 rowKey 值； `currentRowData` 表示当前操作行的行数据
   */
  onSelectChange?: (selectedRowKeys: Array<string | number>, options: SelectOptions<T>) => void;
  /**
   * 排序发生变化时触发。其中 sortBy 表示当前排序的字段，sortType 表示排序的方式，currentDataSource 表示 sorter 排序后的结果，col 表示列配置。sort 值类型为数组时表示多字段排序
   */
  onSortChange?: (sort: TableSort, options: SortOptions<T>) => void;
}

export interface PrimaryTableCol<T extends TableRowData = TableRowData> extends Omit<
  BaseTableCol,
  'cell' | 'title' | 'render' | 'children'
> {
  /**
   * 自定义单元格渲染，优先级高于 render。泛型 T 指表格数据类型
   */
  cell?: string | TNode<PrimaryTableCellParams<T>>;
  /**
   * 透传参数，`colKey` 值为 `row-select` 时，配置有效。具体定义参考 Checkbox 组件 和 Radio 组件。泛型 T 指表格数据类型
   */
  checkProps?: CheckProps<T>;
  /**
   * 用于多级表头，泛型 T 指表格数据类型
   */
  children?: Array<PrimaryTableCol<T>>;
  /**
   * 渲染列所需字段，必须唯一。值为 `row-select` 表示当前列为行选中操作列。值为 `drag` 表示当前列为拖拽排序操作列。值为 `serial-number` 表示当前列为「序号」列
   * @default ''
   */
  colKey?: string;
  /**
   * 是否禁用行选中，`colKey` 值为 `row-select` 时，配置有效
   */
  disabled?: (options: { row: T; rowIndex: number }) => boolean;
  /**
   * 过滤规则，支持多选(multiple)、单选(single)、输入框(input) 等三种形式。想要自定义过滤组件，可通过 `filter.component` 实现，自定义过滤组件需要包含参数 value 和事件 change。更多信息请查看当前页面中 `TableColumnFilter` 的详细文档
   */
  filter?: TableColumnFilter;
  /**
   * 自定义表头或单元格，泛型 T 指表格数据类型
   */
  render?: TNode<PrimaryTableRenderParams<T>>;
  /**
   * 当前列支持排序的方式，desc 表示当前列只能进行降序排列；asc 表示当前列只能进行升序排列；all 表示当前列既可升序排列，又可以降序排列
   * @default all
   */
  sortType?: SortType;
  /**
   * 该列是否支持排序。值为 true 表示该列支持排序；值类型为函数，表示对本地数据 `data` 进行排序，返回值参考 [MDN Array.sort](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)。泛型 T 指表格数据类型
   * @default false
   */
  sorter?: boolean | SorterFun<T>;
  /**
   * 自定义表头渲染。值类型为 Function 表示以函数形式渲染表头。值类型为 string 表示使用插槽渲染，插槽名称为 title 的值。优先级高于 render
   */
  title?: string | TNode<{ col: PrimaryTableCol; colIndex: number }>;
  /**
   * `colKey` 值为 `row-select` 时表示行选中列，有两种模式：单选和多选。 `type=single` 表示单选，`type=multiple` 表示多选
   * @default single
   */
  type?: 'single' | 'multiple';
}

export interface TableColumnFilter {
  /**
   * 用于透传筛选器属性到自定义组件 `component`，HTML 原生属性
   */
  attrs?: HTMLElementAttributes;
  /**
   * 透传类名到自定义组件 `component`
   * @default ''
   */
  classNames?: ClassName;
  /**
   * 用于自定义筛选器，只要保证自定义筛选器包含 value 属性 和 change 事件，即可像内置筛选器一样正常使用。示例：`component: DatePicker`
   */
  component?: ComponentType;
  /**
   * 哪些事件触发后会进行过滤搜索（确认按钮无需配置，会默认触发搜索）。输入框组件示例：`confirmEvents: ['onEnter']`
   */
  confirmEvents?: string[];
  /**
   * 过滤项标题文本，显示在“过滤结果行”中的列标题描述。一般用于表头标题和过滤文本行中的列标题不一样的场景
   */
  label?: string | TNode;
  /**
   * 用于配置当前筛选器可选值有哪些，仅当 `filter.type` 等于 `single` 或 `multiple` 时有效
   */
  list?: Array<OptionData>;
  /**
   * 透传 Popup 组件全部属性到筛选器浮层
   */
  popupProps?: PopupProps;
  /**
   * 用于透传筛选器属性到自定义组件 `component`，可以对筛选器进行任何原组件支持的属性配置
   */
  props?: FilterProps;
  /**
   * 重置时设置的值，示例：'' 或 []
   */
  resetValue?: any;
  /**
   * 是否显示重置和确认。值为真，过滤事件（filter-change）会在确定时触发；值为假，则数据变化时会立即触发过滤事件
   * @default false
   */
  showConfirmAndReset?: boolean;
  /**
   * 透传内联样式到自定义组件 `component`
   */
  style?: Styles;
  /**
   * 用于设置筛选器类型：单选按钮筛选器、复选框筛选器、输入框筛选器。更多复杂组件，请更为使用 `component` 自定义任意组件
   * @default ''
   */
  type?: FilterType;
}

export interface PaginationProps {
  current?: number;
  defaultCurrent?: number;
  disabled?: boolean;
  foldedMaxPageBtn?: number;
  maxPageBtn?: number;
  pageEllipsisMode?: 'mid' | 'both-ends';
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: Array<number | { label: string; value: number }>;
  showFirstAndLastPageBtn?: boolean;
  showJumper?: boolean;
  showPageNumber?: boolean;
  showPageSize?: boolean;
  showPreviousAndNextBtn?: boolean;
  size?: 'small' | 'medium';
  theme?: 'default' | 'simple';
  total?: number;
  totalContent?: TNode;
  onChange?: (pageInfo: PageInfo) => void;
  onCurrentChange?: (current: number, pageInfo: PageInfo) => void;
  onPageSizeChange?: (pageSize: number, pageInfo: PageInfo) => void;
}

export interface PageInfo {
  current: number;
  previous: number;
  pageSize: number;
}

export type TableRowAttributes<T> =
  | HTMLElementAttributes
  | ((params: { row: T; rowIndex: number; type: 'body' | 'foot' }) => HTMLElementAttributes)
  | Array<TableRowAttributes<T>>;

export interface RowClassNameParams<T> {
  row: T;
  rowIndex: number;
  rowKey?: string;
  type?: 'body' | 'foot';
}

export type TableRowspanAndColspanFunc<T extends TableRowData = TableRowData> = (
  params: BaseTableCellParams<T>,
) => RowspanColspan;

export interface RowspanColspan {
  colspan?: number;
  rowspan?: number;
}

export interface BaseTableCellEventContext<T extends TableRowData = TableRowData> {
  row: T;
  col: BaseTableCol<T>;
  rowIndex: number;
  colIndex: number;
  e: MouseEvent<HTMLTableCellElement>;
}

export interface RowEventContext<T extends TableRowData = TableRowData> {
  row: T;
  index: number;
  e: MouseEvent<HTMLTableRowElement>;
}

export interface TableRowData {
  [key: string]: any;
  children?: TableRowData[];
}

export interface BaseTableCellParams<T> {
  row: T;
  rowIndex: number;
  col: BaseTableCol<T>;
  colIndex: number;
}

export type TableColumnClassName<T extends TableRowData = TableRowData> =
  ClassName | ((context: CellData<T>) => ClassName);

export interface CellData<T extends TableRowData = TableRowData> extends BaseTableCellParams<T> {
  type: 'th' | 'td';
}

export interface BaseTableColParams<T> {
  col: BaseTableCol<T>;
  colIndex: number;
}

export interface BaseTableRenderParams<T> extends BaseTableCellParams<T> {
  type: RenderType;
}

export type RenderType = 'cell' | 'title';

export type DataType = TableRowData;

export interface ExpandArrowRenderParams<T> {
  row: T;
  index: number;
}

export interface TableExpandedRowParams<T> {
  row: T;
  index: number;
  columns: PrimaryTableCol<T>[] | BaseTableCol<T>[];
}

export type FilterValue = { [key: string]: any };

export type TableSort = SortInfo | Array<SortInfo>;

export interface SortInfo {
  sortBy: string;
  descending: boolean;
}

export interface PrimaryTableCellEventContext<T> {
  row: T;
  col: PrimaryTableCol;
  rowIndex: number;
  colIndex: number;
  e: MouseEvent<HTMLDivElement>;
}

export interface TableChangeData {
  sorter?: TableSort;
  filter?: FilterValue;
  pagination?: PaginationProps;
}

export interface TableChangeContext<T> {
  trigger: TableChangeTrigger;
  currentData?: T[];
}

export type TableChangeTrigger = 'filter' | 'sorter' | 'pagination';

export interface PrimaryTableColumnChange<T> {
  columns?: CheckboxGroupValue;
  currentColumn?: PrimaryTableCol<T>;
  type?: 'check' | 'uncheck';
  e?: ChangeEvent<HTMLDivElement>;
}

export interface TableDataChangeContext {
  trigger: 'sort';
}

export interface DragSortContext<T> {
  currentIndex: number;
  current: T;
  targetIndex: number;
  target: T;
  data: T[];
  newData: T[];
  currentData?: T[];
  e: SortableEvent;
  sort: 'row' | 'col';
}

export interface ExpandOptions<T> {
  expandedRowData: Array<T>;
  currentRowData: T;
}

export interface TableFilterChangeContext<T> {
  col?: PrimaryTableCol<T>;
  trigger: 'filter-change' | 'confirm' | 'reset' | 'clear';
}

export interface SelectOptions<T> {
  selectedRowData: Array<T>;
  type: 'uncheck' | 'check';
  currentRowKey?: string;
  currentRowData?: T;
}

export interface SortOptions<T> {
  currentDataSource?: Array<T>;
  col: PrimaryTableCol;
}

export interface PrimaryTableCellParams<T> {
  row: T;
  rowIndex: number;
  col: PrimaryTableCol<T>;
  colIndex: number;
}

export type CheckProps<T> =
  CheckboxProps | RadioProps | ((options: { row: T; rowIndex: number }) => CheckboxProps | RadioProps);

export interface PrimaryTableRenderParams<T> extends PrimaryTableCellParams<T> {
  type: RenderType;
}

export type SortType = 'desc' | 'asc' | 'all';

export type SorterFun<T> = (a: T, b: T) => number;

export type FilterProps = RadioProps | CheckboxProps | InputProps | { [key: string]: any };

export type FilterType = 'input' | 'single' | 'multiple';
