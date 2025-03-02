:: BASE_DOC ::

## API
### Text Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
children | TNode | - | children of text。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
code | Boolean | false | add code style | N
copyable | Boolean / Object | false | add copyable style。Typescript：`boolean \| TypographyCopyable` | N
delete | Boolean | false | add delete line style | N
disabled | Boolean | false | add disabled style | N
ellipsis | Boolean / Object | false | add ellipsis style。Typescript：`boolean \| TypographyEllipsis` | N
italic | Boolean | false | add italic style | N
keyboard | Boolean | false | add keyboard style | N
mark | String / Boolean | false | add mark style | N
strong | Boolean | false | add bold style | N
theme | String | - | theme of text。options: primary/secondary/success/warning/error | N
underline | Boolean | false | add underline style | N

### Title Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
children | TNode | - | children of title。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | content of title。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
ellipsis | Boolean / Object | false | add ellipsis style。Typescript：`boolean \| TypographyEllipsis` | N
level | String | h1 | level of title。options: h1/h2/h3/h4/h5/h6 | N

### Paragraph Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
children | TNode | - | children of paragraph。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | content of paragraph。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
ellipsis | Boolean / Object | false | add ellipsis style。Typescript：`boolean \| TypographyEllipsis` | N

### TypographyEllipsis

name | type | default | description | required
-- | -- | -- | -- | --
collapsible | Boolean | true | collapsible after expanding | N
expandable | Boolean | true | expandable | N
row | Number | 1 | default row number of ellipsis  | N
suffix | TElement | - | custom element configuration for ellipsis and collapse icon。Typescript：`TNode<{ expanded: boolean }>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
tooltipProps | Object | - | Configuration of the tooltip that appears on the ellipsis icon when the cursor is over it.。Typescript：`tooltipProps`，[Tooltip API Documents](./tooltip?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/typography/type.ts) | N
onExpand | Function |  | Typescript：`(expanded:boolean) => void`<br/> | N

### TypographyCopyable

name | type | default | description | required
-- | -- | -- | -- | --
 text | String | - | copied content | N
suffix | TElement | - | custom element configuration for copy icon。Typescript：`TNode<{ copied: boolean }>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
tooltipProps | Object | - | Configuration of the tooltip that appears on the copy icon when the cursor is over it.。Typescript：`tooltipProps`，[Tooltip API Documents](./tooltip?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/typography/type.ts) | N
onCopy | Function |  | Typescript：`() => void`<br/> | N