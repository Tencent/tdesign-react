:: BASE_DOC ::

## API

### Textarea Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
allowInputOverMax | Boolean | false | 超出 `maxlength` 或 `maxcharacter` 之后是否还允许输入 | N
autofocus | Boolean | false | 自动聚焦，拉起键盘 | N
autosize | Boolean / Object | false | 高度自动撑开。 autosize = true 表示组件高度自动撑开，同时，依旧允许手动拖高度。如果设置了 autosize.maxRows 或者 autosize.minRows 则不允许手动调整高度。TS 类型：`boolean \| { minRows?: number; maxRows?: number }` | N
bordered | Boolean | false | 是否显示外边框 | N
cursorColor | String | #0052d9 | 光标颜色 | N
disabled | Boolean | undefined | 是否禁用文本框 | N
indicator | Boolean | false | 显示文本计数器，如 0/140。当 `maxlength < 0 && maxcharacter < 0` 成立时， indicator无效 | N
label | TNode | - | 左侧文本。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
layout | String | horizontal | 标题输入框布局方式。可选项：vertical/horizontal | N
maxcharacter | Number | - | 用户最多可以输入的字符个数，一个中文汉字表示两个字符长度 | N
maxlength | String / Number | - | 用户最多可以输入的字符个数。TS 类型：`string \| number` | N
name | String | - | 名称，HTML 元素原生属性 | N
placeholder | String | undefined | 占位符 | N
readonly | Boolean | undefined | 只读状态 | N
value | String / Number | - | 文本框值。TS 类型：`TextareaValue` `type TextareaValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/textarea/type.ts) | N
defaultValue | String / Number | - | 文本框值。非受控属性。TS 类型：`TextareaValue` `type TextareaValue = string \| number`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/textarea/type.ts) | N
onBlur | Function |  | TS 类型：`(value: TextareaValue, context: { e: FocusEvent }) => void`<br/>失去焦点时触发 | N
onChange | Function |  | TS 类型：`(value: TextareaValue, context?: { e?: InputEvent }) => void`<br/>输入内容变化时触发 | N
onCompositionend | Function |  | TS 类型：`(value: string, context: { e: CompositionEvent }) => void`<br/>中文输入结束时触发 | N
onCompositionstart | Function |  | TS 类型：`(value: string, context: { e: CompositionEvent }) => void`<br/>中文输入开始时触发 | N
onFocus | Function |  | TS 类型：`(value: TextareaValue, context : { e: FocusEvent }) => void`<br/>获得焦点时触发 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-textarea-background-color | @bg-color-container | -
--td-textarea-border-color | @component-border | -
--td-textarea-border-radius | @radius-default | -
--td-textarea-disabled-text-color | @text-color-disabled | -
--td-textarea-indicator-text-color | @text-color-placeholder | -
--td-textarea-label-color | @text-color-primary | -
--td-textarea-label-width | 64px | -
--td-textarea-padding | @textarea-vertical-padding @textarea-horizontal-padding | -
--td-textarea-placeholder-color | @text-color-placeholder | -
--td-textarea-text-color | @text-color-primary | -
