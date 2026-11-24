:: BASE_DOC ::

## API

### Drawer Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
attach | String / Function | - | 抽屉挂载的节点，默认挂在组件本身的位置。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：`AttachNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
closeOnOverlayClick | Boolean | true | 点击蒙层时是否触发抽屉关闭事件 | N
destroyOnClose | Boolean | false | 抽屉关闭时是否销毁节点 | N
footer | TElement | - | 抽屉的底部。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
items | Array | - | 抽屉里的列表项。TS 类型：`DrawerItem[] ` `interface DrawerItem { title: string; icon?: TNode; }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/drawer/type.ts) | N
overlayProps | Object | {} | 遮罩层的属性，透传至 overlay。TS 类型：`OverlayProps`，[Overlay API Documents](./overlay?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/drawer/type.ts) | N
placement | String | right | 抽屉方向。可选项：left/right | N
showOverlay | Boolean | true | 是否显示遮罩层 | N
title | TNode | - | 抽屉的标题。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
visible | Boolean | false | 组件是否可见 | N
zIndex | Number | - | 抽屉层级，样式默认为 1500 | N
onClose | Function |  | TS 类型：`(trigger: DrawerTriggerSource) => void`<br/>关闭时触发。。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/drawer/type.ts)。<br/>`type DrawerTriggerSource = 'overlay'`<br/> | N
onItemClick | Function |  | TS 类型：`( index: number, item: DrawerItem, context: { e: MouseEvent }) => void`<br/>点击抽屉里的列表项 | N
onOverlayClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>如果蒙层存在，点击蒙层时触发 | N

### DrawerOptions

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 抽屉类名，示例：'t-class-drawer-first t-class-drawer-second' | N
style | Object | - | 弹框 style 属性，输入 [CSSStyleDeclaration.cssText](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText)。TS 类型：`Styles`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
`Omit<DrawerProps, 'attach'>` | \- | - | 继承 `Omit<DrawerProps, 'attach'>` 中的全部属性 | N

### DrawerInstance

名称 | 参数 | 返回值 | 描述
-- | -- | -- | --
destroy | \- | \- | 销毁抽屉
hide | \- | \- | 隐藏抽屉
show | \- | \- | 显示抽屉
update | `(props: DrawerOptions)` | \- | 更新抽屉内容

### drawer 或 DrawerPlugin

参数名称 | 参数类型 | 参数默认值 | 参数描述
-- | -- | -- | --
options | \- | - | TS 类型：`DrawerOptions`

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-drawer-bg-color | @bg-color-container | -
--td-drawer-border-color | @border-color | -
--td-drawer-footer-padding-bottom | 20px | -
--td-drawer-hover-color | @bg-color-secondarycontainer | -
--td-drawer-item-icon-size | 24px | -
--td-drawer-item-padding | 16px | -
--td-drawer-sidebar-height | 70vh | -
--td-drawer-title-color | @drawer-title-color | -
--td-drawer-title-font | @font-title-large | -
--td-drawer-title-padding | 24px 16px 8px | -
--td-drawer-width | 280px | -
