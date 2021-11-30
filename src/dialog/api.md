
### Dialog Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
attach | String / Function | '' | 对话框挂载的节点，默认挂在组件本身的位置。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：`AttachNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
body | TNode | '' | 对话框内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
cancelBtn | TNode | '取消' | 对话框“取消”按钮，可自定义。值为 '' 或 null 则不显示取消按钮。TS 类型：`string | ButtonProps | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts)。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/dialog/index.ts) | N
children | TNode | - | 抽屉内容，同 body。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
closeBtn | TNode | true | 关闭按钮，可以自定义。值为 true 显示默认关闭按钮，值为 false 不显示关闭按钮。值类型为 string 则直接显示值，如：“关闭”。值类型为 TNode，则表示呈现自定义按钮示例。TS 类型：`string | boolean | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
closeOnEscKeydown | Boolean | true | 按下 ESC 时是否触发抽屉关闭事件 | N
closeOnOverlayClick | Boolean | true | 点击蒙层时是否触发抽屉关闭事件 | N
confirmBtn | TNode | '确认' | 对话框“确认”按钮，可自定义。值为 '' 或 null 则不显示确认按钮。TS 类型：`string | ButtonProps | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
destroyOnClose | Boolean | false | 是否在关闭弹框的时候销毁弹框 | N
draggable | Boolean | false | 对话框是否可以拖拽（仅在非模态对话框时有效） | N
footer | TNode | true | 底部操作栏，默认会有“确认”和“取消”两个按钮。值为 true 显示默认操作按钮，值为 false 不显示任何内容，值类型为 TNode 表示自定义底部内容。TS 类型：`boolean | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
header | TNode | true | 头部内容。值为 true 显示空白头部，值为 false 不显示任何内容，值类型为 string 则直接显示值，值类型为 TNode 表示自定义头部内容。TS 类型：`string | boolean | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
mode | String | modal | 对话框类型，有三种：模态对话框、非模态对话框和普通对话框。弹出「模态对话框」时，只能操作对话框里面的内容，不能操作其他内容。弹出「非模态对话框」时，则可以操作页面内所有内容。「普通对话框」是指没有脱离文档流的对话框，可以在这个基础上开发更多的插件。可选值：modal/modeless/normal | N
placement | String | top | 对话框位置，内置两种：垂直水平居中显示 和 靠近顶部（top:20%）显示。可选值：top/center | N
preventScrollThrough | Boolean | true | 防止滚动穿透 | N
showOverlay | Boolean | true | 是否显示遮罩层 | N
theme | String | default | 对话框风格。可选值：default/info/warning/danger/success | N
top | String / Number | - | 用于弹框具体窗口顶部的距离，优先级大于 placement | N
visible | Boolean | true | 控制对话框是否显示 | N
defaultVisible | Boolean | true | 控制对话框是否显示。非受控属性 | N
width | String / Number | - | 对话框宽度，示例：320, '500px', '80%' | N
zIndex | Number | 2500 | 对话框层级 | N
onCancel | Function |  | 如果“取消”按钮存在，则点击“取消”按钮时触发，同时触发关闭事件。`(context: { e: MouseEvent }) => {}` | N
onClose | Function |  | 关闭事件，点击取消按钮、点击关闭按钮、点击蒙层、按下 ESC 等场景下触发。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/dialog/index.ts)。`(context: DialogCloseContext) => {}` | N
onCloseBtnClick | Function |  | 点击右上角关闭按钮时触发。`(context: { e: MouseEvent }) => {}` | N
onClosed | Function |  | 对话框消失动画效果结束后触发。`() => {}` | N
onConfirm | Function |  | 如果“确认”按钮存在，则点击“确认”按钮时触发，同时触发关闭事件。`(context: { e: MouseEvent }) => {}` | N
onEscKeydown | Function |  | 按下 ESC 时触发事件。`(context: { e: KeyboardEvent }) => {}` | N
onOpened | Function |  | 对话框弹出动画效果结束后触发。`() => {}` | N
onOverlayClick | Function |  | 如果蒙层存在，点击蒙层时触发。`(context: { e: MouseEvent }) => {}` | N


### DialogOptions
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
attach | String / Function | 'body' | 对话框挂载的节点。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：`AttachNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
className | String / Object / Array | - | 弹框类名。示例：'name1 name2' 或者 { name: true } 或者 ['className1', { className2: true }]。TS 类型：`ClassName`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
style | Object | - | 弹框 style 属性。TS 类型：`Styles`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
`Omit<TdDialogProps, 'attach'>` | - | - | 继承 `Omit<TdDialogProps, 'attach'>` 中的全部 API | N


### DialogInstance
名称 | 参数 | 返回值 | 描述
-- | -- | -- | --
destroy | - | - | 销毁弹框
hide | - | - | 隐藏弹框
show | - | - | 显示弹框
update | `(props: DialogOptions)` | - | 更新弹框内容


### dialog
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
options | - | - | TS 类型：`DialogOptions`

插件返回值：`DialogInstance`


### dialog.confirm
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
options | - | - | TS 类型：`DialogOptions`


### dialog.alert
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
options | Object | - | TS 类型：`Omit<DialogOptions, 'confirmBtn'>`