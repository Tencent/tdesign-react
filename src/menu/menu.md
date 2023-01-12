:: BASE_DOC ::

## API
### Menu Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
collapsed | Boolean | false | 是否收起菜单 | N
expandMutex | Boolean | false | 同级别互斥展开 | N
expandType | String | normal | 二级菜单展开方式，平铺展开和浮层展开。可选项：normal/popup | N
expanded | Array | [] | 子菜单展开的导航集合。TS 类型：`Array<MenuValue>` | N
defaultExpanded | Array | [] | 子菜单展开的导航集合。非受控属性。TS 类型：`Array<MenuValue>` | N
logo | TElement | - | 站点 LOGO。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
operations | TElement | - | 导航操作区域。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
theme | String | light | 菜单风格，有亮色模式和暗色模式两种。当 `theme = global` 时，模式随整个组件库；当 `theme = system` 时，模式跟随系统。⚠️ `global/system` 正在开发中，暂勿使用。可选项：light/dark/global/system | N
value | String / Number | - | 激活菜单项。TS 类型：`MenuValue` `type MenuValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/menu/type.ts) | N
defaultValue | String / Number | - | 激活菜单项。非受控属性。TS 类型：`MenuValue` `type MenuValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/menu/type.ts) | N
width | String / Number / Array | '232px' | 菜单宽度。值类型为数组时，分别表示菜单展开和折叠的宽度。[ 展开时的宽度, 折叠时的宽度 ]，示例：['200px', '80px']。TS 类型：`string \| number \| Array<string \| number>` | N
onChange | Function |  | TS 类型：`(value: MenuValue) => void`<br/>激活菜单项发生变化时触发 | N
onExpand | Function |  | TS 类型：`(value: Array<MenuValue>) => void`<br/>展开的菜单项发生变化时触发 | N

### HeadMenu Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
expandType | String | normal | 二级菜单展开方式，平铺展开和浮层展开。可选项：normal/popup | N
expanded | Array | [] | 展开的子菜单集合。TS 类型：`Array<MenuValue>` | N
defaultExpanded | Array | [] | 展开的子菜单集合。非受控属性。TS 类型：`Array<MenuValue>` | N
logo | TElement | - | 站点 LOGO。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
operations | TElement | - | 导航操作区域。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
theme | String | light | 可选项：light/dark | N
value | String / Number | - | 激活菜单项。TS 类型：`MenuValue` `type MenuValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/menu/type.ts) | N
defaultValue | String / Number | - | 激活菜单项。非受控属性。TS 类型：`MenuValue` `type MenuValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/menu/type.ts) | N
onChange | Function |  | TS 类型：`(value: MenuValue) => void`<br/>激活菜单项发生变化时触发 | N
onExpand | Function |  | TS 类型：`(value: Array<MenuValue>) => void`<br/>展开的菜单项发生变化时触发 | N

### Submenu Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 菜单项内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | 菜单项内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | - | 是否禁用菜单项展开/收起/跳转等功能 | N
icon | TElement | - | 菜单项图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
title | TNode | - | 二级菜单内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | String / Number | - | 菜单项唯一标识。TS 类型：`MenuValue` | N

### MenuItem Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 菜单项内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | 菜单项内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | - | 是否禁用菜单项展开/收起/跳转等功能 | N
href | String | - | 跳转链接 | N
icon | TElement | - | 图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
target | String | - | 链接或路由跳转方式。可选项：_blank/_self/_parent/_top | N
value | String / Number | - | 菜单项唯一标识。TS 类型：`MenuValue` | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击时触发 | N

### MenuGroup Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
title | TNode | - | 菜单组标题。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
