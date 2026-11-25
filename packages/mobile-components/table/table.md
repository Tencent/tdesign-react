:: BASE_DOC ::

## API

### BaseTable Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
bordered | Boolean | false | 是否显示表格边框 | N
cellEmptyContent | TNode | - | 单元格数据为空时呈现的内容。TS 类型：`string \| TNode<BaseTableCellParams<T>>`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
columns | Array | [] | 列配置，泛型 T 指表格数据类型。TS 类型：`Array<BaseTableCol<T>>` | N
data | Array | [] | 数据源，泛型 T 指表格数据类型。TS 类型：`Array<T>` | N
empty | TNode | '' | 空表格呈现样式，支持全局配置 `GlobalConfigProvider`。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
fixedRows | Array | - | `0.16.0`。固定行（冻结行），示例：[M, N]，表示冻结表头 M 行和表尾 N 行。M 和 N 值为 0 时，表示不冻结行。TS 类型：`Array<number>` | N
footerSummary | TNode | - | 表尾总结行。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
height | String / Number | - | 表格高度，超出后会出现滚动条。示例：100,  '30%',  '300'。值为数字类型，会自动加上单位 px。如果不是绝对固定表格高度，建议使用 `maxHeight` | N
loading | TNode | undefined | 加载中状态。值为 `true` 会显示默认加载中样式，可以通过 Function 和 插槽 自定义加载状态呈现内容和样式。值为 `false` 则会取消加载状态。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
loadingMode | String | pull-refresh | `0.23.2`。数据加载模式。可选项：pull-refresh/pagination | N
loadingProps | Object | - | 透传加载组件全部属性。TS 类型：`Partial<LoadingProps>`，[Loading API Documents](./loading?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
maxHeight | String / Number | - | 表格最大高度，超出后会出现滚动条。示例：100, '30%', '300'。值为数字类型，会自动加上单位 px | N
pagination | Object | - | `0.23.2`。分页配置，值为空则不显示。具体 API 参考分页组件。当 `data` 数据长度超过分页大小时，会自动对本地数据 `data` 进行排序，如果不希望对于 `data` 进行排序，可以设置 `disableDataPage = true`。TS 类型：`PaginationProps` `interface PaginationProps { current?: number; defaultCurrent?: number; disabled?: boolean; foldedMaxPageBtn?: number; maxPageBtn?: number; pageEllipsisMode?: 'mid' \| 'both-ends'; pageSize?: number; defaultPageSize?: number; pageSizeOptions?: Array<number \| { label: string; value: number }>; showFirstAndLastPageBtn?: boolean; showJumper?: boolean; showPageNumber?: boolean; showPageSize?: boolean; showPreviousAndNextBtn?: boolean; size?: 'small' \| 'medium'; theme?: 'default' \| 'simple'; total?: number; totalContent?: TNode; onChange?: (pageInfo: PageInfo) => void; onCurrentChange?: (current: number, pageInfo: PageInfo) => void; onPageSizeChange?: (pageSize: number, pageInfo: PageInfo) => void; }` `interface PageInfo { current: number; previous: number; pageSize: number }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
rowAttributes | Object / Array / Function | - | `0.17.0`。HTML 标签 `tr` 的属性。类型为 Function 时，参数说明：`params.row` 表示行数据；`params.rowIndex` 表示行下标；`params.type=body` 表示属性作用于 `tbody` 中的元素；`params.type=foot` 表示属性作用于 `tfoot` 中的元素。<br />示例一：{ draggable: true }，<br />示例二：[{ draggable: true }, { title: '超出省略显示' }]。<br /> 示例三：() => [{ draggable: true }]。TS 类型：`TableRowAttributes<T>` `type TableRowAttributes<T> = HTMLElementAttributes \| ((params: { row: T; rowIndex: number; type: 'body' \| 'foot' }) => HTMLElementAttributes) \| Array<TableRowAttributes<T>>`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
rowClassName | String / Object / Array / Function | - | `0.17.0`。行类名，泛型 T 指表格数据类型。`params.row` 表示行数据；`params.rowIndex` 表示行下标；`params.type=body`  表示类名作用于 `tbody` 中的元素；`params.type= tfoot` 表示类名作用于 `tfoot` 中的元素。TS 类型：`ClassName \| ((params: RowClassNameParams<T>) => ClassName)` `interface RowClassNameParams<T> { row: T; rowIndex: number; rowKey?: string; type?: 'body' \| 'foot' }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
rowKey | String | 'id' | 必需。唯一标识一行数据的字段名，来源于 `data` 中的字段。如果是字段嵌套多层，可以设置形如 `item.a.id` 的方法 | Y
rowspanAndColspan | Function | - | 用于自定义合并单元格，泛型 T 指表格数据类型。示例：`({ row, col, rowIndex, colIndex }) => { rowspan: 2, colspan: 3 }`。TS 类型：`TableRowspanAndColspanFunc<T>` `type TableRowspanAndColspanFunc<T extends TableRowData = TableRowData> = (params: BaseTableCellParams<T>) => RowspanColspan` `interface RowspanColspan { colspan?: number; rowspan?: number }`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
showHeader | Boolean | true | 是否显示表头 | N
stripe | Boolean | false | 是否显示斑马纹 | N
tableContentWidth | String | - | 表格内容的总宽度，注意不是表格可见宽度。主要应用于 `table-layout: auto` 模式下的固定列显示。`tableContentWidth` 内容宽度的值必须大于表格可见宽度 | N
tableLayout | String | fixed | 表格布局方式。可选项：auto/fixed | N
verticalAlign | String | middle | 行内容上下方向对齐。可选项：top/middle/bottom | N
onCellClick | Function |  | TS 类型：`(context: BaseTableCellEventContext<T>) => void`<br/>单元格点击时触发。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface BaseTableCellEventContext<T extends TableRowData = TableRowData> { row: T; col: BaseTableCol<T>; rowIndex: number; colIndex: number; e: MouseEvent }`<br/> | N
onPageChange | Function |  | TS 类型：`(pageInfo: PageInfo, newDataSource: Array<T>) => void`<br/>分页发生变化时触发。参数 newDataSource 表示分页后的数据。本地数据进行分页时，newDataSource 和源数据 data 会不一样。泛型 T 指表格数据类型 | N
onRowClick | Function |  | TS 类型：`(context: RowEventContext<T>) => void`<br/>行点击时触发，泛型 T 指表格数据类型。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface RowEventContext<T extends TableRowData = TableRowData> { row: T; index: number; e: MouseEvent }`<br/> | N
onScroll | Function |  | TS 类型：`(params: { e: UIEvent }) => void`<br/>表格内容滚动时触发 | N

### BaseTableInstanceFunctions 组件实例方法

名称 | 参数 | 返回值 | 描述
-- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
refreshTable | \- | \- | 必需。全部重新渲染表格

### BaseTableCol

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
align | String | left | 列横向对齐方式。可选项：left/right/center | N
cell | String / Function | - | 自定义单元格渲染，优先级高于 `render`。泛型 T 指表格数据类型。TS 类型：`string \| TNode<BaseTableCellParams<T>>` `interface BaseTableCellParams<T> { row: T; rowIndex: number; col: BaseTableCol<T>; colIndex: number }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
className | String / Object / Array / Function | - | 列类名，值类型是 Function 使用返回值作为列类名；值类型不为 Function 时，值用于整列类名（含表头）。泛型 T 指表格数据类型。TS 类型：`TableColumnClassName<T> \| TableColumnClassName<T>[]` `type TableColumnClassName<T extends TableRowData = TableRowData> = ClassName \| ((context: CellData<T>) => ClassName)` `interface CellData<T extends TableRowData = TableRowData> extends BaseTableCellParams<T> { type: 'th' \| 'td' }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
colKey | String | - | 渲染列所需字段，值为 `serial-number` 表示当前列为「序号」列 | N
ellipsis | TNode | false | 单元格和表头内容超出时，是否显示省略号。如果仅希望单元格超出省略，可设置 `ellipsisTitle = false`。<br/> 值为 `true`，则超出省略浮层默认显示单元格内容；<br/>值类型为 `Function` 则自定义超出省略浮中层显示的内容。<br/>值类型为 `Object`，则自动透传属性到 Popup 组件，可用于调整弹窗方向等特性。<br/> 同时透传 Popup 属性和自定义浮层内容，请使用 `{ props: { showOverlay: false }, content: () => 'something' }`。<br /> 请注意单元格超出省略的两个基本点：1. 内容元素是内联元素或样式（自定义单元格内容时需特别注意）；2. 内容超出父元素。TS 类型：`boolean \| TNode<BaseTableCellParams<T>> \| PopupProps \| { props: PopupProps; content: TNode<BaseTableCellParams<T>> }`，[Popup API Documents](./popup?tab=api)。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
ellipsisTitle | TNode | undefinde | 表头内容超出时，是否显示省略号。优先级高于 `ellipsis`。<br/>值为 `true`，则超出省略的浮层默认显示表头全部内容；<br/>值类型为 `Function` 用于自定义超出省略浮层显示的表头内容；<br/>值类型为 `Object`，则自动透传属性到 Popup 组件，可用于调整弹窗方向等特性。<br/> 同时透传 Popup 属性和自定义浮层内容，请使用 `{ props: { showOverlay: false }, content: () => 'something' }`。TS 类型：`boolean \| TNode<BaseTableColParams<T>> \| PopupProps \| { props: PopupProps; content: TNode<BaseTableColParams<T>> }` `interface BaseTableColParams<T> { col: BaseTableCol<T>; colIndex: number }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
fixed | String | left | `0.16.0`。固定列显示位置。可选项：left/right | N
minWidth | String / Number | - | 透传 CSS 属性 `min-width` 到 `<col>` 元素。⚠️ 仅少部分浏览器支持，如：使用 [TablesNG](https://docs.google.com/document/d/16PFD1GtMI9Zgwu0jtPaKZJ75Q2wyZ9EZnVbBacOfiNA/preview) 渲染的 Chrome 浏览器支持 `minWidth` | N
render | Function | - | `0.21.1`。自定义表头或单元格，泛型 T 指表格数据类型。TS 类型：`TNode<BaseTableRenderParams<T>>` `interface BaseTableRenderParams<T> extends BaseTableCellParams<T> { type: RenderType }` `type RenderType = 'cell' \| 'title'`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
title | String / Function | - | 自定义表头渲染，优先级高于 render。TS 类型：`string \| TNode \| TNode<{ col: BaseTableCol; colIndex: number }>`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
width | String / Number | - | 列宽，可以作为最小宽度使用。当列宽总和小于 `table` 元素时，浏览器根据宽度设置情况自动分配宽度；当列宽总和大于 `table` 元素，表现为定宽。可以同时调整 `table` 元素的宽度来达到自己想要的效果 | N


### PrimaryTable Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
columns | Array | [] | 列配置，泛型 T 指表格数据类型。TS 类型：`Array<PrimaryTableCol<T>>` | N
displayColumns | Array | - | 列配置功能中，当前显示的列。TS 类型：`CheckboxGroupValue` | N
defaultDisplayColumns | Array | - | 列配置功能中，当前显示的列。非受控属性。TS 类型：`CheckboxGroupValue` | N
dragSort | String | - | 拖拽排序方式，值为 `row` 表示行拖拽排序，这种方式无法进行文本复制，慎用。值为`row-handler` 表示通过拖拽手柄进行行拖拽排序。值为 `col` 表示列顺序拖拽。值为 `row-handler-col` 表示同时支持行拖拽和列拖拽。⚠️`drag-col` 已废弃，请勿使用。可选项：row/row-handler/col/row-handler-col/drag-col | N
dragSortOptions | Object | - | 拖拽排序扩展参数，具体参数见 [Sortable](https://github.com/SortableJS/Sortable)。TS 类型：`SortableOptions` | N
expandIcon | TNode | true | 用于控制是否显示「展开图标列」，值为 `false` 则不会显示。可以精确到某一行是否显示，还可以自定义展开图标内容。`expandedRow` 存在时，该参数有效。支持全局配置 `GlobalConfigProvider`。TS 类型：`boolean \| TNode<ExpandArrowRenderParams<T>>` `interface ExpandArrowRenderParams<T> { row: T; index: number }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
expandOnRowClick | Boolean | - | 是否允许点击行展开 | N
expandedRow | TNode | - | 展开行内容，泛型 T 指表格数据类型。TS 类型：`TNode<TableExpandedRowParams<T>>` `interface TableExpandedRowParams<T> { row: T; index: number; columns: PrimaryTableCol<T>[] \| BaseTableCol<T>[] }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
expandedRowKeys | Array | [] | 展开行。TS 类型：`Array<string \| number>` | N
defaultExpandedRowKeys | Array | [] | 展开行。非受控属性。TS 类型：`Array<string \| number>` | N
filterIcon | TElement | - | 自定义过滤图标，支持全局配置 `GlobalConfigProvider`。TS 类型：`TNode<{ col: PrimaryTableCol<T>; colIndex: number }>`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
filterRow | TNode | - | 自定义过滤状态行及清空筛选等。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
filterValue | Object | - | 过滤数据的值。TS 类型：`FilterValue` `type FilterValue = { [key: string]: any }`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
defaultFilterValue | Object | - | 过滤数据的值。非受控属性。TS 类型：`FilterValue` `type FilterValue = { [key: string]: any }`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
hideSortTips | Boolean | - | 隐藏排序文本提示，支持全局配置 `GlobalConfigProvider`，默认全局配置值为 `false` | N
indeterminateSelectedRowKeys | Array | - | 半选状态行。选中行请更为使用 `selectedRowKeys` 控制。TS 类型：`Array<string \| number>` | N
multipleSort | Boolean | false | 是否支持多列排序 | N
reserveSelectedRowOnPaginate | Boolean | true | 行选中功能，是否在分页时保留上一页选中结果不清空。分页场景下，会全选所有页数据，保留跨分页数据。值为 `false` 则表示全部选中操作停留在当前页，不跨分页。 | N
selectOnRowClick | Boolean | - | 是否在点击整行时选中 | N
selectedRowKeys | Array | [] | 选中行。半选状态行请更为使用 `indeterminateSelectedRowKeys` 控制。TS 类型：`Array<string \| number>` | N
defaultSelectedRowKeys | Array | [] | 选中行。半选状态行请更为使用 `indeterminateSelectedRowKeys` 控制。非受控属性。TS 类型：`Array<string \| number>` | N
showSortColumnBgColor | Boolean | false | 当前排序列是否显示背景色 | N
sort | Object / Array | - | 排序控制。sortBy 排序字段；descending 是否进行降序排列。值为数组时，表示正进行多字段排序。TS 类型：`TableSort` `type TableSort = SortInfo \| Array<SortInfo>` `interface SortInfo { sortBy: string; descending: boolean }`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
defaultSort | Object / Array | - | 排序控制。sortBy 排序字段；descending 是否进行降序排列。值为数组时，表示正进行多字段排序。非受控属性。TS 类型：`TableSort` `type TableSort = SortInfo \| Array<SortInfo>` `interface SortInfo { sortBy: string; descending: boolean }`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
sortIcon | TElement | - | 自定义排序图标，支持全局配置 `GlobalConfigProvider`。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
`Omit<BaseTableProps<T>, 'columns' \| 'onCellClick'>` | \- | - | 继承 `Omit<BaseTableProps<T>, 'columns' \| 'onCellClick'>` 中的全部属性 | N
onCellClick | Function |  | TS 类型：`(context: PrimaryTableCellEventContext<T>) => void`<br/>单元格点击时触发。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface PrimaryTableCellEventContext<T> { row: T; col: PrimaryTableCol; rowIndex: number; colIndex: number; e: MouseEvent }`<br/> | N
onChange | Function |  | TS 类型：`(data: TableChangeData, context: TableChangeContext<T>) => void`<br/>分页、排序、过滤等内容变化时触发，泛型 T 指表格数据类型，`currentData` 表示变化后的数据。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface TableChangeData { sorter?: TableSort; filter?: FilterValue; pagination?: PaginationProps }`<br/><br/>`interface TableChangeContext<T> { trigger: TableChangeTrigger; currentData?: T[] }`<br/><br/>`type TableChangeTrigger = 'filter' \| 'sorter' \| 'pagination'`<br/> | N
onColumnChange | Function |  | TS 类型：`(context: PrimaryTableColumnChange<T>) => void`<br/>确认操作之前列配置发生变化时触发。`context.columns` 表示已选中的列；`context.currentColumn` 表示本次变化操作的列，值不存在表示全选操作；`context.type` 表示当前操作属于选中列或是取消列。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface PrimaryTableColumnChange<T> { columns?: CheckboxGroupValue; currentColumn?: PrimaryTableCol<T>; type?: 'check' \| 'uncheck'; e?: ChangeEvent }`<br/> | N
onDataChange | Function |  | TS 类型：`(data: Array<T>, context: TableDataChangeContext) => void`<br/>本地数据排序导致 `data` 变化时触发，第一个参数指变化后的数据，第二个参数 `context.trigger` 表示触发本次变化的来源。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface TableDataChangeContext { trigger: 'sort' }`<br/> | N
onDisplayColumnsChange | Function |  | TS 类型：`(value: CheckboxGroupValue) => void`<br/>确认列配置时触发。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`import { CheckboxGroupValue } from '@Checkbox'`<br/> | N
onDragSort | Function |  | TS 类型：`(context: DragSortContext<T>) => void`<br/>拖拽排序时触发，`data` 表示排序前的数据，`newData` 表示拖拽排序结束后的新数据，`sort=row` 表示行拖拽事件触发，`sort=col` 表示列拖拽事件触发。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface DragSortContext<T> { currentIndex: number; current: T; targetIndex: number; target: T; data: T[]; newData: T[]; currentData?: T[]; e: SortableEvent; sort: 'row' \| 'col' }`<br/><br/>`import { SortableEvent, SortableOptions } from 'sortablejs'`<br/> | N
onExpandChange | Function |  | TS 类型：`(expandedRowKeys: Array<string \| number>, options: ExpandOptions<T>) => void`<br/>展开行发生变化时触发，泛型 T 指表格数据类型。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface ExpandOptions<T> { expandedRowData: Array<T>; currentRowData: T }`<br/> | N
onFilterChange | Function |  | TS 类型：`(filterValue: FilterValue, context: TableFilterChangeContext<T>) => void`<br/>过滤参数发生变化时触发，泛型 T 指表格数据类型。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface TableFilterChangeContext<T> { col?: PrimaryTableCol<T>; trigger: 'filter-change' \| 'confirm' \| 'reset' \| 'clear' }`<br/> | N
onSelectChange | Function |  | TS 类型：`(selectedRowKeys: Array<string \| number>, options: SelectOptions<T>) => void`<br/>选中行发生变化时触发，泛型 T 指表格数据类型。两个参数，第一个参数为选中行 keys，第二个参数为更多参数，具体如下：`type = uncheck` 表示当前行操作为「取消行选中」；`type = check` 表示当前行操作为「行选中」； `currentRowKey` 表示当前操作行的 rowKey 值； `currentRowData` 表示当前操作行的行数据。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface SelectOptions<T> { selectedRowData: Array<T>; type: 'uncheck' \| 'check'; currentRowKey?: string; currentRowData?: T }`<br/> | N
onSortChange | Function |  | TS 类型：`(sort: TableSort, options: SortOptions<T>) => void`<br/>排序发生变化时触发。其中 sortBy 表示当前排序的字段，sortType 表示排序的方式，currentDataSource 表示 sorter 排序后的结果，col 表示列配置。sort 值类型为数组时表示多字段排序。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface SortOptions<T> { currentDataSource?: Array<T>; col: PrimaryTableCol }`<br/> | N

### PrimaryTableCol

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
cell | String / Function | - | 自定义单元格渲染，优先级高于 render。泛型 T 指表格数据类型。TS 类型：`string \| TNode<PrimaryTableCellParams<T>>` `interface PrimaryTableCellParams<T> { row: T; rowIndex: number; col: PrimaryTableCol<T>; colIndex: number }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
checkProps | Object / Function | - | 透传参数，`colKey` 值为 `row-select` 时，配置有效。具体定义参考 Checkbox 组件 和 Radio 组件。泛型 T 指表格数据类型。TS 类型：`CheckProps<T>` `type CheckProps<T> = CheckboxProps \| RadioProps \| ((options: { row: T; rowIndex: number }) => CheckboxProps \| RadioProps)` `import { CheckboxProps } from '@Checkbox'`，[Radio API Documents](./radio?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
children | Array | - | 用于多级表头，泛型 T 指表格数据类型。TS 类型：`Array<PrimaryTableCol<T>>` | N
colKey | String | - | 渲染列所需字段，必须唯一。值为 `row-select` 表示当前列为行选中操作列。值为 `drag` 表示当前列为拖拽排序操作列。值为 `serial-number` 表示当前列为「序号」列 | N
disabled | Function | - | 是否禁用行选中，`colKey` 值为 `row-select` 时，配置有效。TS 类型：`(options: {row: T; rowIndex: number }) => boolean` | N
filter | Object | - | 过滤规则，支持多选(multiple)、单选(single)、输入框(input) 等三种形式。想要自定义过滤组件，可通过 `filter.component` 实现，自定义过滤组件需要包含参数 value 和事件 change。更多信息请查看当前页面中 `TableColumnFilter` 的详细文档。TS 类型：`TableColumnFilter` | N
render | Function | - | 自定义表头或单元格，泛型 T 指表格数据类型。TS 类型：`TNode<PrimaryTableRenderParams<T>>` `interface PrimaryTableRenderParams<T> extends PrimaryTableCellParams<T> { type: RenderType }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
sortType | String | all | 当前列支持排序的方式，desc 表示当前列只能进行降序排列；asc 表示当前列只能进行升序排列；all 表示当前列既可升序排列，又可以降序排列。可选项：desc/asc/all。TS 类型：`SortType` `type SortType = 'desc' \| 'asc' \| 'all'`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
sorter | Boolean / Function | false | 该列是否支持排序。值为 true 表示该列支持排序；值类型为函数，表示对本地数据 `data` 进行排序，返回值参考 [MDN Array.sort](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)。泛型 T 指表格数据类型。TS 类型：`boolean \| SorterFun<T>` `type SorterFun<T> = (a: T, b: T) => number`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
title | String / Function | - | 自定义表头渲染。值类型为 Function 表示以函数形式渲染表头。值类型为 string 表示使用插槽渲染，插槽名称为 title 的值。优先级高于 render。TS 类型：`string \| TNode<{ col: PrimaryTableCol; colIndex: number }>`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
type | String | single | `colKey` 值为 `row-select` 时表示行选中列，有两种模式：单选和多选。 `type=single` 表示单选，`type=multiple` 表示多选。可选项：single/multiple | N
`Omit<BaseTableCol, 'cell' \| 'title' \| 'render' \| 'children'>` | \- | - | 继承 `Omit<BaseTableCol, 'cell' \| 'title' \| 'render' \| 'children'>` 中的全部属性 | N

### TableColumnFilter

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
attrs | Object | - | 用于透传筛选器属性到自定义组件 `component`，HTML 原生属性。TS 类型：`HTMLElementAttributes`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
classNames | String | - | 透传类名到自定义组件 `component`。TS 类型：`ClassName`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
component | TElement | - | 用于自定义筛选器，只要保证自定义筛选器包含 value 属性 和 change 事件，即可像内置筛选器一样正常使用。示例：`component: DatePicker`。TS 类型：`ComponentType`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
confirmEvents | Array | - | 哪些事件触发后会进行过滤搜索（确认按钮无需配置，会默认触发搜索）。输入框组件示例：`confirmEvents: ['onEnter']`。TS 类型：`string[]` | N
label | String / Function | - | 过滤项标题文本，显示在“过滤结果行”中的列标题描述。一般用于表头标题和过滤文本行中的列标题不一样的场景。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
list | Array | - | 用于配置当前筛选器可选值有哪些，仅当 `filter.type` 等于 `single` 或 `multiple` 时有效。TS 类型：`Array<OptionData>`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
popupProps | Object | - | 透传 Popup 组件全部属性到筛选器浮层。TS 类型：`PopupProps`，[Popup API Documents](./popup?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
props | Object | - | 用于透传筛选器属性到自定义组件 `component`，可以对筛选器进行任何原组件支持的属性配置。TS 类型：`FilterProps` `type FilterProps = RadioProps \| CheckboxProps \| InputProps \| { [key: string]: any }`，[Input API Documents](./input?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
resetValue | \- | - | 重置时设置的值，示例：'' 或 []。TS 类型：`any` | N
showConfirmAndReset | Boolean | false | 是否显示重置和确认。值为真，过滤事件（filter-change）会在确定时触发；值为假，则数据变化时会立即触发过滤事件 | N
style | Object | - | 透传内联样式到自定义组件 `component`。TS 类型：`Styles`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
type | String | - | 用于设置筛选器类型：单选按钮筛选器、复选框筛选器、输入框筛选器。更多复杂组件，请更为使用 `component` 自定义任意组件。TS 类型：`FilterType` `type FilterType = 'input' \| 'single' \| 'multiple'`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
