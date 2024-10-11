:: BASE_DOC ::

## API
### Chat Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
data | Array | - | 聊天列表数据。TS 类型：`Array<TdChatItemProps>`。 | N
layout | enum | normal | 布局：两侧对齐，左对齐。可选项：both/single | N
clearHistory | Boolean | true | 是否显示清空历史。 | N
reverse | Boolean | true | 是否表现为倒序。 | N
textLoading | Boolean | false | 新消息是否处于加载状态，加载状态默认显示骨架屏，`和data搭配使用才会生效`,接口请求返回时请置为false | Y
onClear | Function |  (context: { e: MouseEvent }) => void | 点击清空历史按钮回调， | N
onScroll | Function |  (context: { e: Event }) => void | 滚动事件 | N
### Chat Events

名称 | 参数 | 描述 | 说明 | 必传
-- | -- | -- | -- | --
clear | (context: { e: MouseEvent }) => void |点击清空历史按钮弹窗确认 | N
scroll | (context: { e: Event }) => void |滚动事件 | N

### TdChatItemProps数据类型
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
name | String  | - | 昵称。TS 类型：`string \| TNode`。| N
avatar | String | - | 头像。TS 类型：`string \| AvatarProps \| TNode`，
datetime | String  | - | 时间。TS 类型：`string \| TNode`。| N
content | String  | - | 聊天内容。TS 类型：`string` | Y
role | enum | - | 角色：用户、助手、错误、模型切换。可选项：user/assistant/error/model-change/system  | Y

### chat 组件实例方法

名称 | 参数 | 返回值 | 描述
-- | -- | -- | --
scrollToBottom | `(params: { behavior: 'auto' \| 'smooth'})` | \- | behavior默认值为smooth。滚动到底部。示例：`scrollToBottom({ behavior: 'smooth' })`