:: BASE_DOC ::

## API
### ChatItem Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
actions | String / Slot / Function | - | 操作。TS 类型：`Array<TNode>`。 | N
name | String / Slot / Function | - | 昵称。TS 类型：`string \| TNode`。 | N
avatar | String / Object / Slot / Function | - | 头像。TS 类型：`string \| AvatarProps \| TNode`，
datetime | String / Slot / Function | - | 时间。TS 类型：`string \| TNode`。| N
variant | enum | text | 气泡框样式，基础、线框、文字。可选项：base/outline/text。| N
content | String / Slot / Function | - | 聊天内容。TS 类型：`string` | Y
role | enum | - | 角色：用户、助手、错误、模型切换、系统消息。可选项：user/assistant/error/model-change/system | Y
textLoading | Boolean | false | 新消息是否处于加载状态，加载状态默认显示骨架屏，接口请求返回数据时请将新消息加载状态置为false | Y

