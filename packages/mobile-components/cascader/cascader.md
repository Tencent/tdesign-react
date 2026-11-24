:: BASE_DOC ::

## API

### Cascader Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
checkStrictly | Boolean | false | 父子节点选中状态不再关联，可各自选中或取消 | N
closeBtn | TNode | true | 关闭按钮。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
filter | Function | - |  自定义过滤函数。返回 true 表示匹配，未设置时使用内置匹配规则：对路径中所有 label 拼接后做大小写不敏感的 includes 匹配。TS 类型：`CascaderFilterFunction ` `type CascaderFilterFunction<CascaderOption extends TreeOptionData = TreeOptionData> = (keyword: string, option: CascaderOption, path: CascaderOption[]) => boolean`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/cascader/type.ts) | N
filterPlaceholder | String | - | 搜索框占位符描述文本 | N
filterable | Boolean | false | 是否可搜索，开启后顶部会展示一个搜索框  | N
header | TElement | - | `0.21.2`。头部。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
keys | Object | - | 用来定义 value / label / children / disabled 在 `options` 中对应的字段别名。TS 类型：`CascaderKeysType` `type CascaderKeysType = TreeKeysType`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/cascader/type.ts) | N
load | Function | - | 加载子树数据的方法（仅当节点 children 为 true 时生效）。TS 类型：`(node: CascaderOption) => Promise<Array<CascaderOption>>` | N
loadCompleted | Boolean | false | 是否完成异步加载 | N
middleContent | TElement | - | `0.21.2`。中间内容。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
options | Array | [] | 可选项数据源。TS 类型：`Array<CascaderOption>` | N
overlayProps | Object | {} | `0.21.2`。遮罩层的属性，透传至 overlay。TS 类型：`OverlayProps`，[Overlay API Documents](./overlay?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/cascader/type.ts) | N
placeholder | String | - | 未选中时的提示文案。组件内置默认值为：'选择选项' | N
subTitles | Array | [] | 每级展示的次标题。TS 类型：`Array<string>` | N
theme | String | step | 展示风格。可选项：step/tab | N
title | TNode | - | 标题。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
value | String / Number | - | 选项值 | N
defaultValue | String / Number | - | 选项值。非受控属性 | N
visible | Boolean | false | 是否展示 | N
onChange | Function |  | TS 类型：`(value: string \| number, selectedOptions: CascaderOption[]) => void`<br/>值发生变更时触发 | N
onClose | Function |  | TS 类型：`(trigger: CascaderTriggerSource) => void`<br/>关闭时触发。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/cascader/type.ts)。<br/>`type CascaderTriggerSource = 'overlay' \| 'close-btn' \| 'finish'`<br/> | N
onPick | Function |  | TS 类型：`(context: { value: string \| number, label: string, index: number, level: number }) => void`<br/>选择后触发 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-cascader-active-color | @brand-color | -
--td-cascader-bg-color | @bg-color-container | -
--td-cascader-border-color | @component-stroke | -
--td-cascader-disabled-color | @text-color-disabled | -
--td-cascader-options-height | 320px | -
--td-cascader-options-title-color | @text-color-placeholder | -
--td-cascader-step-arrow-color | @text-color-placeholder | -
--td-cascader-step-dot-size | 8px | -
--td-cascader-step-height | 44px | -
--td-cascader-title-color | @text-color-primary | -
--td-cascader-title-font | @font-title-large | -
--td-cascader-title-padding | @spacer-2 | -
