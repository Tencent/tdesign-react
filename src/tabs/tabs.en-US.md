:: BASE_DOC ::

## API

### Tabs Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
action | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
addable | Boolean | false | \- | N
disabled | Boolean | false | \- | N
dragSort | Boolean | false | \- | N
list | Array | - | Typescript：`Array<TdTabPanelProps>` | N
placement | String | top | options：left/top/bottom/right | N
size | String | medium | options：medium/large | N
theme | String | normal | options：normal/card | N
value | String / Number | - | Typescript：`TabValue` `type TabValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tabs/type.ts) | N
defaultValue | String / Number | - | uncontrolled property。Typescript：`TabValue` `type TabValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tabs/type.ts) | N
onAdd | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onChange | Function |  | Typescript：`(value: TabValue) => void`<br/> | N
onDragSort | Function |  | Typescript：`(context: TabsDragSortContext) => void`<br/>trigger on drag sort。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/tabs/type.ts)。<br/>`interface TabsDragSortContext { currentIndex: number; current: TabValue; targetIndex: number; target: TabValue }`<br/> | N
onRemove | Function |  | Typescript：`(options: { value: TabValue; index: number; e: MouseEvent }) => void`<br/> | N

### TabPanel Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
destroyOnHide | Boolean | true | \- | N
disabled | Boolean | false | \- | N
label | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
panel | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
removable | Boolean | false | \- | N
value | String / Number | - | Typescript：`TabValue` | N
onRemove | Function |  | Typescript：`(options: { value: TabValue; e: MouseEvent }) => void`<br/> | N
