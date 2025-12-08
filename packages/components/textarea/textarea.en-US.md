:: BASE_DOC ::

## API

### Textarea Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
allowInputOverMax | Boolean | false | Allow input after exceeding `maxlength` or `maxcharacter` | N
autofocus | Boolean | false | \- | N
autosize | Boolean / Object | false | Typescript: `boolean \| { minRows?: number; maxRows?: number }` | N
count | Boolean / Function | - | Character counter. It is enabled by default when `maxLength` or `maxCharacter` is set.。Typescript: `boolean \| ((ctx: { value: string; count: number; maxLength?: number; maxCharacter?: number }) => TNode)`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
disabled | Boolean | undefined | \- | N
maxcharacter | Number | - | \- | N
maxlength | Number | - | Typescript: `number` | N
name | String | - | \- | N
placeholder | String | undefined | \- | N
readonly | Boolean | false | \- | N
status | String | - | options: default/success/warning/error | N
tips | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
value | String / Number | - | Typescript: `TextareaValue` `type TextareaValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/textarea/type.ts) | N
defaultValue | String / Number | - | uncontrolled property。Typescript: `TextareaValue` `type TextareaValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/textarea/type.ts) | N
onBlur | Function |  | Typescript: `(value: TextareaValue, context: { e: FocusEvent }) => void`<br/> | N
onChange | Function |  | Typescript: `(value: TextareaValue, context?: { e?: InputEvent }) => void`<br/> | N
onFocus | Function |  | Typescript: `(value: TextareaValue, context : { e: FocusEvent }) => void`<br/> | N
onKeydown | Function |  | Typescript: `(value: TextareaValue, context: { e: KeyboardEvent }) => void`<br/> | N
onKeypress | Function |  | Typescript: `(value: TextareaValue, context: { e: KeyboardEvent }) => void`<br/> | N
onKeyup | Function |  | Typescript: `(value: TextareaValue, context: { e: KeyboardEvent }) => void`<br/> | N
