:: BASE_DOC ::

## API

### Tag Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 组件子元素，同 `content`。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
closable | Boolean | false | 标签是否可关闭 | N
content | TNode | - | 组件子元素。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
disabled | Boolean | false | 标签禁用态，失效标签不能触发事件。默认风格（theme=default）才有禁用态 | N
icon | TElement | undefined | 标签中的图标，可自定义图标呈现。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
maxWidth | String / Number | - | 标签最大宽度，宽度超出后会出现省略号。示例：'50px' / 80 | N
shape | String | square | 标签类型，有三种：方形、圆角方形、标记型。可选项：square/round/mark | N
size | String | medium | 标签尺寸。可选项：small/medium/large/extra-large | N
theme | String | default | 组件风格，用于描述组件不同的应用场景。可选项：default/primary/warning/danger/success | N
variant | String | dark | 标签风格变体。可选项：dark/light/outline/light-outline | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击时触发 | N
onClose | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>如果关闭按钮存在，点击关闭按钮时触发 | N


### CheckTag Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
checked | Boolean | - | 标签选中的状态，默认风格（theme=default）才有选中态 | N
defaultChecked | Boolean | - | 标签选中的状态，默认风格（theme=default）才有选中态。非受控属性 | N
children | TNode | - | 组件子元素。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
closable | Boolean | false | 标签是否可关闭 | N
content | TNode | - | 组件子元素；传入数组时：[选中内容，非选中内容]。TS 类型：`string \| number \| string[] \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
disabled | Boolean | false | 标签禁用态，失效标签不能触发事件。默认风格（theme=default）才有禁用态 | N
icon | TElement | - | 标签中的图标，可自定义图标呈现。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
shape | String | square | 标签类型，有三种：方形、圆角方形、标记型。可选项：square/round/mark | N
size | String | medium | 标签尺寸。可选项：small/medium/large。TS 类型：`SizeEnum`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
variant | String | dark | 标签风格变体。可选项：dark/light/outline/light-outline | N
onChange | Function |  | TS 类型：`(checked: boolean) => void`<br/>状态切换时触发 | N
onClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>点击标签时触发 | N
onClose | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>如果关闭按钮存在，点击关闭按钮时触发 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-tag-checked-dark-disabled-color | @font-white-2 | -
--td-tag-checked-disabled-background-color | @brand-color-disabled | -
--td-tag-checked-disabled-border-color | @brand-color-disabled | -
--td-tag-checked-disabled-color | @brand-color-disabled | -
--td-tag-checked-light-disabled-background-color | @brand-color-light | -
--td-tag-close-icon-color | @text-color-placeholder | -
--td-tag-danger-color | @error-color | -
--td-tag-danger-light-color | @error-color-1 | -
--td-tag-default-color | @bg-color-component | -
--td-tag-default-font-color | @text-color-primary | -
--td-tag-default-light-color | @bg-color-secondarycontainer | -
--td-tag-disabled-background-color | @bg-color-component-disabled | -
--td-tag-disabled-border-color | @component-border | -
--td-tag-disabled-color | @text-color-disabled | -
--td-tag-extra-large-font | @font-body-medium | -
--td-tag-extra-large-icon-size | 16px | -
--td-tag-extra-large-padding | 8px 15px | -
--td-tag-large-font | @font-body-medium | -
--td-tag-large-icon-size | 16px | -
--td-tag-large-padding | 2px 7px | -
--td-tag-mark-border-radius | @radius-round | -
--td-tag-medium-font | @font-body-small | -
--td-tag-medium-icon-size | 14px | -
--td-tag-medium-padding | 1px 7px | -
--td-tag-outline-bg-color | @bg-color-container | -
--td-tag-primary-color | @brand-color | -
--td-tag-primary-light-color | @brand-color-light | -
--td-tag-round-border-radius | @radius-round | -
--td-tag-small-font | @font-body-extraSmall | -
--td-tag-small-icon-size | 12px | -
--td-tag-small-padding | 1px 5px | -
--td-tag-square-border-radius | @radius-small | -
--td-tag-success-color | @success-color | -
--td-tag-success-light-color | @success-color-1 | -
--td-tag-warning-color | @warning-color | -
--td-tag-warning-light-color | @warning-color-1 | -
