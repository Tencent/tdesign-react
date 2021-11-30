
### Menu Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
collapsed | Boolean | false | 是否收起菜单 | N
expanded | Array | - | 展开的子菜单集合。TS 类型：`Array<MenuValue>` | N
defaultExpanded | Array | - | 展开的子菜单集合。非受控属性。TS 类型：`Array<MenuValue>` | N
expandMutex | Boolean | false | 同级别互斥展开 | N
expandType | String | normal | 二级菜单展开方式，平铺展开和浮层展开。可选值：normal/popup | N
logo | TElement | - | 站点 LOGO。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
operations | TElement | - | 导航操作区域。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
theme | String | light | 菜单风格。可选值：light/dark | N
value | String / Number | - | 激活菜单项。TS 类型：`MenuValue`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/menu/index.ts) | N
defaultValue | String / Number | - | 激活菜单项。非受控属性。TS 类型：`MenuValue`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/menu/index.ts) | N
width | String / Number / Array | '232px' | 菜单宽度。值类型为数组时，分别表示菜单展开和折叠的宽度。[ 展开时的宽度, 折叠时的宽度 ]，示例：['200px', '80px']。TS 类型：`string | number | Array<string | number>` | N
onChange | Function |  | 激活菜单项发生变化时触发。`(value: MenuValue) => {}` | N
onExpand | Function |  | 展开的菜单项发生变化时触发。`(value: Array<MenuValue>) => {}` | N


### HeadMenu Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
expanded | Array | - | 展开的子菜单集合。TS 类型：`Array<MenuValue>` | N
defaultExpanded | Array | - | 展开的子菜单集合。非受控属性。TS 类型：`Array<MenuValue>` | N
expandType | String | normal | 二级菜单展开方式，平铺展开和浮层展开。可选值：normal/popup | N
logo | TElement | - | 站点 LOGO。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
operations | TElement | - | 导航操作区域。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
theme | String | light | 可选值：light/dark | N
value | String / Number | - | 激活菜单项。TS 类型：`MenuValue`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/menu/index.ts) | N
defaultValue | String / Number | - | 激活菜单项。非受控属性。TS 类型：`MenuValue`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/menu/index.ts) | N
onChange | Function |  | 激活菜单项发生变化时触发。`(value: MenuValue) => {}` | N
onExpand | Function |  | 展开的菜单项发生变化时触发。`(value: Array<MenuValue>) => {}` | N


### Submenu Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
children | TNode | - | 菜单项内容，同 content。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
content | TNode | - | 菜单项内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
disabled | Boolean | - | 是否禁用菜单项展开/收起/跳转等功能 | N
icon | TElement | - | 菜单项图标。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
title | TNode | - | 二级菜单内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
value | String / Number | - | 菜单项唯一标识。TS 类型：`MenuValue` | N


### MenuItem Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
children | TNode | - | 菜单项内容，同 content。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
content | TNode | - | 菜单项内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
disabled | Boolean | - | 是否禁用菜单项展开/收起/跳转等功能 | N
href | String | - | 跳转链接 | N
icon | TElement | - | 图标。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
target | String | - | 链接或路由跳转方式。可选值：_blank/_self/_parent/_top | N
value | String / Number | - | 菜单项唯一标识。TS 类型：`MenuValue` | N
onClick | Function |  | 点击时触发。`(context: { e: MouseEvent }) => {}` | N


### MenuGroup Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
title | TNode | - | 菜单组标题。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
