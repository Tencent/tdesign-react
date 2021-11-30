
### Textarea Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
autofocus | Boolean | false | 自动聚焦 | N
disabled | Boolean | false | 是否禁用文本框 | N
maxlength | Number | undefined | 用户最多可以输入的字符个数 | N
name | String | - | 名称 | N
placeholder | String | - | 占位符 | N
readonly | Boolean | false | 文本框是否只读 | N
value | String / Number | - | 文本框值。TS 类型：`TextareaValue`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components//index.ts) | N
defaultValue | String / Number | - | 文本框值。非受控属性。TS 类型：`TextareaValue`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components//index.ts) | N
onBlur | Function |  | 失去焦点时触发。`(value: TextareaValue, context: { e: FocusEvent }) => {}` | N
onChange | Function |  | 输入内容变化时触发。`(value: TextareaValue, context?: { e?: InputEvent }) => {}` | N
onFocus | Function |  | 获得焦点时触发。`(value: TextareaValue, context: { e: FocusEvent }) => {}` | N
onInput | Function |  | 输入内容变化时触发。`(value: TextareaValue, context?: { e?: Event }) => {}` | N
onKeydown | Function |  | 键盘按下时触发。`(value: TextareaValue, context: { e: KeyboardEvent }) => {}` | N
onKeypress | Function |  | 按下字符键时触发（keydown -> keypress -> keyup）。`(value: TextareaValue, context: { e: KeyboardEvent }) => {}` | N
onKeyup | Function |  | 释放键盘时触发。`(value: TextareaValue, context: { e: KeyboardEvent }) => {}` | N