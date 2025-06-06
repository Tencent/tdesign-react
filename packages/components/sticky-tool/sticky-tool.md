:: BASE_DOC ::

## API
### StickyTool Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
list | Array | [] | 列表。TS 类型：`Array<TdStickyItemProps>` | N
offset | Array | - | 相对于 placement 的偏移量，示例：[-10, 20] 或 ['10em', '8rem']。TS 类型：`Array<string \| number>` | N
placement | String | right-bottom | 固定位置。可选项：right-top/right-center/right-bottom/left-top/left-center/left-bottom | N
popupProps | Object | - | 透传 Popup 组件全部特性，优先级低于 StickyItem.popupProps。TS 类型：`PopupProps`，[Popup API Documents](./popup?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/sticky-tool/type.ts) | N
shape | String | square | 侧边栏菜单形状，有 2 种：方形、圆形。可选项：square/round | N
type | String | normal | 侧边栏菜单类型，有 2 种：常规型和紧凑型。可选项：normal/compact | N
width | String / Number | - | 宽度 | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent; item: TdStickyItemProps }) => void`<br/>点击某一项时触发 | N
onHover | Function |  | TS 类型：`(context: { e: MouseEvent; item: TdStickyItemProps }) => void`<br/>悬浮到某一项时触发 | N

### StickyItem Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
icon | TElement | - | 图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
label | TNode | - | 名称。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
popup | TNode | - | 浮层内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
popupProps | Object | - | 透传浮层组件全部属性。TS 类型：`PopupProps`，[Popup API Documents](./popup?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/sticky-tool/type.ts) | N
trigger | String | hover | 触发浮层显示的方式。可选项：hover/click | N
