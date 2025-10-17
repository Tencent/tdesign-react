---
title: ChatMessage 对话消息体
description: 对话消息体
isComponent: true
usage: { title: '', description: '' }
spline: aigc
---

## 基础样式
### 气泡样式
对话消息气泡样式，分为基础、线框、文字，默认为文字

{{ base }}

### 可配置角色，头像，昵称，位置

{{ configure }}

### 消息状态
{{ status }}

## 消息内容渲染
### 内置支持的几种消息内容
通过配置 `message type`属性，可以渲染内置的几种消息内容：**文本格式内容**，**Markdown格式内容**、**思考过程**、**搜索结果**、**建议问题**、**附件列表**、**图片**, 通过`chatContentProps`属性来配置对应类型的属性
{{ content }}

### 消息内容自定义
如果需要自定义消息内容，可以通过`植入自定义渲染插槽`的方式实现，以下是引入了`tvision`自定义渲染`图表`组件的例子：
{{ custom }}

### 消息操作栏
消息底部操作栏，通过`植入插槽actionbar`的方式实现，可以直接使用`ChatActionBar`组件，也可以完全自定义实现
{{ action }}


## API
### ChatMessage Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
placement | String | left | 消息显示位置。可选项：left/right | N
variant | String | text | 消息气泡样式变体。可选项：base/outline/text | N
animation | String | skeleton | 加载动画类型。可选项：skeleton/moving/gradient/circle | N
name | String/ReactNode | - | 发送者名称 | N
avatar | String/ReactNode | - | 发送者头像 | N
datetime | String | - | 消息发送时间 | N
role | `"user" \| "assistant" \| "system"` | Y | 消息角色类型
status | `"pending" \| "streaming" \| "complete" \| "stop" \| "error"` | N | 消息状态
content | `UserMessageContent[] \| AIMessageContent[] \|  TextContent[]` | N | 消息内容
chatContentProps | Object | - | 消息内容属性配置。类型支持见 `chatContentProps` | N
actions | Array/Boolean | - | 操作按钮配置项`TdChatMessageActionName[]`，可配置操作按钮选项和顺序。数组可选项：'copy'/'good'/'bad'/'replay'/'share'  | N
handleActions | Object | - | 操作按钮处理函数 | N

#### UserMessageContent 内容类型支持
- 文本消息 (`TextContent`)
- 附件消息 (`AttachmentContent`)

#### AIMessageContent 内容类型支持
- 文本消息 (`TextContent`)
- Markdown 消息 (`MarkdownContent`)
- 搜索消息 (`SearchContent`)
- 建议消息 (`SuggestionContent`)
- 思考状态 (`ThinkingContent`)
- 图片消息 (`ImageContent`)
- 附件消息 (`AttachmentContent`)
- 自定义消息 (`AIContentTypeOverrides`)

几种类型都继承自`ChatBaseContent`，包含通用字段：
字段 | 类型 | 必传 | 默认值 | 说明
--|--|--|--|--
type | `ChatContentType` | Y | - | 内容类型标识（text/markdown/search等）
data | 泛型TData | Y | - | 具体内容数据，类型由type决定
status | `ChatMessageStatus \| ((currentStatus?: ChatMessageStatus) => ChatMessageStatus)` | N | - | 内容状态或状态计算函数
id | string | N | - | 内容块唯一标识

每种类型的data字段有不同的结构，具体可参考下方表格，[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chatbot/core/type.ts#L17)

类型 | data 结构 | 说明
--|--|--
text | `string`  | 纯文本内容，支持基础文本展示
markdown | `string`  | Markdown格式内容，支持复杂排版渲染
image | <pre>{<br>  name?: string<br>  url?: string<br>  width?: number<br>  height?: number<br>}</pre>| 图片消息，支持尺寸配置
search | <pre>{<br>  title?: string<br>  references?: ReferenceItem[]<br>}</pre> | 搜索结果展示
suggestion | `SuggestionItem[]` | 固定为`complete` | 建议问题列表，用于快速交互
thinking | <pre>{<br>  text?: string<br>  title?: string<br>}</pre> | 思考状态提示，展示处理进度
attachment | `AttachmentItem[]` | 附件列表，支持多种文件类型


### 插槽

| 插槽名 | 说明 |
|--------|------|
| actionbar | 自定义操作栏 |
| `${type}-${index}` | 消息内容动态插槽，默认命名规则为`消息类型-内容索引`，如`chart-1`等 |