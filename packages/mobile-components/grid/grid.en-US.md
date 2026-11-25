:: BASE_DOC ::

## API

### Grid Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
align | String | center | options: left/center | N
border | Boolean | false | \- | N
column | Number | 4 | \- | N
gutter | Number | - | \- | N
theme | String | default | options: default/card | N


### GridItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
badge | Object | null | Typescript: `BadgeProps`，[Badge API Documents](./badge?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/grid/type.ts) | N
description | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
image | TNode | - | Typescript: `String \| TNode  \| ImageProps`，[Image API Documents](./image?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/grid/type.ts) | N
layout | String | vertical | options: vertical/horizontal | N
text | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-grid-bg-color | @bg-color-container | -
--td-grid-card-radius | @radius-large | -
--td-grid-item-bg-color | @bg-color-container | -
--td-grid-item-border-color | @component-stroke | -
--td-grid-item-description-color | @text-color-placeholder | -
--td-grid-item-description-font | @font-body-small | -
--td-grid-item-description-padding-top | 4px | -
--td-grid-item-horizontal-padding | 16px 0 | -
--td-grid-item-horizontal-text-description-top | 2px | -
--td-grid-item-horizontal-text-padding-left | 12px | -
--td-grid-item-hover-bg-color | @bg-color-secondarycontainer | -
--td-grid-item-image-bg-color | @bg-color-secondarycontainer | -
--td-grid-item-image-border-radius | @radius-default | -
--td-grid-item-image-middle-width | 40px | -
--td-grid-item-image-small-width | 32px | -
--td-grid-item-image-width | 48px | -
--td-grid-item-text-color | @text-color-primary | -
--td-grid-item-text-font | @font-body-medium | -
--td-grid-item-text-middle-font | @font-body-small | -
--td-grid-item-text-padding-top | 8px | -
--td-grid-item-text-small-font | @font-body-extraSmall | -
--td-grid-item-vertical-padding | 16px 0 12px | -
