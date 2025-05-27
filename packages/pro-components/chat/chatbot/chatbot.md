---
title: Chatbot 智能对话
description: 智能对话聊天组件，适用于需要快速集成智能客服、问答系统等的AI应用
isComponent: true
spline: navigation
---

## 基本用法

### 标准化集成
组件内置状态管理，SSE解析，自动处理消息内容渲染与交互逻辑，可开箱即用快速集成实现标准聊天界面。本示例演示了如何快速创建一个具备以下功能的智能对话组件：
  - 初始化预设消息
  - 预设消息内容渲染支持（markdown、搜索、思考、建议等）
  - 与服务端的SSE（Server-Sent Events）通信，支持流式消息响应
  - 自定义流式内容结构解析
  - 自定义请求参数处理
  - 常用消息操作处理及回调（复制、重试、点赞/点踩）
  - 支持手动触发填入prompt, 重新生成，发送消息等

{{ basic }}


### 组合式用法
可以通过 `useChat` Hook提供的对话引擎实例及状态控制方法，同时自行组合拼装`ChatList`，`ChatMessage`, `ChatSender`等组件集成聊天界面，适合需要深度定制组件结构和消息处理流程的场景
{{ hookComponent }}

## 自定义
如果组件内置的消息渲染方案不能满足需求，还可以通过自定义**消息结构解析逻辑**和**消息内容渲染组件**来实现更多渲染需求。以下示例给出了一个自定义实现图表渲染的示例，实现自定义渲染需要完成**四步**，概括起来就是：**扩展类型，准备组件，解析数据，植入插槽**：
- 1、扩展自定义消息体type类型
- 2、实现自定义渲染的组件，示例中使用了tvision-charts-react实现图表渲染
- 3、流式数据增量更新回调`onMessage`中可以对返回数据进行标准化解构，返回渲染组件所需的数据结构，同时可以通过返回`strategy`来决定**同类新增内容块**的追加策略（merge/append），如果需要更灵活影响到数据整合可以返回完整消息数组`AIMessageContent[]`，或者注册合并策略方法（参考下方‘任务规划’示例）
- 4、在render函数中遍历消息内容数组，植入自定义消息体渲染插槽，需保证slot名在list中的唯一性

如果组件内置的几种操作 `TdChatItemActionName` 不能满足需求，示例中同时给出了**自定义消息操作区**的方法，可以自行实现更多操作。

{{ custom }}


## 场景化示例
以下再通过几个常见的业务场景，展示下如何使用 `Chatbot` 组件

### 代码助手
通过使用tdesign开发登录框组件的案例，演示了使用Chatbot搭建简单的代码助手场景，该示例你可以了解到如何按需开启**markdown渲染代码块**，如何**自定义实现代码预览**
{{ code }}

### 文案助手
以下案例演示了使用Chatbot搭建简单的文案写作助手应用，通过该示例你可以了解到如何**发送附件**，同时演示了**附件类型的内容渲染**
{{ docs }}

### 图像生成
以下案例演示了使用Chatbot搭建简单的图像生成应用，通过该示例你可以了解到如何**自定义输入框操作区域**，同时演示了**自定义生图内容渲染**
{{ image }}

### 任务规划
以下案例模拟了使用Chatbot搭建任务规划型智能体应用，分步骤依次执行并输出结果，通过该示例你可以了解到如何**注册自定义消息内容合并策略**，**自定义消息插槽名规则**，同时演示了**自定义任务流程渲染**
{{ agent }}


## API
### Chatbot Props

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
layout | String | both | 布局模式。可选项：single/both。`single`只显示消息列表，`both`显示消息列表和发送框 | N
reverse | Boolean | false | 是否倒序渲染消息 | N
autoSendPrompt | String | - | 自动发送的提示文本 | N
defaultMessages | Array | - | 初始消息列表。TS类型：`ChatMessagesData[]`。[类型定义](./chat-message?tab=api#message-消息对象结构) | N
messageProps | Object/Function | - | 消息项配置。TS类型：`TdChatMessageConfig \| Function` 。[类型定义](./chat-message?tab=api)  | N
listProps | Object | - | 消息列表配置。TS类型：`TdChatListProps`。 | N
senderProps | Object | - | 发送框配置。TS类型：`TdChatSenderProps`。[类型定义](./chat-sender?tab=api) | N
chatServiceConfig | Object | - | 聊天服务配置。TS类型：`ChatServiceConfig` | N
injectCSS | Object | - | 自定义样式注入。TS类型：`{ ChatSender?: string, chatList?: string, chatItem?: string }` | N
onMessageChange | Function | - | 消息变化回调 | N

### TdChatListProps 消息列表配置

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
autoScroll | Boolean | true | 是否自动滚动到底部 | N
defaultScrollPosition | String | bottom | 初始滚动位置。可选项：top/bottom/bottom | N
onScroll | Function | - | 滚动事件回调 | N

### ChatServiceConfig 属性

名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
endpoint | String | -  | 聊天服务的API端点URL | N
stream | Boolean | true | 是否使用流式传输 | N
retryInterval | Number | - | 重试间隔时间(毫秒) | N
maxRetries | Number | - | 最大重试次数 | N
onRequest | Function | - | 请求前的回调，可修改请求参数。TS类型：`(params: ChatRequestParams) => RequestInit` | N
onMessage | Function | - | 处理流式消息的回调。TS类型：`(chunk: SSEChunkData) => AIMessageContent / null` | N
onComplete | Function | - | 请求完成时的回调。TS类型：`(isAborted: boolean, params: RequestInit, result?: any) => void` | N
onAbort | Function | - | 中止请求时的回调。TS类型：`() => Promise<void>` | N
onError | Function | - | 错误处理回调。TS类型：`(err: Error \| Response) => void` | N