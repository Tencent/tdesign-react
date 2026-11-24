:: BASE_DOC ::

## API

### Overlay Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
backgroundColor | String | - | 遮罩层的背景色 | N
children | TNode | - | 遮罩内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
duration | Number | 300 | 背景色过渡时间，单位毫秒 | N
preventScrollThrough | Boolean | true | 防止滚动穿透，即不允许点击和滚动 | N
visible | Boolean | false | 是否展示 | N
zIndex | Number | - | 遮罩的层级，默认为 1000 | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>遮罩层的点击事件 | N
onClose | Function |  | TS 类型：`() => void`<br/>遮罩执行消失动画效果前触发 | N
onClosed | Function |  | TS 类型：`() => void`<br/>遮罩消失动画效果结束后触发 | N
onOpen | Function |  | TS 类型：`() => void`<br/>遮罩执行弹出动画效果前触发 | N
onOpened | Function |  | TS 类型：`() => void`<br/>遮罩弹出动画效果结束后触发 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-overlay-bg-color | @mask-active | -
--td-overlay-zIndex | @z-index-overlay | -
