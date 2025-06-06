:: BASE_DOC ::

## API

### Descriptions Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript：`React.CSSProperties` | N
bordered | Boolean | false | set description list with grey border | N
colon | Boolean | - | set label with ":" on the right | N
column | Number | 2 | count of DescriptionsItem in one row | N
contentStyle | Object | - | style of description content。Typescript：`Styles`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
itemLayout | String | horizontal | layout direction of description item。options: horizontal/vertical | N
items | Array | - | list of descriptions items。Typescript：`Array<TdDescriptionsItemProps>` | N
labelStyle | Object | - | style of description item, which takes effect when `tableLayout` is `auto`。Typescript：`Styles`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
layout | String | horizontal | layout direction。options: horizontal/vertical | N
size | String | medium | a descriptions has three size。options: small/medium/large。Typescript：`SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
tableLayout | String | auto | Sets the algorithm used to layout `table` cells, rows, and columns, exactly the same as the native table-layout css property. `fixed`: uses fixed layout algorithm; `auto`: uses automatic layout algorithm. For more details, see [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout)。options: fixed/auto | N
title | TNode | - | title of descriptions。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N


### DescriptionsItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript：`React.CSSProperties` | N
content | TNode | - | content of description item。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
label | TNode | - | label of description item。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
span | Number | 1 | width count | N
