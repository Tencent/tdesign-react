:: BASE_DOC ::

## API
### Space Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
align | String | - | alignment。options: start/end/center/baseline | N
breakLine | Boolean | false | Whether to wrap, valid only in horizontal | N
direction | String | horizontal | Spacing direction。options: vertical/horizontal | N
separator | TNode | - | separator。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
size | String / Number / Array | 'medium' | Spacing。Typescript：`SpaceSize \| SpaceSize[]` `type SpaceSize = number \| string \| SizeEnum`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/space/type.ts) | N
