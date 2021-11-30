
### Message Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
closeBtn | TNode | undefined | 关闭按钮，可以自定义。值为 true 显示默认关闭按钮，值为 false 不显示关闭按钮。值类型为 string 则直接显示值，如：“关闭”。值类型为 TNode，则表示呈现自定义按钮示例。TS 类型：`string | boolean | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
content | TNode | - | 用于自定义消息弹出内容。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
duration | Number | 3000 | 消息显示时长，单位：毫秒。值为 0 表示永久显示 | N
icon | TNode | true | 消息提醒前面的图标，可以自定义。TS 类型：`boolean | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
theme | String | info | 消息组件风格。可选值：info/success/warning/error/question/loading。TS 类型：`MessageThemeList`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/message/index.ts) | N
onCloseBtnClick | Function |  | 当关闭按钮存在时，用户点击关闭按钮触发。`(context: { e: MouseEvent }) => {}` | N
onDurationEnd | Function |  | 计时结束后触发。`() => {}` | N


### MessageOptions
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
attach | String / Function | 'body' | 指定弹框挂载的父节点。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：`AttachNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
offset | Array | - | 相对于 placement 的偏移量，示例：[-10, 20] 或 ['10em', '8rem']。TS 类型：`Array<string | number>` | N
placement | String | top | 弹出消息位置。可选值：center/top/left/right/bottom/top-left/top-right/bottom-left/bottom-right。TS 类型：`MessagePlacementList`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/message/index.ts) | N
zIndex | Number | 5000 | 消息层级 | N
TdMessageProps | - | - | 继承 `TdMessageProps` 中的全部 API | N


### this.$message
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
theme | String | - | 消息类型。TS 类型：`MessageThemeList`
message | String / Object | - | 消息内容。TS 类型：`string | MessageOptions`
duration | Number | 3000 | 消息显示时长，单位：毫秒。值为 0 表示永久显示


### this.$message.info
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
message | String / Object | - | 消息内容。TS 类型：`string | MessageInfoOptions`。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/message/index.ts)
duration | Number | 3000 | 消息显示时长，单位：毫秒。值为 0 表示永久显示


### this.$message.error
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
message | String / Object | - | 消息内容。TS 类型：`string | MessageInfoOptions`
duration | Number | 3000 | 消息显示时长，单位：毫秒。值为 0 表示永久显示


### this.$message.warning
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
message | String / Object | - | 消息内容。TS 类型：`string | MessageInfoOptions`
duration | Number | 3000 | 消息显示时长，单位：毫秒。值为 0 表示永久显示


### this.$message.success
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
message | String / Object | - | 消息内容。TS 类型：`string | MessageInfoOptions`
duration | Number | 3000 | 消息显示时长，单位：毫秒。值为 0 表示永久显示


### this.$message.loading
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
message | String / Object | - | 消息提醒内容。TS 类型：`string | MessageInfoOptions`
duration | Number | 3000 | 消息显示时长，单位：毫秒。值为 0 表示永久显示


### this.$message.question
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
message | String / Object | - | 消息内容。TS 类型：`string | MessageInfoOptions`
duration | Number | 3000 | 消息显示时长，单位：毫秒。值为 0 表示永久显示


### this.$message.closeAll
参数名称 | 参数类型 | 参数默认值 | 参数说明
-- | -- | -- | --
- | - | - | -