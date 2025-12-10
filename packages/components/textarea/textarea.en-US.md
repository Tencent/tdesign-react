:: BASE_DOC ::

## API
### Textarea Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
allowInputOverMax | Boolean | false | \- | N
autofocus | Boolean | false | \- | N
autosize | Boolean / Object | false | Typescript: `boolean \| { minRows?: number; maxRows?: number }` | N
disabled | Boolean | false | \- | N
label | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
maxcharacter | Number | - | \- | N
maxlength | Number | - | \- | N
name | String | - | \- | N
placeholder | String | undefined | \- | N
readonly | Boolean | false | \- | N
status | String | 'default' | options：default/success/warning/error | N
tips | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
value | String / Number | - | Typescript: `TextareaValue` `type TextareaValue = string`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/textarea/type.ts) | N
defaultValue | String / Number | - | uncontrolled property。Typescript: `TextareaValue` `type TextareaValue = string`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/textarea/type.ts) | N
onBlur | Function |  | Typescript: `(value: TextareaValue, context: { e: FocusEvent }) => void`<br/> | N
onChange | Function |  | Typescript: `(value: TextareaValue, context?: { e?: InputEvent }) => void`<br/> | N
onFocus | Function |  | Typescript: `(value: TextareaValue, context : { e: FocusEvent }) => void`<br/> | N
onKeydown | Function |  | Typescript: `(value: TextareaValue, context: { e: KeyboardEvent }) => void`<br/> | N
onKeypress | Function |  | Typescript: `(value: TextareaValue, context: { e: KeyboardEvent }) => void`<br/> | N
onKeyup | Function |  | Typescript: `(value: TextareaValue, context: { e: KeyboardEvent }) => void`<br/> | N
