:: BASE_DOC ::

## API

### SideBar Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
children | TNode | - | children。Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
value | String / Number | - | \- | N
defaultValue | String / Number | - | uncontrolled property | N
onChange | Function |  | Typescript: `(value: number \| string) => void`<br/> | N
onClick | Function |  | Typescript: `(value: number \| string, label: string) => void`<br/> | N


### SideBarItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
badgeProps | Object | - | Typescript: `BadgeProps`，[Badge API Documents](./badge?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/side-bar/type.ts) | N
disabled | Boolean | false | \- | N
icon | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
label | String | - | \- | N
value | String / Number | - | \- | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-side-bar-active-color | @brand-color | -
--td-side-bar-bg-color | @bg-color-secondarycontainer | -
--td-side-bar-border-radius | 9px | -
--td-side-bar-color | @text-color-primary | -
--td-side-bar-disabled-color | @text-color-disabled | -
--td-side-bar-font | @font-body-large | -
--td-side-bar-height | 100% | -
--td-side-bar-icon-size | 20px | -
--td-side-bar-item-height | 56px | -
--td-side-bar-item-padding | @spacer-2 | -
--td-side-bar-prefix-bg-color | @bg-color-container | -
--td-side-bar-width | 103px | -
