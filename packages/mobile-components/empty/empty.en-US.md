:: BASE_DOC ::

## API

### Empty Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
action | TElement | - | action block。Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
description | TNode | - | empty component description。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
icon | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
image | TNode | - | image url, or Image component props, or custom any node you need。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-empty-action-margin-top | @spacer-4 | -
--td-empty-description-color | @text-color-placeholder | -
--td-empty-description-font | @font-body-medium | -
--td-empty-description-margin-top | @spacer-2 | -
--td-empty-icon-color | @text-color-placeholder | -
