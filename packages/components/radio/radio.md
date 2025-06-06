:: BASE_DOC ::

## API

### Radio Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
allowUncheck | Boolean | false | 是否允许取消选中 | N
checked | Boolean | false | 是否选中 | N
defaultChecked | Boolean | false | 是否选中。非受控属性 | N
children | TNode | - | 单选内容，同 label。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
disabled | Boolean | undefined | 是否为禁用态。如果存在父组件 RadioGroup，默认值由 RadioGroup.disabled 控制。优先级：Radio.disabled > RadioGroup.disabled | N
label | TNode | - | 主文案。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
name | String | - | HTML 元素原生属性 | N
readonly | Boolean | undefined | 只读状态 | N
value | String / Number / Boolean | undefined | 单选按钮的值。TS 类型：`T` | N
onChange | Function |  | TS 类型：`(checked: boolean, context: { e: ChangeEvent }) => void`<br/>选中状态变化时触发 | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击时触发，一般用于外层阻止冒泡场景 | N


### RadioGroup Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
allowUncheck | Boolean | false | 是否允许取消选中 | N
disabled | Boolean | undefined | 是否禁用全部子单选框。优先级：Radio.disabled > RadioGroup.disabled | N
name | String | - | HTML 元素原生属性 | N
options | Array | - | 单选组件按钮形式。RadioOption 数据类型为 string 或 number 时，表示 label 和 value 值相同。TS 类型：`Array<RadioOption>` `type RadioOption = string \| number \| RadioOptionObj` `interface RadioOptionObj { label?: string \| TNode; value?: string \| number \| boolean; disabled?: boolean }`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/radio/type.ts) | N
readonly | Boolean | undefined | 只读状态 | N
theme | String | radio | 组件风格,可选项：radio/button。 | N
size | String | medium | 组件尺寸【讨论中】。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
value | String / Number / Boolean | - | 选中的值。TS 类型：`T` `type RadioValue = string \| number \| boolean`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/radio/type.ts) | N
defaultValue | String / Number / Boolean | - | 选中的值。非受控属性。TS 类型：`T` `type RadioValue = string \| number \| boolean`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/radio/type.ts) | N
variant | String | outline | 单选组件按钮形式。可选项：outline/primary-filled/default-filled | N
onChange | Function |  | TS 类型：`(value: T, context: { e: ChangeEvent; name?: string }) => void`<br/>选中值发生变化时触发, `context.name` 指 RadioGroup 的 name 属性 | N
