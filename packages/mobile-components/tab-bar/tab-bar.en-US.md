:: BASE_DOC ::

## API

### TabBar Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
bordered | Boolean | true | \- | N
children | TNode | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
fixed | Boolean | true | \- | N
placeholder | Boolean | false | `0.21.1` | N
safeAreaInsetBottom | Boolean | true | \- | N
shape | String | normal | options: normal/round | N
split | Boolean | true | \- | N
theme | String | normal | options: normal/tag | N
value | String / Number / Array | - | Typescript: `string \| number \| Array<string \| number>` | N
defaultValue | String / Number / Array | - | uncontrolled property。Typescript: `string \| number \| Array<string \| number>` | N
zIndex | Number | 1 | `0.21.1` | N
onChange | Function |  | Typescript: `(context: { value: string \| number }) => void`<br/> | N


### TabBarItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
badgeProps | Object | - | Typescript: `BadgeProps`，[Badge API Documents](./badge?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/tab-bar/type.ts) | N
children | TNode | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
icon | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
subTabBar | Array | - | Typescript: `SubTabBarItem[] ` `interface SubTabBarItem { value: string; label: string }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/tab-bar/type.ts) | N
value | String / Number | - | \- | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-tab-bar-bg-color | @bg-color-container | -
--td-tab-bar-border-color | @border-color | -
--td-tab-bar-round-shadow | @shadow-3 | -
--td-tab-bar-active-bg | @brand-color-light | -
--td-tab-bar-active-color | @brand-color | -
--td-tab-bar-color | @text-color-primary | -
--td-tab-bar-height | 40px | -
--td-tab-bar-hover-bg-color | rgba(0, 0, 0, 0.05) | -
--td-tab-bar-spread-border-color | @border-color | -
--td-tab-bar-spread-shadow | @shadow-3 | -
