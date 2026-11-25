:: BASE_DOC ::

## API

### Checkbox Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
block | Boolean | true | \- | N
borderless | Boolean | undefined | \- | N
checkAll | Boolean | false | \- | N
checked | Boolean | false | \- | N
defaultChecked | Boolean | false | uncontrolled property | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
contentDisabled | Boolean | - | \- | N
disabled | Boolean | undefined | \- | N
icon | String / Boolean / Array | 'circle' | Typescript: `CheckboxIconType` `type CheckboxIconType = 'circle' \| 'line' \| 'rectangle' \| boolean \| Array<TNode \| String>;`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/checkbox/type.ts) | N
indeterminate | Boolean | false | \- | N
label | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
maxContentRow | Number | 5 | \- | N
maxLabelRow | Number | 3 | \- | N
name | String | - | \- | N
placement | String | left | options: left/right | N
readonly | Boolean | undefined | \- | N
value | String / Number / Boolean | - | value of checkbox。Typescript: `string \| number \| boolean` | N
onChange | Function |  | Typescript: `(checked: boolean, context: { e: ChangeEvent }) => void`<br/> | N


### CheckboxGroup Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
borderless | Boolean | false | \- | N
direction | String | vertical | `1.0.0`。Radio option arrangement。options: vertical/horizontal | N
disabled | Boolean | undefined | \- | N
keys | Object | - | Typescript: `KeysType`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
max | Number | undefined | \- | N
name | String | - | \- | N
options | Array | - | Typescript: `Array<CheckboxOption>` `type CheckboxOption = string \| number \| CheckboxOptionObj` `interface CheckboxOptionObj extends TdCheckboxProps { text?: string; }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/checkbox/type.ts) | N
readonly | Boolean | undefined | \- | N
value | Array | [] | Typescript: `T` `type CheckboxGroupValue = Array<string \| number \| boolean>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/checkbox/type.ts) | N
defaultValue | Array | [] | uncontrolled property。Typescript: `T` `type CheckboxGroupValue = Array<string \| number \| boolean>`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/checkbox/type.ts) | N
onChange | Function |  | Typescript: `(value: T, context: CheckboxGroupChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/checkbox/type.ts)。<br/>`interface CheckboxGroupChangeContext { e: Event; current: string \| number; option: CheckboxOption \| TdCheckboxProps; type: 'check' \| 'uncheck' }`<br/> | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-checkbox-bg-color | @bg-color-container | -
--td-checkbox-border-color | @component-stroke | -
--td-checkbox-description-color | @text-color-secondary | -
--td-checkbox-description-disabled-color | @text-color-disabled | -
--td-checkbox-description-font | @font-body-medium | -
--td-checkbox-icon-checked-color | @brand-color | -
--td-checkbox-icon-color | var(--td-border-level-2-color, @gray-color-4) | -
--td-checkbox-icon-disabled-bg-color | @bg-color-component-disabled | -
--td-checkbox-icon-disabled-color | @brand-color-disabled | -
--td-checkbox-icon-size | 24px | -
--td-checkbox-tag-active-bg-color | @brand-color-light | -
--td-checkbox-tag-active-color | @brand-color | -
--td-checkbox-tag-bg-color | @bg-color-component | -
--td-checkbox-title-color | @text-color-primary | -
--td-checkbox-title-disabled-color | @text-color-disabled | -
--td-checkbox-title-font | @font-body-large | -
--td-checkbox-title-line-height | 24px | -
--td-checkbox-vertical-padding | @spacer-2 | -
