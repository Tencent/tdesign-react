:: BASE_DOC ::

## API

### Dialog Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
actions | TNode | - | 操作栏。TS 类型：`Array<ButtonProps>`，[Button API Documents](./button?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dialog/type.ts) | N
buttonLayout | String | horizontal | 多按钮排列方式。可选项：horizontal/vertical | N
cancelBtn | TNode | - | 取消按钮，可自定义。值为 null 则不显示取消按钮。值类型为字符串，则表示自定义按钮文本，值类型为 Object 则表示透传 Button 组件属性。使用 TNode 自定义按钮时，需自行控制取消事件。TS 类型：`string \| ButtonProps \| TNode \| null`，[Button API Documents](./button?tab=api)。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dialog/type.ts) | N
closeBtn | Boolean | false | 多按钮排列方式。可选项：true/false | N
closeOnOverlayClick | Boolean | false | 点击蒙层时是否触发关闭事件 | N
confirmBtn | TNode | - | 确认按钮。值为 null 则不显示确认按钮。值类型为字符串，则表示自定义按钮文本，值类型为 Object 则表示透传 Button 组件属性。使用 TNode 自定义按钮时，需自行控制确认事件。TS 类型：`string \| ButtonProps \| TNode \| null`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | 内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
destroyOnClose | Boolean | false | 是否在关闭弹框的时候销毁子元素 | N
middle | TElement | - | 中间自定义内容。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
overlayProps | Object | {} | 透传至 Overlay 组件。TS 类型：`OverlayProps`，[Overlay API Documents](./overlay?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dialog/type.ts) | N
preventScrollThrough | Boolean | true | 防止滚动穿透 | N
showOverlay | Boolean | true | 是否显示遮罩层 | N
title | TNode | - | 标题。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
top | TElement | - | 顶部自定义内容。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
visible | Boolean | - | 控制对话框是否显示 | N
width | String / Number | - | 对话框宽度，示例：320, '500px', '80%' | N
zIndex | Number | - | 对话框层级，Web 侧样式默认为 2500，移动端样式默认 1500，小程序样式默认为 11500 | N
onCancel | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>如果“取消”按钮存在，则点击“取消”按钮时触发，同时触发关闭事件 | N
onClose | Function |  | TS 类型：`(context: DialogCloseContext) => void`<br/>关闭事件，点击 取消按钮 或 点击蒙层 时触发。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dialog/type.ts)。<br/>`type DialogEventSource = 'cancel' \| 'overlay' \| 'close-btn'`<br/><br/>`interface DialogCloseContext { trigger: DialogEventSource; e: MouseEvent }`<br/> | N
onClosed | Function |  | TS 类型：`() => void`<br/>对话框消失动画效果结束后触发 | N
onConfirm | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>如果“确认”按钮存在，则点击“确认”按钮时触发 | N
onOverlayClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>如果蒙层存在，点击蒙层时触发 | N

### DialogOptions

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 弹框类名，示例：'t-class-dialog-first t-class-dialog-second' | N
style | Object | - | 弹框 style 属性，输入 [CSSStyleDeclaration.cssText](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText)。TS 类型：`Styles`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
`Omit<DialogProps, 'attach'>` | \- | - | 继承 `Omit<DialogProps, 'attach'>` 中的全部属性 | N

### DialogInstance

名称 | 参数 | 返回值 | 描述
-- | -- | -- | --
destroy | \- | \- | 必需。销毁弹框
hide | \- | \- | 必需。隐藏弹框
show | \- | \- | 必需。显示弹框
update | `(props: DialogOptions)` | \- | 必需。更新弹框内容

### dialog 或 DialogPlugin

参数名称 | 参数类型 | 参数默认值 | 参数描述
-- | -- | -- | --
options | \- | - | TS 类型：`DialogOptions`

### dialog.confirm 或 DialogPlugin.confirm

参数名称 | 参数类型 | 参数默认值 | 参数描述
-- | -- | -- | --
options | \- | - | TS 类型：`DialogOptions`

### dialog.alert 或 DialogPlugin.alert

参数名称 | 参数类型 | 参数默认值 | 参数描述
-- | -- | -- | --
options | Object | - | TS 类型：`Omit<DialogOptions, 'cancelBtn'>`

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-dialog-body-max-height | 456px | -
--td-dialog-border-radius | @radius-extraLarge | -
--td-dialog-close-color | @text-color-placeholder | -
--td-dialog-close-icon-size | 22px | -
--td-dialog-content-color | @text-color-secondary | -
--td-dialog-content-font | @font-body-large | -
--td-dialog-title-color | @text-color-primary | -
--td-dialog-title-font | @font-title-large | -
--td-dialog-width | 311px | -
