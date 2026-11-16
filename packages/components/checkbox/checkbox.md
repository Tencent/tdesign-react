:: BASE_DOC ::


### 最多选中的数量

{{ max }}

## API

### Checkbox Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
checkAll | Boolean | false | 用于标识是否为「全选选项」。单独使用无效，需在 CheckboxGroup 中使用 | N
checked | Boolean | false | 是否选中 | N
defaultChecked | Boolean | false | 是否选中。非受控属性 | N
children | TNode | - | 多选框内容，同 label。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
disabled | Boolean | undefined | 是否禁用组件。如果父组件存在 CheckboxGroup，默认值由 CheckboxGroup.disabled 控制。优先级：Checkbox.disabled > CheckboxGroup.disabled > Form.disabled | N
indeterminate | Boolean | false | 是否为半选 | N
label | TNode | - | 主文案。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
name | String | - | HTML 元素原生属性 | N
readonly | Boolean | undefined | 只读状态 | N
title | String | - | HTML 原生属性 | N
tooltipProps | \- | - | 透传 Tooltip 组件的全部特性。用于自定义悬浮气泡内容和样式，作用于 Checkbox 的勾选框本体。TS 类型：`TooltipProps`，[Tooltip API Documents](./tooltip?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts) | N
value | String / Number / Boolean | - | 多选框的值。TS 类型：`string \| number \| boolean` | N
onChange | Function |  | TS 类型：`(checked: boolean, context: { e: ChangeEvent }) => void`<br/>值变化时触发 | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击时触发，一般用于外层阻止冒泡场景 | N


### CheckboxGroup Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
disabled | Boolean | undefined | 是否禁用组件。优先级：Form.disabled < CheckboxGroup.disabled < Checkbox.disabled | N
max | Number | undefined | 支持最多选中的数量 | N
name | String | - | 统一设置内部复选框 HTML 属性 | N
options | Array | - | 以配置形式设置子元素。示例1：`['北京', '上海']` ，示例2: `[{ label: '全选', checkAll: true }, { label: '上海', value: 'shanghai' }]`。checkAll 值为 true 表示当前选项为「全选选项」。TS 类型：`Array<CheckboxOption>` `type CheckboxOption = string \| number \| CheckboxOptionObj` `interface CheckboxOptionObj extends TdCheckboxProps { text?: string; }`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts) | N
readonly | Boolean | undefined | 只读状态 | N
value | Array | [] | 选中值。TS 类型：`T` `type CheckboxGroupValue = Array<string \| number \| boolean>`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts) | N
defaultValue | Array | [] | 选中值。非受控属性。TS 类型：`T` `type CheckboxGroupValue = Array<string \| number \| boolean>`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts) | N
onChange | Function |  | TS 类型：`(value: T, context: CheckboxGroupChangeContext) => void`<br/>值变化时触发，`context.current` 表示当前变化的数据值，如果是全选则为空；`context.type` 表示引起选中数据变化的是选中或是取消选中；`context.option` 表示当前变化的数据项；`context.current` 即将废弃，请勿使用。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/checkbox/type.ts)。<br/>`interface CheckboxGroupChangeContext { e: ChangeEvent; current: CheckboxOption \| TdCheckboxProps; option: CheckboxOption \| TdCheckboxProps; type: 'check' \| 'uncheck' }`<br/> | N
