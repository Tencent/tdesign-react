:: BASE_DOC ::

## API
### RangeInput Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
activeIndex | Number | - | \- | N
clearable | Boolean | false | \- | N
disabled | Boolean | - | \- | N
format | Array / Function | - | Typescript：`InputFormatType \| Array<InputFormatType>` | N
inputProps | Object / Array | - | Typescript：`InputProps \| Array<InputProps>`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts) | N
label | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
placeholder | String / Array | - | Typescript：`string \| Array<string>` | N
prefixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
readonly | Boolean | false | \- | N
separator | TNode | '-' | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
showClearIconOnEmpty | Boolean | false | \- | N
size | String | medium | options：small/medium/large | N
status | String | - | options：default/success/warning/error | N
suffix | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
suffixIcon | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
tips | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | Array | [] | Typescript：`RangeInputValue` `type RangeInputValue = Array<InputValue>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts) | N
defaultValue | Array | [] | uncontrolled property。Typescript：`RangeInputValue` `type RangeInputValue = Array<InputValue>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts) | N
onBlur | Function |  | Typescript：`(value: RangeInputValue, context?: { e?: FocusEvent; position?: RangeInputPosition }) => void`<br/> | N
onChange | Function |  | Typescript：`(value: RangeInputValue, context?: { e?: InputEvent \| MouseEvent; position?: RangeInputPosition; trigger?: 'input' \| 'clear' })    => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts)。<br/>`type RangeInputPosition = 'first' \| 'second' \| 'all'`<br/> | N
onClear | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N
onClick | Function |  | Typescript：`(context?: { e?: MouseEvent; position?: RangeInputPosition }) => void`<br/> | N
onEnter | Function |  | Typescript：`(value: RangeInputValue, context?: { e?: InputEvent \| MouseEvent; position?: RangeInputPosition })  => void`<br/> | N
onFocus | Function |  | Typescript：`(value: RangeInputValue, context?: { e?: FocusEvent; position?: RangeInputPosition }) => void`<br/> | N
onMouseenter | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/>trigger on mouseenter | N
onMouseleave | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/> | N

### RangeInputInstanceFunctions 组件实例方法

name | params | return | description
-- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
blur | `(options?: {position?: RangeInputPosition})` | \- | \-
focus | `(options?: {position?: RangeInputPosition})` | \- | \-
select | `(options?: {position?: RangeInputPosition})` | \- | \-

### RangeInputPopup Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
autoWidth | Boolean | false | \- | N
disabled | Boolean | - | \- | N
inputValue | Array | - | Typescript：`RangeInputValue` | N
defaultInputValue | Array | - | uncontrolled property。Typescript：`RangeInputValue` | N
panel | TElement | - | Typescript：`TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
popupProps | Object | - | Typescript：`PopupProps`，[Popup API Documents](./popup?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts) | N
popupVisible | Boolean | - | \- | N
rangeInputProps | Object | - | Typescript：`RangeInputProps`，[RangeInput API Documents](./range-input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts) | N
readonly | Boolean | false | \- | N
status | String | - | options：default/success/warning/error | N
tips | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
onInputChange | Function |  | Typescript：`(value: RangeInputValue, context?: RangeInputValueChangeContext)  => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts)。<br/>`type RangeInputValueChangeContext = { e?: InputEvent \| MouseEvent; trigger?: 'input' \| 'clear', position?: RangeInputPosition }`<br/> | N
onPopupVisibleChange | Function |  | Typescript：`(visible: boolean, context: PopupVisibleChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts)。<br/>`import { PopupVisibleChangeContext } from '@Popup'`<br/> | N
