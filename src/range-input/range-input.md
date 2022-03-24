:: BASE_DOC ::

## API
### RangeInput Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
disabled | Boolean | false | 是否禁用范围输入框 | N
format | Array / Function | - | 指定输入框展示值的格式。TS 类型：`InputFormatType | Array<InputFormatType>` | N
inputProps | Object / Array | - | 透传 Input 输入框组件全部属性，数组第一项表示第一个输入框属性，第二项表示第二个输入框属性。示例：`[{ label: 'A', name: 'A-name' }, { label: 'B',  name: 'B-name' }]`。TS 类型：`InputProps | Array<InputProps>`，[Input API Documents](./input?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts) | N
label | TNode | - | 左侧文本。TS 类型：`string | TNode<{ position: RangeInputPosition }> | Array<string | TNode>` `type RangeInputPosition = 'first' | 'second'`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts) | N
placeholder | String / Array | - | 占位符，示例：'请输入' 或者 ['开始日期', '结束日期']。TS 类型：`string | Array<string>` | N
readonly | Boolean | false | 只读状态 | N
separator | TNode | '-' | 范围分隔符。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
status | String | - | 输入框状态。可选项：success/warning/error | N
tips | TNode | - | 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式。TS 类型：`string | TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
value | Array | - | 范围输入框的值。TS 类型：`RangeInputValue` `type RangeInputValue = Array<InputValue>`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts) | N
defaultValue | Array | - | 范围输入框的值。非受控属性。TS 类型：`RangeInputValue` `type RangeInputValue = Array<InputValue>`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/range-input/type.ts) | N
onChange | Function |  | TS 类型：`(value: RangeInputValue, context?: { e?: InputEvent | MouseEvent; position?: RangeInputPosition }) => void`<br/>范围输入框值发生变化时触发 | N
