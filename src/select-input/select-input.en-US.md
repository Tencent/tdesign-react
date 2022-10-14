:: BASE_DOC ::

## API

### SelectInput Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
allowInput | Boolean | false | \- | N
autoWidth | Boolean | false | \- | N
borderless | Boolean | false | \- | N
clearable | Boolean | false | \- | N
collapsedItems | TElement | - | Typescript：`TNode<{ value: SelectInputValue; collapsedTags: SelectInputValue; count: number }>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | - | \- | N
inputProps | Object | - | Typescript：`InputProps`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts) | N
inputValue | String / Number | - | input value。Typescript：`InputValue`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts) | N
defaultInputValue | String / Number | - | input value。uncontrolled property。Typescript：`InputValue`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts) | N
keys | Object | - | Typescript：`SelectInputKeys` `interface SelectInputKeys { label?: string; value?: string; children?: string }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts) | N
label | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
loading | Boolean | false | \- | N
minCollapsedNum | Number | 0 | \- | N
multiple | Boolean | false | \- | N
panel | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
placeholder | String | - | placeholder description | N
popupProps | Object | - | Typescript：`PopupProps`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts) | N
popupVisible | Boolean | undefined | \- | N
readonly | Boolean | false | \- | N
status | String | default | options：default/success/warning/error | N
suffix | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
suffixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
tag | TNode | - | Typescript：`string \| TNode<{ value: string \| number }>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
tagInputProps | Object | - | Typescript：`TagInputProps`，[TagInput API Documents](./tag-input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts) | N
tagProps | Object | - | Typescript：`TagProps`，[Tag API Documents](./tag?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts) | N
tips | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | String / Number / Boolean / Object / Array / Date | - | Typescript：`SelectInputValue` `type SelectInputValue = string \| number \| boolean \| Date \| Object \| Array<any> \| Array<SelectInputValue>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts) | N
valueDisplay | TNode | - | Typescript：`string \| TNode<{ value: SelectInputValue; onClose: (index: number, item?: any) => void }>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
onBlur | Function |  | Typescript：`(value: SelectInputValue, context: SelectInputFocusContext) => void`<br/>trigger on blur | N
onClear | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onEnter | Function |  | Typescript：`(value: SelectInputValue, context: { e: KeyboardEvent; inputValue: InputValue }) => void`<br/> | N
onFocus | Function |  | Typescript：`(value: SelectInputValue, context: SelectInputFocusContext) => void`<br/>trigger on focus。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts)。<br/>`interface SelectInputFocusContext { inputValue: InputValue; tagInputValue?: TagInputValue; e: FocusEvent }`<br/> | N
onInputChange | Function |  | Typescript：`(value: InputValue, context?: SelectInputValueChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts)。<br/>`interface SelectInputValueChangeContext { e?: InputEvent \| MouseEvent \| FocusEvent \| KeyboardEvent; trigger: 'input' \| 'clear' \| 'blur' }`<br/> | N
onMouseenter | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/>trigger on mouseenter | N
onMouseleave | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/>trigger on mouseleave | N
onPaste | Function |  | Typescript：`(context: { e: ClipboardEvent; pasteValue: string }) => void`<br/> | N
onPopupVisibleChange | Function |  | Typescript：`(visible: boolean, context: PopupVisibleChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts)。<br/>`import { PopupVisibleChangeContext } from '@Popup'`<br/> | N
onTagChange | Function |  | Typescript：`(value: SelectInputValue, context: SelectInputChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/select-input/type.ts)。<br/>`type SelectInputChangeContext = TagInputChangeContext`<br/> | N
