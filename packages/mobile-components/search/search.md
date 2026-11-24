:: BASE_DOC ::

## API

### Search Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
action | TNode | '' | 自定义右侧操作按钮文字。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
autocompleteOptions | Array | - | 【讨论中】联想词列表，如果不存在或长度为 0 则不显示联想框。可以使用函数 `label` 自定义联想词为任意内容；也可使用插槽 `option` 定义联想词内容，插槽参数为 `{ option: AutocompleteOption; index: number }`。如果 `group` 值为 `true` 则表示当前项为分组标题。TS 类型：`Array<AutocompleteOption>` `type AutocompleteOption = string \| { label: string \| TNode; group?: boolean }`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/search/type.ts) | N
center | Boolean | false | 是否居中 | N
clearTrigger | String | always | 清空图标触发方式，仅在输入框有值时有效。可选项：always / focus | N
clearable | Boolean | true | 是否启用清除控件 | N
cursorColor | String | #0052d9 | `0.21.2`。光标颜色 | N
disabled | Boolean | false | 是否禁用 | N
focus | Boolean | false | 是否聚焦 | N
leftIcon | TNode | 'search' | 左侧图标。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
maxcharacter | Number | - | 用户最多可以输入的字符个数，一个中文汉字表示两个字符长度。`maxcharacter` 和 `maxlength` 二选一使用 | N
maxlength | String / Number | - | 用户最多可以输入的文本长度，一个中文等于一个计数长度。默认为空，不限制输入长度。`maxcharacter` 和 `maxlength` 二选一使用 | N
placeholder | String | '' | 占位符 | N
readonly | Boolean | undefined | 只读状态 | N
resultList | Array | [] | 预览结果列表。TS 类型：`Array<string>` | N
shape | String | 'square' | 搜索框形状。可选项：square/round | N
suffixIcon | TElement | - | 已废弃。后置图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
value | String | - | 值 | N
defaultValue | String | - | 值。非受控属性 | N
onActionClick | Function |  | TS 类型：`({}) => void`<br/>点击右侧操作按钮文字时触发 | N
onBlur | Function |  | TS 类型：`(context: { value: string; e: FocusEvent }) => void`<br/>失去焦点时触发 | N
onChange | Function |  | TS 类型：`(value: string, context: { trigger: 'input-change' \| 'option-click' \| 'clear'; e?: InputEvent \| MouseEvent }) => void`<br/>搜索关键词发生变化时触发，可能场景有：搜索框内容发生变化、点击联想词 | N
onClear | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击清除时触发 | N
onFocus | Function |  | TS 类型：`(context: { value: string; e: FocusEvent }) => void`<br/>获得焦点时触发 | N
onSearch | Function |  | TS 类型：`(context?: { value: string; trigger: 'submit' \| 'option-click' \| 'clear'; e?: InputEvent \| MouseEvent }) => void`<br/>【讨论中】搜索触发，包含：手机键盘提交健、联想关键词点击、清空按钮点击等 | N
onSubmit | Function |  | TS 类型：`(context: { value: string; e: KeyboardEvent }) => void`<br/>提交时触发，如：手机键盘提交按钮点击 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-search-action-color | @brand-color | -
--td-search-bg-color | @bg-color-secondarycontainer | -
--td-search-clear-icon-color | @text-color-placeholder | -
--td-search-clear-icon-size | 24px | -
--td-search-cursor-color | @brand-color | -
--td-search-font | @font-body-large | -
--td-search-height | 40px | -
--td-search-icon-color | @text-color-placeholder | -
--td-search-icon-size | 24px | -
--td-search-label-color | @text-color-primary | -
--td-search-padding | 8px 12px | -
--td-search-placeholder-color | @text-color-placeholder | -
--td-search-result-high-light-color | @brand-color | -
--td-search-square-radius | @radius-default | -
--td-search-text-color | @text-color-primary | -
