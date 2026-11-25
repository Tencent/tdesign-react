:: BASE_DOC ::

## API

### Badge Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
color | String | - | \- | N
content | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
count | TNode | 0 | Typescript: `string \| number \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
dot | Boolean | false | \- | N
maxCount | Number | 99 | \- | N
offset | Array | - | Typescript: `Array<string \| number>` | N
shape | String | circle | options: circle/square/bubble/ribbon/ribbon-right/ribbon-left/triangle-right/triangle-left | N
showZero | Boolean | false | \- | N
size | String | medium | options: medium/large | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-badge-basic-height | 16px | -
--td-badge-basic-padding | 4px | -
--td-badge-basic-width | 16px | -
--td-badge-bg-color | @error-color | -
--td-badge-border-radius | 2px | -
--td-badge-bubble-border-radius | 10px 10px 10px 1px | -
--td-badge-content-text-color | @text-color-primary | -
--td-badge-dot-size | 8px | -
--td-badge-font | @font-mark-extraSmall | -
--td-badge-large-font | @font-mark-small | -
--td-badge-large-height | 20px | -
--td-badge-large-padding | 5px | -
--td-badge-text-color | @text-color-anti | -
