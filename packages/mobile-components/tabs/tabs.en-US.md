:: BASE_DOC ::

## API

### Tabs Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
animation | Object | - | Typescript: `TabAnimation` `type TabAnimation = { duration: number } & Record<string, any>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/tabs/type.ts) | N
bottomLineMode | String | fixed | options: fixed/auto/full | N
list | Array | - | Typescript: `Array<TdTabPanelProps>` | N
showBottomLine | Boolean | true | \- | N
size | String | medium | options: medium/large | N
spaceEvenly | Boolean | true | \- | N
split | Boolean | true | \- | N
sticky | Boolean | false | \- | N
stickyProps | Object | - | Typescript: `StickyProps`，[Sticky API Documents](./sticky?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/tabs/type.ts) | N
swipeable | Boolean | true | \- | N
theme | String | line | options: line/tag/card | N
value | String / Number | - | Typescript: `TabValue` `type TabValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/tabs/type.ts) | N
defaultValue | String / Number | - | uncontrolled property。Typescript: `TabValue` `type TabValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/tabs/type.ts) | N
onChange | Function |  | Typescript: `(value: TabValue, label: string) => void`<br/> | N
onClick | Function |  | Typescript: `(value: TabValue, label: string) => void`<br/> | N
onScroll | Function |  | Typescript: `(scrollTop: number, isFixed: boolean) => void`<br/> | N


### TabPanel Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
badgeProps | Object | - | \- | N
destroyOnHide | Boolean | true | \- | N
disabled | Boolean | false | \- | N
icon | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
label | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
lazy | Boolean | false | Enable tab lazy loading | N
panel | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
value | String / Number | - | Typescript: `TabValue` | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-tab-border-color | @component-stroke | -
--td-tab-font | @font-body-medium | -
--td-tab-icon-size | 18px | -
--td-tab-item-active-color | @brand-color | -
--td-tab-item-color | @text-color-primary | -
--td-tab-item-disabled-color | @text-color-disabled | -
--td-tab-item-height | 48px | -
--td-tab-item-tag-active-bg | @brand-color-light | -
--td-tab-item-tag-bg | @bg-color-secondarycontainer | -
--td-tab-item-tag-height | 32px | -
--td-tab-item-vertical-height | 54px | -
--td-tab-item-vertical-width | 104px | -
--td-tab-nav-background | @bg-color-container | -
--td-tab-track-color | @brand-color | -
--td-tab-track-radius | 4px | -
--td-tab-track-thickness | 3px | -
--td-tab-track-width | 16px | -
