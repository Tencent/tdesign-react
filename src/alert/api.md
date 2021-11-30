
### Alert Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
close | TNode | false | 关闭按钮。值为 true 则显示默认关闭按钮；值为 false 则不显示按钮；值类型为 string 则直接显示；值类型为 Function 则可以自定关闭按钮。TS 类型：`string | boolean | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
icon | TElement | - | 图标。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
maxLine | Number | 0 | 内容显示最大行数，超出的内容会折叠收起，用户点击后再展开。值为 0 表示不折叠 | N
message | TNode | - | 内容（子元素）。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
operation | TElement | - | 跟在告警内容后面的操作区。TS 类型：`TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
theme | String | info | 类型。可选值：success/info/warning/error | N
title | TNode | - | 标题。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
onClose | Function |  | 关闭按钮点击时触发。`(context: { e: MouseEvent }) => {}` | N
onClosed | Function |  | 告警提示框关闭动画结束后触发。`(context: { e: TransitionEvent }) => {}` | N