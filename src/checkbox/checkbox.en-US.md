:: BASE_DOC ::

## API

### Checkbox Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
checkAll | Boolean | false | \- | N
checked | Boolean | false | \- | N
defaultChecked | Boolean | false | uncontrolled property | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | undefined | \- | N
indeterminate | Boolean | false | \- | N
label | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
name | String | - | \- | N
readonly | Boolean | false | \- | N
value | String / Number | - | Typescript：`string \| number` | N
onChange | Function |  | Typescript：`(checked: boolean, context: { e: ChangeEvent }) => void`<br/> | N

### CheckboxGroup Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
disabled | Boolean | - | \- | N
max | Number | undefined | \- | N
name | String | - | \- | N
options | Array | [] | Typescript：`Array<CheckboxOption>` `type CheckboxOption = string \| number \| CheckboxOptionObj` `interface CheckboxOptionObj { label?: string \| TNode; value?: string \| number; disabled?: boolean; name?: string; checkAll?: true }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/checkbox/type.ts) | N
value | Array | [] | Typescript：`CheckboxGroupValue` `type CheckboxGroupValue = Array<string \| number>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/checkbox/type.ts) | N
defaultValue | Array | [] | uncontrolled property。Typescript：`CheckboxGroupValue` `type CheckboxGroupValue = Array<string \| number>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/checkbox/type.ts) | N
onChange | Function |  | Typescript：`(value: CheckboxGroupValue, context: CheckboxGroupChangeContext) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/checkbox/type.ts)。<br/>`interface CheckboxGroupChangeContext { e: ChangeEvent; current: CheckboxOption \| TdCheckboxProps; type: 'check' \| 'uncheck' }`<br/> | N
