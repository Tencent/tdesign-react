:: BASE_DOC ::

## API

### Popup Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
attach | String / Function | 'body' | 指定挂载节点。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：`AttachNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
children | TNode | - | 触发元素，同 triggerElement。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
closeBtn | TNode | - | 是否展示关闭按钮，值为 `true` 显示默认关闭按钮；值为 `false` 则不显示关闭按钮；也可以自定义关闭按钮。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
closeOnOverlayClick | Boolean | true | 点击遮罩层是否关闭 | N
destroyOnClose | Boolean | false | 是否在关闭浮层时销毁浮层 | N
duration | Number | 240 | 动画过渡时间 | N
overlayProps | Object | {} | 遮罩层的属性，透传至 overlay。TS 类型：`OverlayProps`，[Overlay API Documents](./overlay?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/popup/type.ts) | N
placement | String | top | 浮层出现位置。可选项：top/left/right/bottom/center | N
preventScrollThrough | Boolean | true | 是否阻止背景滚动 | N
showOverlay | Boolean | true | 是否显示遮罩层 | N
visible | Boolean | - | 是否显示浮层。TS 类型：`boolean` | N
defaultVisible | Boolean | - | 是否显示浮层。非受控属性。TS 类型：`boolean` | N
zIndex | Number | - | 组件层级，Web 侧样式默认为 5500，移动端默认为 1500，小程序端默认 11500 | N
onClose | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>组件准备关闭时触发 | N
onClosed | Function |  | TS 类型：`() => void`<br/>组件关闭且动画结束后执行 | N
onOpen | Function |  | TS 类型：`() => void`<br/>组件准备展示时触发 | N
onOpened | Function |  | TS 类型：`() => void`<br/>组件展示且动画结束后执行 | N
onVisibleChange | Function |  | TS 类型：`(visible: boolean, trigger: PopupSource)  => void`<br/>当浮层隐藏或显示时触发，trigger=document 表示点击弹出层元素触发。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/popup/type.ts)。<br/>`type PopupSource = 'close-btn' \| 'overlay' \| 'document'`<br/> | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-popup-bg-color | @bg-color-container | -
--td-popup-border-radius | @radius-extraLarge | -
--td-popup-close-btn-color | @text-color-primary | -
