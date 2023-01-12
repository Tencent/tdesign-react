:: BASE_DOC ::

## API

### Tag Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
closable | Boolean | false | \- | N
content | TNode | - | Typescript：`string \| number \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | false | \- | N
icon | TElement | undefined | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
maxWidth | String / Number | - | Typescript：`CSSProperties['maxWidth'] \| number` | N
shape | String | square | options：square/round/mark | N
size | String | medium | options：small/medium/large。Typescript：`SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
theme | String | default | options：default/primary/warning/danger/success | N
variant | String | dark | options：dark/light/outline/light-outline | N
onClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onClose | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N

### CheckTag Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
checked | Boolean | undefined | \- | N
defaultChecked | Boolean | undefined | uncontrolled property | N
content | TNode | - | Typescript：`string \| number \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | - | \- | N
size | String | medium | options：small/medium/large。Typescript：`SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
onChange | Function |  | Typescript：`(checked: boolean) => void`<br/> | N
onClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
