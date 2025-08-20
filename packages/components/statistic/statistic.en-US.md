:: BASE_DOC ::

## API

### Statistic Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript：`React.CSSProperties` | N
animation | Object | - | Animation effect control, `duration` refers to the transition time of the animation `unit: millisecond`, `valueFrom` refers to the initial value of the animation. `{ duration, valueFrom }`。Typescript：`animation` `interface animation { duration: number; valueFrom: number;  }`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/statistic/type.ts) | N
animationStart | Boolean | false | Whether to start animation | N
color | String | - | The color style can support TDesign's light and dark modes with the following options: black, blue, red, orange, and green. Alternatively, it can be any [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) value, but in this case, TDesign's light and dark modes will not be supported. | N
decimalPlaces | Number | - |  Decimal places | N
extra | TNode | - |  Additional display content。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
format | Function | - | Format numeric display value。Typescript：`(value: number) => number` | N
loading | Boolean | false | Loading | N
prefix | TNode | - | Prefix content, display priority is higher than trend。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
separator | String | , | Thousands separator is displayed by default, and can be customized to other content, and the default separator is displayed when `separator = ''` is set to an empty string/null/undefined | N
suffix | TNode | - |  Suffix content, display priority is higher than trend。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
title | TNode | - | The title of Statistic。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
trend | String | - | trend。options: increase/decrease | N
trendPlacement | String | left | Position of trending placements。options: left/right | N
unit | TNode | - | Unit content。Typescript：`string \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
value | Number | - | The value of Statistic | N

### StatisticInstanceFunctions 组件实例方法

name | params | return | description
-- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript：`React.CSSProperties` | N
start | \- | \- | required。start animation
