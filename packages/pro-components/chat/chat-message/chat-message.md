---
title: ChatMessage 对话消息体
description: 对话消息体组件，用于展示单条对话消息，支持用户消息和 AI 消息的多种内容类型渲染，包括文本、Markdown、思考过程、搜索结果、建议问题、图片、附件等，提供丰富的样式配置和交互能力。
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

### 消息内容操作回调

通过 `handleActions` 属性配置消息内容的操作回调，支持建议问题点击、搜索结果点击等交互。

{{ handle-actions }}

### 消息内容自定义
如果需要自定义消息内容，可以通过`植入自定义渲染插槽`的方式实现，以下示例实现了如何自定义用户消息，同时也通过引入了`tvision`自定义渲染`图表`组件演示如何自定义渲染AI消息内容：
{{ custom }}


### 消息底部操作栏
消息底部操作栏，通过`植入插槽actionbar`的方式实现，可以直接使用[`ChatActionBar`组件](/react-chat/components/chat-actionbar)，也可以完全自定义实现
{{ action }}

## API
### ChatMessage Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
placement | String | left | 消息显示位置。可选项：left/right | N
variant | String | text | 消息气泡样式变体。可选项：base/outline/text | N
animation | String | skeleton | 加载动画类型。可选项：skeleton/moving/gradient/circle | N
name | String/TNode | - | 发送者名称，支持字符串或自定义渲染 | N
avatar | String/TNode | - | 发送者头像，支持 URL 字符串或自定义渲染 | N
datetime | String/TNode | - | 消息发送时间 | N
role | String | - | 消息角色类型。可选项：user/assistant/system | Y
status | String | - | 消息状态。可选项：pending/streaming/complete/stop/error | N
content | AIMessageContent[] / UserMessageContent[] | - | 消息内容数组，根据 role 不同支持不同的内容类型，详见下方 `content 内容类型` 说明 | N
chatContentProps | Object | - | 消息内容属性配置，用于配置各类型内容的展示行为，[详见 `TdChatContentProps` 说明](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chat-message/type.ts) | N
actions | Array/Boolean | ['copy', 'good', 'bad', 'replay'] | 操作按钮配置。传入数组可自定义按钮顺序，可选项：copy/good/bad/replay/share；传入 false 隐藏操作栏 | N
handleActions | Object | - | 操作按钮处理函数对象，key 为操作名称（searchResult/searchItem/suggestion），value 为回调函数 `(data?: any) => void` | N
message | Object | - | 消息体对象（兼容旧版本），优先级低于直接传入的 role/content/status | N
id | String | - | 消息唯一标识 | N

### content 内容类型

#### UserMessageContent（用户消息）
用户消息支持以下内容类型：

类型 | data 结构 | 说明
--|--|--
text | `string` | 纯文本内容
attachment | `AttachmentItem[]` | 附件列表，AttachmentItem 包含：fileType（文件类型：image/video/audio/pdf/doc/ppt/txt）、name（文件名）、url（文件地址）、size（文件大小）、width/height（尺寸）、extension（扩展名）、isReference（是否为引用）、metadata（元数据）

#### AIMessageContent（AI 消息）
AI 消息支持更丰富的内容类型：

类型 | data 结构 | 说明
--|--|--
text | `string` | 纯文本内容，支持 strategy 字段（merge: 合并文本流，append: 追加独立内容块）
markdown | `string` | Markdown 格式内容，支持复杂排版渲染，支持 strategy 字段
thinking | <pre>{<br>  text?: string<br>  title?: string<br>}</pre> | 思考过程展示，text 为思考内容，title 为思考标题
reasoning | `AIMessageContent[]` | 推理过程展示，data 为嵌套的 AI 消息内容数组，支持递归渲染
image | <pre>{<br>  name?: string<br>  url?: string<br>  width?: number<br>  height?: number<br>}</pre> | 图片消息，支持尺寸配置
search | <pre>{<br>  title?: string<br>  references?: ReferenceItem[]<br>}</pre> | 搜索结果展示，ReferenceItem 包含：title（标题）、icon（图标）、type（类型）、url（链接）、content（内容）、site（来源站点）、date（日期）
suggestion | `SuggestionItem[]` | 建议问题列表，用于快速交互，SuggestionItem 包含：title（显示文本）、prompt（实际发送内容），状态固定为 complete
attachment | `AttachmentItem[]` | 附件列表，结构同 UserMessageContent 的 attachment
自定义类型 | - | 支持通过 AIContentTypeOverrides 扩展自定义内容类型

**通用字段说明**：所有内容类型都继承自 `ChatBaseContent`，包含以下通用字段：
- `type`：内容类型标识（必传）
- `data`：具体内容数据（必传），类型由 type 决定
- `id`：内容块唯一标识（可选）
- `status`：内容状态（可选），可选项：pending/streaming/complete/stop/error
- `strategy`：内容合并策略（可选，仅部分类型支持），可选项：merge（合并）/append（追加）
- `ext`：扩展字段（可选），用于存储自定义数据

### chatContentProps 配置

用于配置各类型内容的展示行为和交互逻辑：

#### markdown 配置

名称 | 类型 | 默认值 | 说明
-- | -- | -- | --
options | Object | - | Cherry Markdown 配置项，支持 CherryOptions 的大部分配置（不包括 id/el/toolbars）
options.themeSettings | Object | - | 主题配置
options.themeSettings.codeBlockTheme | String | - | 代码块主题。可选项：light/dark

#### search 配置

名称 | 类型 | 默认值 | 说明
-- | -- | -- | --
useCollapse | Boolean | - | 是否使用折叠面板展示搜索结果
collapsed | Boolean | - | 是否默认折叠

#### thinking 配置

名称 | 类型 | 默认值 | 说明
-- | -- | -- | --
maxHeight | Number | - | 思考内容最大高度（px）
animation | String | - | 加载动画类型。可选项：skeleton/moving/gradient/circle
collapsed | Boolean | - | 是否默认折叠
layout | String | - | 布局样式。可选项：block/border

#### reasoning 配置

名称 | 类型 | 默认值 | 说明
-- | -- | -- | --
maxHeight | Number | - | 推理内容最大高度（px）
animation | String | - | 加载动画类型。可选项：skeleton/moving/gradient/circle
collapsed | Boolean | - | 是否默认折叠
layout | String | - | 布局样式。可选项：block/border

#### suggestion 配置

名称 | 类型 | 默认值 | 说明
-- | -- | -- | --
directSend | Boolean | - | 点击建议问题是否直接发送（不填充到输入框）

### 插槽

名称 | 说明
-- | --
actionbar | 自定义操作栏，可完全替换默认操作栏
`${type}-${index}` | 消息内容动态插槽，命名规则为 `消息类型-内容索引`，如 `chart-0`、`custom-1` 等，用于自定义渲染特定位置的内容块