:: BASE_DOC ::

## API

### Navbar Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
animation | Boolean | true | \- | N
capsule | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
fixed | Boolean | true | \- | N
left | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
leftArrow | Boolean | false | \- | N
placeholder | Boolean | false | `0.21.1` | N
right | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
safeAreaInsetTop | Boolean | true | \- | N
title | TNode | - | page title。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
titleMaxLength | Number | - | \- | N
visible | Boolean | true | \- | N
zIndex | Number | 1 | `0.21.1` | N
onLeftClick | Function |  | Typescript: `() => void`<br/> | N
onRightClick | Function |  | Typescript: `() => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-navbar-right | 95px | -
--td-navbar-bg-color | @bg-color-container | -
--td-navbar-capsule-border-color | #e3e6ea | -
--td-navbar-capsule-border-radius | 16px | -
--td-navbar-capsule-height | 32px | -
--td-navbar-capsule-width | 88px | -
--td-navbar-color | @text-color-primary | -
--td-navbar-height | 48px | -
--td-navbar-left-arrow-size | 24px | -
--td-navbar-padding-top | 0 | -
--td-navbar-title-font | @font-title-large | -
