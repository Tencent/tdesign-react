:: BASE_DOC ::

## API
### Text Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 文本内容，同content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
code | Boolean | false | 是否添加代码样式 | N
copyable | Boolean / Object | false | 是否可复制，可通过配置参数自定义复制操作的具体功能和样式。TS 类型：`boolean \| TypographyCopyable` | N
delete | Boolean | false | 是否添加删除线样式 | N
disabled | Boolean | false | 是否添加不可用样式 | N
ellipsis | Boolean / Object | false | 是否省略展示，可通过配置参数自定义省略操作的具体功能和样式。TS 类型：`boolean \| TypographyEllipsis` | N
italic | Boolean | false | 文本是否为斜体 | N
keyboard | Boolean | false | 是否添加键盘样式 | N
mark | String / Boolean | false | 是否添加标记样式，默认为黄色，可通过配置颜色修改标记样式，如#0052D9 | N
strong | Boolean | false | 文本是否加粗 | N
theme | String | - | 主题。可选项：primary/secondary/success/warning/error | N
underline | Boolean | false | 是否添加下划线样式 | N

### Title Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 段落内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | 段落内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
ellipsis | Boolean / Object | false | 是否省略展示，可通过配置参数自定义省略操作的具体功能和样式。TS 类型：`boolean \| TypographyEllipsis` | N
level | String | h1 | 标题等级。可选项：h1/h2/h3/h4/h5/h6 | N

### Paragraph Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | TNode | - | 段落内容，同 content。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
content | TNode | - | 段落内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
ellipsis | Boolean / Object | false | 是否省略展示，可通过配置参数自定义省略操作的具体功能和样式。TS 类型：`boolean \| TypographyEllipsis` | N

### TypographyEllipsis

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
collapsible | Boolean | true | 展开后是否可以重新收起 | N
expandable | Boolean | true | 是否可展开 | N
row | Number | 1 | 省略配置默认展示行数 | N
suffix | TElement | - | 自定义省略触发元素，一般用于自定义折叠图标。TS 类型：`TNode<{ expanded: boolean }>`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
tooltipProps | Object | - | 光标在省略图标上出现的tooltip的配置。TS 类型：`tooltipProps`，[Tooltip API Documents](./tooltip?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/typography/type.ts) | N
onExpand | Function |  | TS 类型：`(expanded:boolean) => void`<br/>点击省略按钮的回调 | N

### TypographyCopyable

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
 text | String | - | 复制的文本内容，默认为全部文本 | N
suffix | TElement | - | 自定义复制触发元素，一般用于自定义复制图标。TS 类型：`TNode<{ copied: boolean }>`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
tooltipProps | Object | - | 光标在复制图标上出现的tooltip的配置。TS 类型：`tooltipProps`，[Tooltip API Documents](./tooltip?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/src/typography/type.ts) | N
onCopy | Function |  | TS 类型：`() => void`<br/>点击复制按钮的回调 | N