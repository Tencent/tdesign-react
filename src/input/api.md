
### Input Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
autocomplete | Boolean | false | 是否开启自动填充功能 | N
autofocus | Boolean | false | 自动聚焦 | N
clearable | Boolean | false | 是否可清空 | N
disabled | Boolean | false | 是否禁用输入框 | N
maxlength | Number | undefined | 用户最多可以输入的字符个数 | N
name | String | - | 名称 | N
placeholder | String | - | 占位符 | N
prefixIcon | TElement | - | 组件前置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
readonly | Boolean | false | 输入框是否只读 | N
size | String | medium | 输入框尺寸。可选值：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
status | String | undefined | 输入框状态。可选值：success/warning/error | N
suffixIcon | TElement | - | 组件后置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
type | String | text | 输入框类型。可选值：text/number/url/tel/password/search/submit/hidden | N
value | String / Number | - | 输入框的值。TS 类型：`InputValue`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components//index.ts) | N
defaultValue | String / Number | - | 输入框的值。非受控属性。TS 类型：`InputValue`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components//index.ts) | N
onBlur | Function |  | 失去焦点时触发。`(value: InputValue, context: { e: FocusEvent }) => {}` | N
onChange | Function |  | 输入框值发生变化时触发。`(value: InputValue, context?: { e?: InputEvent | MouseEvent }) => {}` | N
onClear | Function |  | 清空按钮点击时触发。`(context: { e: MouseEvent }) => {}` | N
onEnter | Function |  | 回车键按下时触发。`(value: InputValue, context: { e: KeyboardEvent }) => {}` | N
onFocus | Function |  | 获得焦点时触发。`(value: InputValue, context: { e: FocusEvent }) => {}` | N
onInput | Function |  | 输入内容变化时触发。`(value: InputValue, context?: { e?: Event }) => {}` | N
onKeydown | Function |  | 键盘按下时触发。`(value: InputValue, context: { e: KeyboardEvent }) => {}` | N
onKeypress | Function |  | 按下字符键时触发（keydown -> keypress -> keyup）。`(value: InputValue, context: { e: KeyboardEvent }) => {}` | N
onKeyup | Function |  | 释放键盘时触发。`(value: InputValue, context: { e: KeyboardEvent }) => {}` | N