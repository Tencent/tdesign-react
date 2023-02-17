:: BASE_DOC ::

## API
### Timeline Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
labelAlign | String | left | label info placement。options：left/right/alternate/top/bottom | N
layout | String | vertical | time line layout。options：horizontal/vertical | N
mode | String | alternate | The position relationship between the label and the content text, 'alternate' is displayed on both sides of the axis, and 'same' is displayed on the same side。options：alternate/same | N
reverse | Boolean | false | \- | N
theme | String | default | options：default/dot | N

### TimelineItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
dot | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
dotColor | String | primary | Typescript：`string` | N
label | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
labelAlign | String | - | options：left/right/top/bottom | N
loading | Boolean | - | Whether it is in the loading state | N
