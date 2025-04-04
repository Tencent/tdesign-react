:: BASE_DOC ::

## API
### Pagination Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
current | Number | 1 | \- | N
defaultCurrent | Number | 1 | uncontrolled property | N
disabled | Boolean | - | \- | N
foldedMaxPageBtn | Number | 5 | \- | N
maxPageBtn | Number | 10 | \- | N
pageEllipsisMode | String | mid | options：mid/both-ends | N
pageSize | Number | 10 | each page count | N
defaultPageSize | Number | 10 | each page count。uncontrolled property | N
pageSizeOptions | Array | [5, 10, 20, 50] | Typescript：`Array<number \| { label: string; value: number }>` | N
selectProps | Object | - | Typescript：`SelectProps`，[Select API Documents](./select?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/pagination/type.ts) | N
showFirstAndLastPageBtn | Boolean | false | \- | N
showJumper | Boolean | false | \- | N
showPageNumber | Boolean | true | \- | N
showPageSize | Boolean | true | \- | N
showPreviousAndNextBtn | Boolean | true | \- | N
size | String | medium | options：small/medium | N
theme | String | default | options：default/simple | N
total | Number | 0 | \- | N
totalContent | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
onChange | Function |  | Typescript：`(pageInfo: PageInfo) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/pagination/type.ts)。<br/>`interface PageInfo { current: number; previous: number; pageSize: number }`<br/> | N
onCurrentChange | Function |  | Typescript：`(current: number, pageInfo: PageInfo) => void`<br/> | N
onPageSizeChange | Function |  | Typescript：`(pageSize: number, pageInfo: PageInfo) => void`<br/> | N

### PaginationMini Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
disabled | Boolean / Object | - | Typescript：`boolean \| JumperDisabledConfig` `type JumperDisabledConfig = { prev?: boolean; current?: boolean; next?: boolean; }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/pagination/type.ts) | N
layout | String | horizontal | horizontal or vertical。options：horizontal/vertical | N
showCurrent | Boolean | true | Typescript：`boolean` | N
size | String | medium | Button size。options：small/medium/large。Typescript：`SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
tips | Object | - | Typescript：`boolean \| JumperTipsConfig` `type JumperTipsConfig = { prev?: string; current?: string; next?: string; }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/pagination/type.ts) | N
variant | String | text | options：text/outline | N
onChange | Function |  | Typescript：`(context: {e: MouseEvent, trigger: JumperTrigger}) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/pagination/type.ts)。<br/>`type JumperTrigger = 'prev' \| 'current' \| 'next'`<br/> | N
