:: BASE_DOC ::

## API

### DropdownMenu Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
closeOnClickOverlay | Boolean | true | 是否在点击遮罩层后关闭菜单 | N
direction | String | down | 菜单展开方向。可选项：down/up | N
duration | String / Number | 200 | 动画时长 | N
showOverlay | Boolean | true | 是否显示遮罩层 | N
zIndex | Number | - | 菜单栏 z-index 层级，默认为 1600 | N


### DropdownItem Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
disabled | Boolean | false | 是否禁用操作项 | N
footer | TElement | - | 底部。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
icon | TNode | undefined | 自定义菜单子项图标，值为 `undefined` 表示使用默认图标。[面板打开时的图标，面板关闭时的图标]。TS 类型：`TNode \| TNode[] \| undefined`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
keepLabelActive | Boolean | false | `1.0.1`。是否保持标题高亮（含菜单收起态），仅多选场景生效 | N
keys | Object | - | 用来定义 value / label / disabled 在 `options` 中对应的字段别名。TS 类型：`KeysType`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
label | String | - | 标题 | N
multiple | Boolean | false | 是否多选 | N
options | Array | [] | 选项数据。TS 类型：`Array<DropdownOption>` `interface DropdownOption { label: string; disabled?: boolean; value: DropdownValue; }`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dropdown-menu/type.ts) | N
optionsColumns | String / Number | 1 | 选项分栏（1-3） | N
placement | String | left | 复选框和内容相对位置，仅单选菜单栏有效。可选项：left/right | N
value | String / Number / Array | undefined | 选中值。TS 类型：`DropdownValue ` `type DropdownValue = string \| number \| Array<DropdownValue>;`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dropdown-menu/type.ts) | N
defaultValue | String / Number / Array | undefined | 选中值。非受控属性。TS 类型：`DropdownValue ` `type DropdownValue = string \| number \| Array<DropdownValue>;`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/dropdown-menu/type.ts) | N
onChange | Function |  | TS 类型：`(value: DropdownValue) => void`<br/>值改变时触发 | N
onClose | Function |  | TS 类型：`() => void`<br/>`0.21.2`。关闭时触发 | N
onClosed | Function |  | TS 类型：`() => void`<br/>`0.21.2`。关闭且动画结束后触发 | N
onConfirm | Function |  | TS 类型：`(value: DropdownValue) => void`<br/>点击确认时触发 | N
onOpen | Function |  | TS 类型：`() => void`<br/>`0.21.2`。打开时触发 | N
onOpened | Function |  | TS 类型：`() => void`<br/>`0.21.2`。打开且动画结束后触发 | N
onReset | Function |  | TS 类型：`(value: DropdownValue) => void`<br/>点击重置时触发 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-dropdown-menu-active-color | @brand-color | -
--td-dropdown-menu-background | @bg-color-container | -
--td-dropdown-menu-color | @text-color-primary | -
--td-dropdown-menu-disabled-color | @text-color-disabled | -
--td-dropdown-menu-font | @font-body-medium | -
--td-dropdown-menu-icon-size | 24px | -
--td-dropdown-body-max-height | 280px | -
--td-dropdown-menu-bg-color | @bg-color-container | -
