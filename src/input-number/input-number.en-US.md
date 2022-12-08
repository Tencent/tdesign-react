:: BASE_DOC ::

## API
### InputNumber Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
align | String | - | options：left/center/right | N
allowInputOverLimit | Boolean | true | \- | N
autoWidth | Boolean | false | \- | N
decimalPlaces | Number | undefined | \- | N
disabled | Boolean | - | \- | N
format | Function | - | Typescript：`(value: InputNumberValue, context?: { fixedNumber?: InputNumberValue }) => InputNumberValue` | N
inputProps | Object | - | Typescript：`InputProps`，[Input API Documents](./input?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/input-number/type.ts) | N
label | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
largeNumber | Boolean | false | \- | N
max | String / Number | Infinity | Typescript：`InputNumberValue` | N
min | String / Number | -Infinity | Typescript：`InputNumberValue` | N
placeholder | String | undefined | \- | N
readonly | Boolean | false | \- | N
size | String | medium | options：small/medium/large | N
status | String | default | options：default/success/warning/error | N
step | String / Number | 1 | Typescript：`InputNumberValue` | N
suffix | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
theme | String | row | options：column/row/normal | N
tips | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | String / Number | - | Typescript：`T` `type InputNumberValue = number \| string`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/input-number/type.ts) | N
defaultValue | String / Number | - | uncontrolled property。Typescript：`T` `type InputNumberValue = number \| string`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/input-number/type.ts) | N
onBlur | Function |  | Typescript：`(value: InputNumberValue, context: { e: FocusEvent }) => void`<br/> | N
onChange | Function |  | Typescript：`(value: T, context: ChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/input-number/type.ts)。<br/>`interface ChangeContext { type: ChangeSource; e: InputEvent \| MouseEvent \| FocusEvent \| KeyboardEvent }`<br/><br/>`type ChangeSource = 'add' \| 'reduce' \| 'input' \| 'blur' \| 'enter' \| 'clear'`<br/> | N
onEnter | Function |  | Typescript：`(value: InputNumberValue, context: { e: KeyboardEvent }) => void`<br/> | N
onFocus | Function |  | Typescript：`(value: InputNumberValue, context: { e: FocusEvent }) => void`<br/> | N
onKeydown | Function |  | Typescript：`(value: InputNumberValue, context: { e: KeyboardEvent }) => void`<br/> | N
onKeypress | Function |  | Typescript：`(value: InputNumberValue, context: { e: KeyboardEvent }) => void`<br/> | N
onKeyup | Function |  | Typescript：`(value: InputNumberValue, context: { e: KeyboardEvent }) => void`<br/> | N
onValidate | Function |  | Typescript：`(context: { error?: 'exceed-maximum' \| 'below-minimum' }) => void`<br/> | N
