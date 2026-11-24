:: BASE_DOC ::

## API

### Popover Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 触发元素，同 triggerElement。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
closeOnClickOutside | Boolean | true | 是否在点击外部元素后关闭菜单  | N
content | TNode | - | 确认框内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
placement | String | top | 浮层出现位置。可选项：top/left/right/bottom/top-left/top-right/bottom-left/bottom-right/left-top/left-bottom/right-top/right-bottom | N
showArrow | Boolean | true | 是否显示浮层箭头 | N
theme | String | dark | 弹出气泡主题。可选项：dark/light/brand/success/warning/error | N
triggerElement | TNode | - | 触发元素。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
visible | Boolean | - | 是否显示气泡确认框 | N
onVisibleChange | Function |  | TS 类型：`(visible: boolean) => void`<br/>确认框显示或隐藏时触发 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-popover-padding | 12px | -
