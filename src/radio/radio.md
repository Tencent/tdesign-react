:: BASE_DOC ::

### 动态自适应

当radio内容动态变化时，滑块自动调整

{{ dynamic }}


## API
### Radio Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
allowUncheck | Boolean | false | 是否允许取消选中 | N
checked | Boolean | false | 是否选中 | N
defaultChecked | Boolean | false | 是否选中。非受控属性 | N
children | TNode | - | 单选内容，同 label。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
disabled | Boolean | undefined | 是否为禁用态 | N
label | TNode | - | 主文案。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
name | String | - | HTML 元素原生属性 | N
value | String / Number / Boolean | false | 单选按钮的值。TS 类型：`T` | N
onChange | Function |  | TS 类型：`(checked: boolean, context: { e: ChangeEvent }) => void`<br/>选中状态变化时触发 | N

### RadioGroup Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
disabled | Boolean | undefined | 是否禁用全部子单选框 | N
name | String | - | HTML 元素原生属性 | N
options | Array | - | 单选组件按钮形式。RadioOption 数据类型为 string 或 number 时，表示 label 和 value 值相同。TS 类型：`Array<RadioOption>` `type RadioOption = string \| number \| RadioOptionObj` `interface RadioOptionObj { label?: string \| TNode; value?: string \| number; disabled?: boolean }`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/radio/type.ts) | N
size | String | medium | 组件尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | String / Number / Boolean | - | 选中的值。TS 类型：`T` | N
defaultValue | String / Number / Boolean | - | 选中的值。非受控属性。TS 类型：`T` | N
variant | String | outline | 单选组件按钮形式。可选项：outline/primary-filled/default-filled | N
onChange | Function |  | TS 类型：`(value: T, context: { e: ChangeEvent }) => void`<br/>选中值发生变化时触发 | N
