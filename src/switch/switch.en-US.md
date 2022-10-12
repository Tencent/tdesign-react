:: BASE_DOC ::

## API

### Switch Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
customValue | Array | - | Typescript：`Array<SwitchValue>` | N
disabled | Boolean | - | \- | N
label | TNode | [] | Typescript：`Array<string \| TNode> \| TNode<{ value: SwitchValue }>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
loading | Boolean | false | \- | N
size | String | medium | options：small/medium/large | N
value | String / Number / Boolean | - | Typescript：`SwitchValue` `type SwitchValue = string \| number \| boolean`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/switch/type.ts) | N
defaultValue | String / Number / Boolean | - | uncontrolled property。Typescript：`SwitchValue` `type SwitchValue = string \| number \| boolean`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/switch/type.ts) | N
onChange | Function |  | Typescript：`(value: SwitchValue) => void`<br/> | N
