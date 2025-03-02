:: BASE_DOC ::

## API

### Slider Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
disabled | Boolean | false | \- | N
inputNumberProps | Boolean / Object | false | Typescript：`boolean \| InputNumberProps`，[InputNumber API Documents](./input-number?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/slider/type.ts) | N
label | TNode | true | Typescript：`string \| boolean \| TNode<{ value: SliderValue; position?: 'start' \| 'end' }>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
layout | String | horizontal | options：vertical/horizontal | N
marks | Object / Array | - | Typescript：`Array<number> \| SliderMarks` `interface SliderMarks { [mark: number]: string \| TNode<{ value: number }> }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/slider/type.ts) | N
max | Number | 100 | \- | N
min | Number | 0 | \- | N
range | Boolean | false | \- | N
showStep | Boolean | false | \- | N
step | Number | 1 | \- | N
tooltipProps | Object | - | Typescript：`TooltipProps`，[Tooltip API Documents](./tooltip?tab=api)。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/slider/type.ts) | N
value | Number / Array | - | Typescript：`SliderValue` `type SliderValue = number \| Array<number>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/slider/type.ts) | N
defaultValue | Number / Array | - | uncontrolled property。Typescript：`SliderValue` `type SliderValue = number \| Array<number>`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/slider/type.ts) | N
onChange | Function |  | Typescript：`(value: SliderValue) => void`<br/> | N
