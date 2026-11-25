:: BASE_DOC ::

## API

### DropdownMenu Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
closeOnClickOverlay | Boolean | true | \- | N
direction | String | down | options: down/up | N
duration | String / Number | 200 | \- | N
showOverlay | Boolean | true | \- | N
zIndex | Number | - | \- | N


### DropdownItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
disabled | Boolean | false | \- | N
footer | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
icon | TNode | undefined | Typescript: `TNode \| TNode[] \| undefined`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
keepLabelActive | Boolean | false | `1.0.1` | N
keys | Object | - | Typescript: `KeysType`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
label | String | - | \- | N
multiple | Boolean | false | \- | N
options | Array | [] | Typescript: `Array<DropdownOption>` `interface DropdownOption { label: string; disabled?: boolean; value: DropdownValue; }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dropdown-menu/type.ts) | N
optionsColumns | String / Number | 1 | \- | N
placement | String | left | options: left/right | N
value | String / Number / Array | undefined | Typescript: `DropdownValue ` `type DropdownValue = string \| number \| Array<DropdownValue>;`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dropdown-menu/type.ts) | N
defaultValue | String / Number / Array | undefined | uncontrolled property。Typescript: `DropdownValue ` `type DropdownValue = string \| number \| Array<DropdownValue>;`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dropdown-menu/type.ts) | N
onChange | Function |  | Typescript: `(value: DropdownValue) => void`<br/> | N
onClose | Function |  | Typescript: `() => void`<br/>`0.21.2` | N
onClosed | Function |  | Typescript: `() => void`<br/>`0.21.2` | N
onConfirm | Function |  | Typescript: `(value: DropdownValue) => void`<br/> | N
onOpen | Function |  | Typescript: `() => void`<br/>`0.21.2` | N
onOpened | Function |  | Typescript: `() => void`<br/>`0.21.2` | N
onReset | Function |  | Typescript: `(value: DropdownValue) => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-dropdown-menu-active-color | @brand-color | -
--td-dropdown-menu-background | @bg-color-container | -
--td-dropdown-menu-color | @text-color-primary | -
--td-dropdown-menu-disabled-color | @text-color-disabled | -
--td-dropdown-menu-font | @font-body-medium | -
--td-dropdown-menu-icon-size | 24px | -
--td-dropdown-body-max-height | 280px | -
--td-dropdown-menu-bg-color | @bg-color-container | -
