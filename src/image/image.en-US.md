:: BASE_DOC ::

## API

### Image Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
alt | String | - | \- | N
disabled | Boolean | false | \- | N
error | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
fit | String | fill | options：contain/cover/fill/none/scale-down | N
gallery | Boolean | false | \- | N
lazy | Boolean | false | \- | N
loading | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
overlayContent | TElement | - | overlay on the top of image。Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
overlayTrigger | String | always | options：always/hover | N
placeholder | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
position | String | center | \- | N
shape | String | square | options：circle/round/square | N
src | String | - | \- | N
onError | Function |  | Typescript：`() => void`<br/> | N
onLoad | Function |  | Typescript：`() => void`<br/> | N
