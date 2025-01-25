:: BASE_DOC ::

## API

### Radio Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript：`React.CSSProperties` | N
allowUncheck | Boolean | false | \- | N
checked | Boolean | false | \- | N
defaultChecked | Boolean | false | uncontrolled property | N
children | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | undefined | \- | N
label | TNode | - | Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
name | String | - | \- | N
readonly | Boolean | undefined | \- | N
value | String / Number / Boolean | undefined | Typescript：`T` | N
onChange | Function |  | Typescript：`(checked: boolean, context: { e: ChangeEvent }) => void`<br/> | N
onClick | Function |  | Typescript：`(context: { e: MouseEvent }) => void`<br/>trigger on click | N


### RadioGroup Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript：`React.CSSProperties` | N
allowUncheck | Boolean | false | \- | N
disabled | Boolean | undefined | \- | N
name | String | - | \- | N
options | Array | - | Typescript：`Array<RadioOption>` `type RadioOption = string \| number \| RadioOptionObj` `interface RadioOptionObj { label?: string \| TNode; value?: string \| number \| boolean; disabled?: boolean }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/radio/type.ts) | N
readonly | Boolean | undefined | \- | N
theme | String | radio | options：radio/button。 | N
size | String | medium | options: small/medium/large。Typescript：`SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | String / Number / Boolean | - | Typescript：`T` `type RadioValue = string \| number \| boolean`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/radio/type.ts) | N
defaultValue | String / Number / Boolean | - | uncontrolled property。Typescript：`T` `type RadioValue = string \| number \| boolean`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/radio/type.ts) | N
variant | String | outline | options: outline/primary-filled/default-filled | N
onChange | Function |  | Typescript：`(value: T, context: { e: ChangeEvent; name?: string }) => void`<br/> | N
