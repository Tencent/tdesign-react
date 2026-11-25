:: BASE_DOC ::

## API

### BackTop Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
container | Function | - | 滚动的容器。TS 类型：`() => HTMLElement` | N
fixed | Boolean | true | 是否绝对定位固定到屏幕右下方 | N
icon | TNode | true | 图标。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
target | Function | - | 定位滚动到指定对象。TS 类型：`() => HTMLElement` | N
text | String | '' | 文案 | N
theme | String | round | 预设的样式类型。可选项：round/half-round/round-dark/half-round-dark | N
visibilityHeight | Number | 200 | 滚动高度达到此参数值才出现 | N
onToTop | Function |  | TS 类型：`() => void`<br/>点击触发 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-back-top-half-round-border-radius | @radius-round | -
--td-back-top-round-bg-color | @font-white-1 | -
--td-back-top-round-border-color | @component-border | -
--td-back-top-round-border-radius | @radius-circle | -
--td-back-top-round-color | @font-gray-1 | -
--td-back-top-round-dark-bg-color | @gray-color-14 | -
--td-back-top-round-dark-color | @font-white-1 | -
