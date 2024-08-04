:: BASE_DOC ::

## API
### Collapse Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
borderless | Boolean | false | \- | N
defaultExpandAll | Boolean | false | \- | N
disabled | Boolean | - | \- | N
expandIcon | TNode | true | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
expandIconPlacement | String | left | options：left/right | N
expandMutex | Boolean | false | \- | N
expandOnRowClick | Boolean | true | \- | N
value | Array | [] | Typescript：`CollapseValue` `type CollapseValue = Array<string \| number>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/collapse/type.ts) | N
defaultValue | Array | [] | uncontrolled property。Typescript：`CollapseValue` `type CollapseValue = Array<string \| number>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/collapse/type.ts) | N
onChange | Function |  | Typescript：`(value: CollapseValue, context: { e: MouseEvent }) => void`<br/> | N

### CollapsePanel Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
destroyOnCollapse | Boolean | false | \- | N
disabled | Boolean | undefined | \- | N
expandIcon | TNode | undefined | Typescript：`boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
header | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
headerRightContent | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | String / Number | - | \- | N
