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
bordered | Boolean | false | \- | N
cursorColor | String | #0052d9 | \- | N
disabled | Boolean | undefined | \- | N
indicator | Boolean | false | \- | N
label | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
layout | String | horizontal | options: vertical/horizontal | N
maxcharacter | Number | - | \- | N
maxlength | String / Number | - | Typescript: `string \| number` | N
name | String | - | \- | N
placeholder | String | undefined | \- | N
readonly | Boolean | undefined | \- | N
value | String / Number | - | Typescript: `TextareaValue` `type TextareaValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/textarea/type.ts) | N
defaultValue | String / Number | - | uncontrolled property。Typescript: `TextareaValue` `type TextareaValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/textarea/type.ts) | N
onBlur | Function |  | Typescript: `(value: TextareaValue, context: { e: FocusEvent }) => void`<br/> | N
onChange | Function |  | Typescript: `(value: TextareaValue, context?: { e?: InputEvent }) => void`<br/> | N
onCompositionend | Function |  | Typescript: `(value: string, context: { e: CompositionEvent }) => void`<br/>trigger on compositionend | N
onCompositionstart | Function |  | Typescript: `(value: string, context: { e: CompositionEvent }) => void`<br/>trigger on compositionstart | N
onFocus | Function |  | Typescript: `(value: TextareaValue, context : { e: FocusEvent }) => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-textarea-background-color | @bg-color-container | -
--td-textarea-border-color | @component-border | -
--td-textarea-border-radius | @radius-default | -
--td-textarea-disabled-text-color | @text-color-disabled | -
--td-textarea-indicator-text-color | @text-color-placeholder | -
--td-textarea-label-color | @text-color-primary | -
--td-textarea-label-width | 64px | -
--td-textarea-padding | @textarea-vertical-padding @textarea-horizontal-padding | -
--td-textarea-placeholder-color | @text-color-placeholder | -
--td-textarea-text-color | @text-color-primary | -
