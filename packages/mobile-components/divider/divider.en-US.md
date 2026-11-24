:: BASE_DOC ::

## API

### Divider Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
align | String | center | options: left/right/center | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
dashed | Boolean | false | \- | N
layout | String | horizontal | options: horizontal/vertical | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-divider-border-width | 1px | -
--td-divider-color | @bg-color-component | -
--td-divider-content-color | @text-color-placeholder | -
--td-divider-content-font | @font-body-small | -
--td-divider-content-line-style | solid | -
--td-divider-content-margin | @spacer-1 | -
--td-divider-horizontal-margin | 10px | -
--td-divider-vertical-margin | @spacer | -
