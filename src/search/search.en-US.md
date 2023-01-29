:: BASE_DOC ::

## API

### Search Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
autoWidth | Boolean | false | \- | N
autocompleteOptions | Array | - | autocomplete words list。Typescript：`Array<AutocompleteOption>` `type AutocompleteOption = string \| { label: string \| TNode; group?: boolean }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/search/type.ts) | N
autofocus | Boolean | false | auto focus as default | N
borderless | Boolean | true | \- | N
clearable | Boolean | true | \- | N
disabled | Boolean | - | \- | N
filter | Function | - | Typescript：`(keyword: string, option: any) => boolean \| Promise<boolean>` | N
inputProps | Object | - | Typescript：`InputProps`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/search/type.ts) | N
label | TNode | '' | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
multiline | Boolean | false | \- | N
placeholder | String | '' | \- | N
popupProps | Object | - | Typescript：`PopupProps`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/search/type.ts) | N
prefixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
readonly | Boolean | false | \- | N
selectInputProps | Object | - | Typescript：`SelectInputProps`，[SelectInput API Documents](./select-input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/search/type.ts) | N
suffix | TNode | '' | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
suffixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
textareaProps | Object | - | Typescript：`TextareaProps`，[Textarea API Documents](./textarea?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/search/type.ts) | N
value | String | - | \- | N
defaultValue | String | - | uncontrolled property | N
onBlur | Function |  | Typescript：`(context: { value: string; e: FocusEvent }) => void`<br/> | N
onChange | Function |  | Typescript：`(value: string, context: { trigger: 'input-change' \| 'option-click'; e?: InputEvent \| MouseEvent }) => void`<br/> | N
onClear | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onEnter | Function |  | Typescript：`(context: { value: string; e: KeyboardEvent }) => void`<br/> | N
onFocus | Function |  | Typescript：`(context: { value: string; e: FocusEvent }) => void`<br/> | N
onSearch | Function |  | Typescript：`(context?: { value: string; trigger: 'enter' \| 'option-click' \| 'clear' \| 'suffix-click' \| 'prefix-click'; e?: InputEvent \| MouseEvent }) => void`<br/> | N
