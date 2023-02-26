:: BASE_DOC ::

## API

### BackTop Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
shape | String |square | 形状：square, circle | N
size | String | medium | 大小: medium, small | N
theme | String | - | 大小: default, primary, dark | N
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
fixed | Boolean | true | 是否绝对定位固定到屏幕右下方 | N
icon | TNode | 'backtop' | 图标。TS 类型： string,`TNode`
target | Object | () => window | 定位滚动到指定对象。TS 类型：`() => HTMLElement` | N
text | String | 'TOP' | 文案 | N
theme | String | round | 预设的样式类型。可选项：round/half-round/round-dark/half-round-dark | N