:: BASE_DOC ::

## API
### Checkbox Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
checkAll | Boolean | false | \- | N
checked | Boolean | false | \- | N
defaultChecked | Boolean | false | uncontrolled property | N
children | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
disabled | Boolean | undefined | \- | N
indeterminate | Boolean | false | \- | N
label | TNode | - | Typescript: `string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
name | String | - | \- | N
readonly | Boolean | false | \- | N
title | String | - | html attribute | N
value | String / Number / Boolean | - | value of checkbox。Typescript: `string \| number \| boolean` | N
onChange | Function |  | Typescript: `(checked: boolean, context: { e: ChangeEvent }) => void`<br/> | N
onClick | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/>trigger on click | N

### CheckboxGroup Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
disabled | Boolean | - | \- | N
max | Number | undefined | \- | N
name | String | - | \- | N
options | Array | - | Typescript: `Array<CheckboxOption>` `type CheckboxOption = string \| number \| CheckboxOptionObj` `interface CheckboxOptionObj { label?: string \| TNode; value?: string \| number; disabled?: boolean; name?: string; checkAll?: true }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts) | N
readonly | Boolean | undefined | \- | N
value | Array | [] | Typescript: `T` `type CheckboxGroupValue = Array<string \| number \| boolean>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts) | N
defaultValue | Array | [] | uncontrolled property。Typescript: `T` `type CheckboxGroupValue = Array<string \| number \| boolean>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts) | N
onChange | Function |  | Typescript: `(value: T, context: CheckboxGroupChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts)。<br/>`interface CheckboxGroupChangeContext { e: ChangeEvent; current: CheckboxOption \| TdCheckboxProps; type: 'check' \| 'uncheck' }`<br/> | N
