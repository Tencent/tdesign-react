:: BASE_DOC ::

## API

### Radio Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
allowUncheck | Boolean | false | \- | N
block | Boolean | true | \- | N
borderless | Boolean | undefined | \- | N
checked | Boolean | false | \- | N
defaultChecked | Boolean | false | uncontrolled property | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
contentDisabled | Boolean | - | \- | N
disabled | Boolean | undefined | \- | N
icon | String / Array | 'circle' | Typescript: `'circle' \| 'line' \| 'dot' \| 'none' \|Array<TNode>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
label | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
maxContentRow | Number | 5 | \- | N
maxLabelRow | Number | 3 | \- | N
name | String | - | \- | N
placement | String | - | options: left/right | N
readonly | Boolean | undefined | \- | N
value | String / Number / Boolean | undefined | Typescript: `T` | N
onChange | Function |  | Typescript: `(checked: boolean, context: { e: ChangeEvent }) => void`<br/> | N


### RadioGroup Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
allowUncheck | Boolean | false | \- | N
borderless | Boolean | false | \- | N
direction | String | vertical | `1.0.0`。Radio option arrangement。options: vertical/horizontal | N
disabled | Boolean | undefined | \- | N
icon | String / Array | 'circle' | Typescript: `'circle' \| 'line' \| 'dot' \| Array<TNode>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
keys | Object | - | Typescript: `KeysType`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
name | String | - | \- | N
options | Array | - | Typescript: `Array<RadioOption>` `type RadioOption = string \| number \| RadioOptionObj` `interface RadioOptionObj { label?: string \| TNode; value?: string \| number \| boolean; disabled?: boolean }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/radio/type.ts) | N
placement | String | left | options: left/right | N
readonly | Boolean | undefined | \- | N
value | String / Number / Boolean | - | Typescript: `T` `type RadioValue = string \| number \| boolean`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/radio/type.ts) | N
defaultValue | String / Number / Boolean | - | uncontrolled property。Typescript: `T` `type RadioValue = string \| number \| boolean`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/radio/type.ts) | N
onChange | Function |  | Typescript: `(value: T, context: { e: ChangeEvent; name?: string }) => void`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-radio-bg-color | @bg-color-container | -
--td-radio-border-color | @component-stroke | -
--td-radio-content-color | @text-color-secondary | -
--td-radio-content-disabled-color | @text-color-disabled | -
--td-radio-content-font | @font-body-medium | -
--td-radio-font | @font-body-large | -
--td-radio-icon-checked-color | @brand-color | -
--td-radio-icon-color | @component-border | -
--td-radio-icon-disabled-bg-color | @bg-color-component-disabled | -
--td-radio-icon-disabled-color | @brand-color-disabled | -
--td-radio-icon-size | 24px | -
--td-radio-label-color | @text-color-primary | -
--td-radio-label-disabled-color | @text-color-disabled | -
--td-radio-label-line-height | 24px | -
--td-radio-vertical-padding | 16px | -
