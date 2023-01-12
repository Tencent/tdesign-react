:: BASE_DOC ::

## API
### Dropdown Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
direction | String | right | options：left/right | N
disabled | Boolean | false | \- | N
hideAfterItemClick | Boolean | true | \- | N
maxColumnWidth | String / Number | 100 | \- | N
maxHeight | Number | 300 | \- | N
minColumnWidth | String / Number | 10 | \- | N
options | Array | [] | Typescript：`Array<DropdownOption>` `type DropdownOption = { children?: Array<TdDropdownItemProps> } & TdDropdownItemProps & Record<string, any>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/dropdown/type.ts) | N
placement | String | bottom-left | options：top/left/right/bottom/top-left/top-right/bottom-left/bottom-right/left-top/left-bottom/right-top/right-bottom | N
popupProps | Object | - | Typescript：`PopupProps`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/dropdown/type.ts) | N
trigger | String | hover | options：hover/click/focus/context-menu | N
onClick | Function |  | Typescript：`(dropdownItem: DropdownOption, context: { e: MouseEvent }) => void`<br/> | N

### DropdownItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
active | Boolean | false | \- | N
content | TNode | '' | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | false | \- | N
divider | Boolean | false | \- | N
prefixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
theme | String | default | options：default/success/warning/error。Typescript：`DropdownItemTheme` `type DropdownItemTheme = 'default' \| 'success' \| 'warning' \| 'error'`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/dropdown/type.ts) | N
value | String / Number / Object | - | Typescript：`string \| number \| { [key: string]: any }` | N
onClick | Function |  | Typescript：`(dropdownItem: DropdownOption, context: { e: MouseEvent }) => void`<br/> | N
