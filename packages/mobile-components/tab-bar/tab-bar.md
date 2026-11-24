:: BASE_DOC ::

## API

### TabBar Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
bordered | Boolean | true | 是否显示外边框 | N
children | TNode | - | 标签栏内容。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
fixed | Boolean | true | 是否固定在底部 | N
placeholder | Boolean | false | `0.21.1`。固定在底部时是否开启占位 | N
safeAreaInsetBottom | Boolean | true | 是否开启底部安全区适配 | N
shape | String | normal | 标签栏的形状。可选项：normal/round | N
split | Boolean | true | 是否需要分割线 | N
theme | String | normal | 选项风格。可选项：normal/tag | N
value | String / Number / Array | - | 当前选中标签的索引。TS 类型：`string \| number \| Array<string \| number>` | N
defaultValue | String / Number / Array | - | 当前选中标签的索引。非受控属性。TS 类型：`string \| number \| Array<string \| number>` | N
zIndex | Number | 1 | `0.21.1`。标签栏层级 | N
onChange | Function |  | TS 类型：`(context: { value: string \| number }) => void`<br/>选中标签切换时触发 | N


### TabBarItem Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
badgeProps | Object | - | 图标右上角提示信息。TS 类型：`BadgeProps`，[Badge API Documents](./badge?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/tab-bar/type.ts) | N
children | TNode | - | 标签内容。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
icon | TElement | - | 图标名称。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
subTabBar | Array | - | 二级菜单。TS 类型：`SubTabBarItem[] ` `interface SubTabBarItem { value: string; label: string }`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/tab-bar/type.ts) | N
value | String / Number | - | 标识符 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-tab-bar-bg-color | @bg-color-container | -
--td-tab-bar-border-color | @border-color | -
--td-tab-bar-round-shadow | @shadow-3 | -
--td-tab-bar-active-bg | @brand-color-light | -
--td-tab-bar-active-color | @brand-color | -
--td-tab-bar-color | @text-color-primary | -
--td-tab-bar-height | 40px | -
--td-tab-bar-hover-bg-color | rgba(0, 0, 0, 0.05) | -
--td-tab-bar-spread-border-color | @border-color | -
--td-tab-bar-spread-shadow | @shadow-3 | -
