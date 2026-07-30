:: BASE_DOC ::

### Button-style Checkbox Groups

Button-style checkbox groups arrange options as independent tag-like buttons horizontally or vertically, wrapping naturally when space is limited. Selected items use a filled background and work well for permission assignment, feature toggles, and other cases where users need to identify multiple selections quickly.

{{ button }}

### Button-style Checkbox Groups in Different Sizes

Button-style checkbox groups are available in large, medium (default), and small sizes.

{{ button-size }}

### Button-style Checkbox Groups in Different Variants

Button-style checkbox groups support outline, default-filled (default), and primary-filled variants, as well as vertical layout.

{{ button-variant }}

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
readOnly | Boolean | false | \- | N
title | String | - | html attribute | N
value | String / Number / Boolean | - | value of checkbox。Typescript: `string \| number \| boolean` | N
onChange | Function |  | Typescript: `(checked: boolean, context: { e: ChangeEvent }) => void`<br/> | N
onClick | Function |  | Typescript: `(context: { e: MouseEvent }) => void`<br/>trigger on click | N

### CheckboxGroup Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
direction | String | horizontal | Checkbox option arrangement。options: horizontal/vertical | N
disabled | Boolean | - | \- | N
max | Number | undefined | \- | N
name | String | - | \- | N
options | Array | - | Typescript：`Array<CheckboxOption>` `type CheckboxOption = string \| number \| CheckboxOptionObj` `interface CheckboxOptionObj { label?: string \| TNode; value?: string \| number; disabled?: boolean; name?: string; checkAll?: true }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts) | N
readOnly | Boolean | undefined | \- | N
size | String | medium | works only when theme is button。options: small/medium/large。Typescript: `SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
theme | String | checkbox | Determine the style of checkbox when using options API。options: checkbox/button | N
value | Array | [] | Typescript：`T` `type CheckboxGroupValue = Array<string \| number \| boolean>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts) | N
defaultValue | Array | [] | uncontrolled property。Typescript：`T` `type CheckboxGroupValue = Array<string \| number \| boolean>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts) | N
variant | String | default-filled | works only when theme is button。options: outline/default-filled/primary-filled | N
onChange | Function |  | Typescript：`(value: T, context: CheckboxGroupChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts)。<br/>`interface CheckboxGroupChangeContext { e: ChangeEvent; current: CheckboxOption \| TdCheckboxProps; type: 'check' \| 'uncheck' }`<br/> | N
