:: BASE_DOC ::

## API

### Input Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
align | String | left | text align type。options: left/center/right | N
allowInputOverMax | Boolean | false | allow to continue input on value length is over `maxlength` or `maxcharacter` | N
autocomplete | String | undefined | attribute of input element, [see here](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) | N
autofocus | Boolean | false | autofocus on first rendered | N
borderless | Boolean | false | input without border | N
clearTrigger | String | always | show clear icon, clicked to clear input value。options: always / focus | N
clearable | Boolean | false | show clear icon, clicked to clear input value | N
cursorColor | String | #0052d9 | \- | N
disabled | Boolean | undefined | make input to be disabled | N
enterkeyhint | String | - | attribute of input element, [see here](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/enterkeyhint)。options: enter/done/go/next/previous/search/send | N
extra | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
format | Function | - | input value formatter, `type=number` does not work. if you need to format number, `InputNumber` Component might be better。Typescript: `InputFormatType` `type InputFormatType = (value: InputValue) => string`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/input/type.ts) | N
label | TNode | - | text on the left of input。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
layout | String | horizontal | options: vertical/horizontal | N
maxcharacter | Number | - | \- | N
maxlength | String / Number | - | \- | N
name | String | - | \- | N
placeholder | String | undefined | \- | N
prefixIcon | TElement | - | Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
readonly | Boolean | undefined | \- | N
spellcheck | Boolean | false | attribute of input element, [see here](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/spellcheck) | N
status | String | default | options: default/success/warning/error | N
suffix | TNode | - | suffix content before suffixIcon。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
suffixIcon | TElement | - | suffix icon of input。Typescript: `TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
tips | TNode | - | tips on the bottom of input, different `status` can make tips to be different color。Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
type | String | text | type attribute of input element. if you are using `type=number`, `InputNumber` Component might be better。options: text/number/url/tel/password/search/submit/hidden | N
value | String / Number | - | input value。Typescript: `InputValue` `type InputValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/input/type.ts) | N
defaultValue | String / Number | - | input value。uncontrolled property。Typescript: `InputValue` `type InputValue = string \| number`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/input/type.ts) | N
onBlur | Function |  | Typescript: `(value: InputValue, context: { e: FocusEvent }) => void`<br/> | N
onChange | Function |  | Typescript: `(value: InputValue, context?: { e?: InputEvent \| MouseEvent \| CompositionEvent; trigger: 'input' \| 'initial' \| 'clear' \| 'blur'}) => void`<br/>trigger on input value changed | N
onClear | Function |  | Typescript: `(context: { e: TouchEvent }) => void`<br/> | N
onFocus | Function |  | Typescript: `(value: InputValue, context: { e: FocusEvent }) => void`<br/> | N
onValidate | Function |  | Typescript: `(context: { error?: 'exceed-maximum' \| 'below-minimum' }) => void`<br/>trigger on text length being over max length or max character | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-input-align-items | center | -
--td-input-bg-color | @bg-color-container | -
--td-input-border-color | @component-stroke | -
--td-input-border-left-space | 16px | -
--td-input-border-radius | @radius-default | -
--td-input-border-right-space | 0 | -
--td-input-cursor-color | @brand-color | -
--td-input-default-text-color | @text-color-primary | -
--td-input-default-tips-color | @text-color-placeholder | -
--td-input-disabled-text-color | @text-color-disabled | -
--td-input-error-text-color | @error-color | -
--td-input-error-tips-color | @error-color | -
--td-input-label-text-color | @text-color-primary | -
--td-input-label-text-font | @font-body-large | -
--td-input-placeholder-text-color | @text-color-placeholder | -
--td-input-placeholder-text-font | @font-body-large | -
--td-input-prefix-icon-color | @text-color-primary | -
--td-input-success-text-color | @success-color | -
--td-input-success-tips-color | @success-color | -
--td-input-suffix-icon-color | @text-color-placeholder | -
--td-input-suffix-text-color | @text-color-primary | -
--td-input-vertical-padding | 16px | -
--td-input-warning-text-color | @warning-color | -
--td-input-warning-tips-color | @warning-color | -
