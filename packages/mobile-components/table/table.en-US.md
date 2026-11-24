:: BASE_DOC ::

## API

### BaseTable Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
bordered | Boolean | false | show table bordered | N
cellEmptyContent | TNode | - | Typescript: `string \| TNode<BaseTableCellParams<T>>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
columns | Array | [] | table column configs。Typescript: `Array<BaseTableCol<T>>` | N
data | Array | [] | table data。Typescript: `Array<T>` | N
empty | TNode | '' | empty text or empty element。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
fixedRows | Array | - | `0.16.0`。Typescript: `Array<number>` | N
footerSummary | TNode | - | footer summary content。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
height | String / Number | - | table height | N
loading | TNode | undefined | loading state table。Typescript: `boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
loadingMode | String | pull-refresh | `0.23.2`。Data Loading Mode。options: pull-refresh/pagination | N
loadingProps | Object | - | Typescript: `Partial<LoadingProps>`，[Loading API Documents](./loading?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
maxHeight | String / Number | - | table max height | N
pagination | Object | - | `0.23.2`。you can use all props of pagination component with paginationProps。Typescript: `PaginationProps` `interface PaginationProps { current?: number; defaultCurrent?: number; disabled?: boolean; foldedMaxPageBtn?: number; maxPageBtn?: number; pageEllipsisMode?: 'mid' \| 'both-ends'; pageSize?: number; defaultPageSize?: number; pageSizeOptions?: Array<number \| { label: string; value: number }>; showFirstAndLastPageBtn?: boolean; showJumper?: boolean; showPageNumber?: boolean; showPageSize?: boolean; showPreviousAndNextBtn?: boolean; size?: 'small' \| 'medium'; theme?: 'default' \| 'simple'; total?: number; totalContent?: TNode; onChange?: (pageInfo: PageInfo) => void; onCurrentChange?: (current: number, pageInfo: PageInfo) => void; onPageSizeChange?: (pageSize: number, pageInfo: PageInfo) => void; }` `interface PageInfo { current: number; previous: number; pageSize: number }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
rowAttributes | Object / Array / Function | - | `0.17.0`。`tr` attributes。Typescript: `TableRowAttributes<T>` `type TableRowAttributes<T> = HTMLElementAttributes \| ((params: { row: T; rowIndex: number; type: 'body' \| 'foot' }) => HTMLElementAttributes) \| Array<TableRowAttributes<T>>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
rowClassName | String / Object / Array / Function | - | `0.17.0`。table `th` classname。Typescript: `ClassName \| ((params: RowClassNameParams<T>) => ClassName)` `interface RowClassNameParams<T> { row: T; rowIndex: number; rowKey?: string; type?: 'body' \| 'foot' }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
rowKey | String | 'id' | required。unique key for each row data | Y
rowspanAndColspan | Function | - | rowspan and colspan。Typescript: `TableRowspanAndColspanFunc<T>` `type TableRowspanAndColspanFunc<T extends TableRowData = TableRowData> = (params: BaseTableCellParams<T>) => RowspanColspan` `interface RowspanColspan { colspan?: number; rowspan?: number }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
showHeader | Boolean | true | show table header | N
stripe | Boolean | false | show stripe style | N
tableContentWidth | String | - | \- | N
tableLayout | String | fixed | table-layout css properties, [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout). set value to be `fixed` on `resizable=true` please。options: auto/fixed | N
verticalAlign | String | middle | vertical align。options: top/middle/bottom | N
onCellClick | Function |  | Typescript: `(context: BaseTableCellEventContext<T>) => void`<br/>trigger on cell clicked。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface BaseTableCellEventContext<T extends TableRowData = TableRowData> { row: T; col: BaseTableCol<T>; rowIndex: number; colIndex: number; e: MouseEvent }`<br/> | N
onPageChange | Function |  | Typescript: `(pageInfo: PageInfo, newDataSource: Array<T>) => void`<br/>trigger on pagination changing | N
onRowClick | Function |  | Typescript: `(context: RowEventContext<T>) => void`<br/>trigger on row click。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface RowEventContext<T extends TableRowData = TableRowData> { row: T; index: number; e: MouseEvent }`<br/> | N
onScroll | Function |  | Typescript: `(params: { e: UIEvent }) => void`<br/>trigger on table content scroll | N

### BaseTableInstanceFunctions 组件实例方法

name | params | return | description
-- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
refreshTable | \- | \- | required

### BaseTableCol

name | type | default | description | required
-- | -- | -- | -- | --
align | String | left | align type。options: left/right/center | N
cell | String / Function | - | use cell to render table cell。Typescript: `string \| TNode<BaseTableCellParams<T>>` `interface BaseTableCellParams<T> { row: T; rowIndex: number; col: BaseTableCol<T>; colIndex: number }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
className | String / Object / Array / Function | - | cell classnames。Typescript: `TableColumnClassName<T> \| TableColumnClassName<T>[]` `type TableColumnClassName<T extends TableRowData = TableRowData> = ClassName \| ((context: CellData<T>) => ClassName)` `interface CellData<T extends TableRowData = TableRowData> extends BaseTableCellParams<T> { type: 'th' \| 'td' }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
colKey | String | - | unique key for column | N
ellipsis | TNode | false | ellipsis cell content。Typescript: `boolean \| TNode<BaseTableCellParams<T>> \| PopupProps \| { props: PopupProps; content: TNode<BaseTableCellParams<T>> }`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
ellipsisTitle | TNode | undefinde | ellipsis title content。Typescript: `boolean \| TNode<BaseTableColParams<T>> \| PopupProps \| { props: PopupProps; content: TNode<BaseTableColParams<T>> }` `interface BaseTableColParams<T> { col: BaseTableCol<T>; colIndex: number }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
fixed | String | left | `0.16.0`。fixed current column to left or right。options: left/right | N
minWidth | String / Number | - | add CSS property `min-width` to HTML Element `<col>`，Browsers with [TablesNG](https://docs.google.com/document/d/16PFD1GtMI9Zgwu0jtPaKZJ75Q2wyZ9EZnVbBacOfiNA/preview)  support `minWidth` | N
render | Function | - | `0.21.1`。render function can be used to render cell or head。Typescript: `TNode<BaseTableRenderParams<T>>` `interface BaseTableRenderParams<T> extends BaseTableCellParams<T> { type: RenderType }` `type RenderType = 'cell' \| 'title'`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
title | String / Function | - | th content。Typescript: `string \| TNode \| TNode<{ col: BaseTableCol; colIndex: number }>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
width | String / Number | - | column width | N


### PrimaryTable Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
columns | Array | [] | table column configs。Typescript: `Array<PrimaryTableCol<T>>` | N
displayColumns | Array | - | Typescript: `CheckboxGroupValue` | N
defaultDisplayColumns | Array | - | uncontrolled property。Typescript: `CheckboxGroupValue` | N
dragSort | String | - | dag sort。options: row/row-handler/col/row-handler-col/drag-col | N
dragSortOptions | Object | - | drag sort params。Typescript: `SortableOptions` | N
expandIcon | TNode | true | to show expand icon. expand icon is set in first column。Typescript: `boolean \| TNode<ExpandArrowRenderParams<T>>` `interface ExpandArrowRenderParams<T> { row: T; index: number }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
expandOnRowClick | Boolean | - | expand row on click | N
expandedRow | TNode | - | table expanded row, to show more detail information。Typescript: `TNode<TableExpandedRowParams<T>>` `interface TableExpandedRowParams<T> { row: T; index: number; columns: PrimaryTableCol<T>[] \| BaseTableCol<T>[] }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
expandedRowKeys | Array | [] | expanded row keys, row key value is from data[rowKey]。Typescript: `Array<string \| number>` | N
defaultExpandedRowKeys | Array | [] | expanded row keys, row key value is from data[rowKey]。uncontrolled property。Typescript: `Array<string \| number>` | N
filterIcon | TElement | - | filter icon。Typescript: `TNode<{ col: PrimaryTableCol<T>; colIndex: number }>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
filterRow | TNode | - | filter value。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
filterValue | Object | - | filter value。Typescript: `FilterValue` `type FilterValue = { [key: string]: any }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
defaultFilterValue | Object | - | filter value。uncontrolled property。Typescript: `FilterValue` `type FilterValue = { [key: string]: any }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
hideSortTips | Boolean | - | hide sort tips | N
indeterminateSelectedRowKeys | Array | - | indeterminate selected row keys, row key is from data[rowKey]。Typescript: `Array<string \| number>` | N
multipleSort | Boolean | false | support multiple column fields sort | N
reserveSelectedRowOnPaginate | Boolean | true | Controls whether selected rows are retained across pagination. When enabled, selections persist across all pages, allowing batch operations on multi-page data. If set to `false`, selections are confined to the current page and do not extend to other pages. | N
selectOnRowClick | Boolean | - | select row data on row click | N
selectedRowKeys | Array | [] | selected row keys, row key is from data[rowKey]。Typescript: `Array<string \| number>` | N
defaultSelectedRowKeys | Array | [] | selected row keys, row key is from data[rowKey]。uncontrolled property。Typescript: `Array<string \| number>` | N
showSortColumnBgColor | Boolean | false | column shows sort bg color | N
sort | Object / Array | - | sort configs。Typescript: `TableSort` `type TableSort = SortInfo \| Array<SortInfo>` `interface SortInfo { sortBy: string; descending: boolean }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
defaultSort | Object / Array | - | sort configs。uncontrolled property。Typescript: `TableSort` `type TableSort = SortInfo \| Array<SortInfo>` `interface SortInfo { sortBy: string; descending: boolean }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
sortIcon | TElement | - | sort icon。Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
`Omit<BaseTableProps<T>, 'columns' \| 'onCellClick'>` | \- | - | extends `Omit<BaseTableProps<T>, 'columns' \| 'onCellClick'>` | N
onCellClick | Function |  | Typescript: `(context: PrimaryTableCellEventContext<T>) => void`<br/>trigger on cell clicked。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface PrimaryTableCellEventContext<T> { row: T; col: PrimaryTableCol; rowIndex: number; colIndex: number; e: MouseEvent }`<br/> | N
onChange | Function |  | Typescript: `(data: TableChangeData, context: TableChangeContext<T>) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface TableChangeData { sorter?: TableSort; filter?: FilterValue; pagination?: PaginationProps }`<br/><br/>`interface TableChangeContext<T> { trigger: TableChangeTrigger; currentData?: T[] }`<br/><br/>`type TableChangeTrigger = 'filter' \| 'sorter' \| 'pagination'`<br/> | N
onColumnChange | Function |  | Typescript: `(context: PrimaryTableColumnChange<T>) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface PrimaryTableColumnChange<T> { columns?: CheckboxGroupValue; currentColumn?: PrimaryTableCol<T>; type?: 'check' \| 'uncheck'; e?: ChangeEvent }`<br/> | N
onDataChange | Function |  | Typescript: `(data: Array<T>, context: TableDataChangeContext) => void`<br/>trigger on data changing。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface TableDataChangeContext { trigger: 'sort' }`<br/> | N
onDisplayColumnsChange | Function |  | Typescript: `(value: CheckboxGroupValue) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`import { CheckboxGroupValue } from '@Checkbox'`<br/> | N
onDragSort | Function |  | Typescript: `(context: DragSortContext<T>) => void`<br/>trigger on drag sort。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface DragSortContext<T> { currentIndex: number; current: T; targetIndex: number; target: T; data: T[]; newData: T[]; currentData?: T[]; e: SortableEvent; sort: 'row' \| 'col' }`<br/><br/>`import { SortableEvent, SortableOptions } from 'sortablejs'`<br/> | N
onExpandChange | Function |  | Typescript: `(expandedRowKeys: Array<string \| number>, options: ExpandOptions<T>) => void`<br/>trigger on expand row keys changing。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface ExpandOptions<T> { expandedRowData: Array<T>; currentRowData: T }`<br/> | N
onFilterChange | Function |  | Typescript: `(filterValue: FilterValue, context: TableFilterChangeContext<T>) => void`<br/>trigger on filter value changing。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface TableFilterChangeContext<T> { col?: PrimaryTableCol<T>; trigger: 'filter-change' \| 'confirm' \| 'reset' \| 'clear' }`<br/> | N
onSelectChange | Function |  | Typescript: `(selectedRowKeys: Array<string \| number>, options: SelectOptions<T>) => void`<br/>trigger on select changing。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface SelectOptions<T> { selectedRowData: Array<T>; type: 'uncheck' \| 'check'; currentRowKey?: string; currentRowData?: T }`<br/> | N
onSortChange | Function |  | Typescript: `(sort: TableSort, options: SortOptions<T>) => void`<br/>trigger on sort changing。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts)。<br/>`interface SortOptions<T> { currentDataSource?: Array<T>; col: PrimaryTableCol }`<br/> | N

### PrimaryTableCol

name | type | default | description | required
-- | -- | -- | -- | --
cell | String / Function | - | to render table cell。Typescript: `string \| TNode<PrimaryTableCellParams<T>>` `interface PrimaryTableCellParams<T> { row: T; rowIndex: number; col: PrimaryTableCol<T>; colIndex: number }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
checkProps | Object / Function | - | checkbox or radio component properties。Typescript: `CheckProps<T>` `type CheckProps<T> = CheckboxProps \| RadioProps \| ((options: { row: T; rowIndex: number }) => CheckboxProps \| RadioProps)` `import { CheckboxProps } from '@Checkbox'`，[Radio API Documents](./radio?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
children | Array | - | grouping table head。Typescript: `Array<PrimaryTableCol<T>>` | N
colKey | String | - | unique key for column | N
disabled | Function | - | disable table select action。Typescript: `(options: {row: T; rowIndex: number }) => boolean` | N
filter | Object | - | filter rules config。Typescript: `TableColumnFilter` | N
render | Function | - | to render cell or head。Typescript: `TNode<PrimaryTableRenderParams<T>>` `interface PrimaryTableRenderParams<T> extends PrimaryTableCellParams<T> { type: RenderType }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
sortType | String | all | sort options。options: desc/asc/all。Typescript: `SortType` `type SortType = 'desc' \| 'asc' \| 'all'`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
sorter | Boolean / Function | false | sort configs。Typescript: `boolean \| SorterFun<T>` `type SorterFun<T> = (a: T, b: T) => number`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
title | String / Function | - | to render table head。Typescript: `string \| TNode<{ col: PrimaryTableCol; colIndex: number }>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
type | String | single | row select type。options: single/multiple | N
`Omit<BaseTableCol, 'cell' \| 'title' \| 'render' \| 'children'>` | \- | - | extends `Omit<BaseTableCol, 'cell' \| 'title' \| 'render' \| 'children'>` | N

### TableColumnFilter

name | type | default | description | required
-- | -- | -- | -- | --
attrs | Object | - | html attributes of component。Typescript: `HTMLElementAttributes`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
classNames | String | - | component class names。Typescript: `ClassName`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
component | TElement | - | Typescript: `ComponentType`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
confirmEvents | Array | - | Typescript: `string[]` | N
label | String / Function | - | filter column title text, used to be showed in filter row。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
list | Array | - | Typescript: `Array<OptionData>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
popupProps | Object | - | Typescript: `PopupProps`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
props | Object | - | Typescript: `FilterProps` `type FilterProps = RadioProps \| CheckboxProps \| InputProps \| { [key: string]: any }`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
resetValue | \- | - | Typescript: `any` | N
showConfirmAndReset | Boolean | false | \- | N
style | Object | - | styles of component。Typescript: `Styles`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
type | String | - | Typescript: `FilterType` `type FilterType = 'input' \| 'single' \| 'multiple'`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/table/type.ts) | N
