---
title: Chatbot 智能对话
description: 智能对话聊天组件，适用于需要快速集成智能客服、问答系统、任务规划等的AI应用
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

### 自定义
如果组件内置的消息渲染方案不能满足需求，还可以通过自定义**消息结构解析逻辑**和**消息内容渲染组件**来实现更多渲染需求。以下示例给出了一个自定义实现图表渲染的示例，实现自定义渲染需要完成**四步**，概括起来就是：**扩展类型，准备组件，解析数据，植入插槽**：
- 1、扩展自定义消息体type类型
- 2、实现自定义渲染的组件，示例中使用了tvision-charts-react实现图表渲染
- 3、流式数据增量更新回调`onMessage`中可以对返回数据进行标准化解构，返回渲染组件所需的数据结构，同时可以通过返回`strategy`来决定**同类新增内容块**的追加策略（merge/append），如果需要更灵活影响到数据整合可以返回完整消息数组`AIMessageContent[]`，或者注册合并策略方法（参考下方‘任务规划’示例）
- 4、在render函数中遍历消息内容数组，植入自定义消息体渲染插槽，需保证slot名在list中的唯一性

如果组件内置的几种操作 `TdChatMessageActionName` 不能满足需求，示例中同时给出了**自定义消息操作区**的方法，可以自行实现更多操作。

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

### 非流式输出模式

该示例适用于需要与`不支持流式传输的后端服务进行交互`，或者需要更简单、更可控的请求-响应模式的场景。

- **非流式配置**：通过 `stream: false` 关闭流式传输，使用传统的请求-响应模式
- **完整响应处理**：在 `onComplete` 回调中处理完整的响应数据

{{ nostream }}


## AGUI 协议适配

[AG-UI（Agent-User Interface)](https://docs.ag-ui.com/introduction) 是一个专为AI Agent与前端应用交互设计的轻量级协议，专注于实时交互、状态流式传输和人机协作。Chatbot 组件内置了对 AG-UI 协议的支持，可以**无缝集成符合 AG-UI 标准的后端服务**。

### 基本用法

以下示例演示了如何使用 Chatbot 组件与 AG-UI 协议后端进行基础交互：

- **协议配置**：通过 `protocol: 'agui'` 开启 AG-UI 协议解析支持
- **事件处理**：组件自动解析 AG-UI [标准事件类型](https://docs.ag-ui.com/concepts/architecture#message-types)（如 `TEXT_MESSAGE_*`、`THINKING_*`、`TOOL_CALL_*` 等）

{{ agui }}

### 步骤规划

该示例通过一个**旅游规划Agent场景**，演示了如何使用 AG-UI 协议构建复杂的**多步骤任务规划**应用，包括了**16种标准化事件类型**的应用示例，同时演示了状态流式传输、人机协作工作流和丰富的自定义消息渲染形式。：

- **多步骤流程**：支持分步骤执行复杂任务（如旅游规划）
- **状态管理**：实时更新应用状态，支持chat内外同步状态快照和增量更新
- **Human-in-the-Loop**：支持人机协作，在流程中插入用户输入环节
- **工具调用**：集成外部工具调用，如天气查询、行程规划等
- **历史消息**：支持加载和展示历史对话记录
- **自定义渲染**：针对不同内容类型（天气、行程、酒店等）提供专门的渲染组件


{{ travel }}

## API

### Chatbot Props

| 名称              | 类型            | 默认值 | 说明                                                                                                                                                                                                                                                                         | 必传 |
| ----------------- | --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| defaultMessages   | Array           | -      | 初始消息数据列表。TS 类型：`ChatMessagesData[]`。[详细类型定义](/react-aigc/components/chat-message?tab=api)                                                                                                                                                                 | N    |
| messageProps      | Object/Function | -      | 消息项配置。按角色聚合了消息项的配置透传`ChatMessage`组件，TS 类型：`TdChatMessageConfig \| ((msg: ChatMessagesData) => Omit<TdChatMessageProps, 'message'>)` ，[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chatbot/type.ts#L151) | N    |
| listProps         | Object          | -      | 消息列表配置。TS 类型：`TdChatListProps`。                                                                                                                                                                                                                                   | N    |
| senderProps       | Object          | -      | 发送框配置，透传`ChatSender`组件。TS 类型：`TdChatSenderProps`。[类型定义](./chat-sender?tab=api)                                                                                                                                                                            | N    |
| chatServiceConfig | Object          | -      | 聊天服务配置，见下方详细说明，TS 类型：`ChatServiceConfig`                                                                                                                                                                                                                   | N    |
| onMessageChange   | Function        | -      | 消息列表数据变化回调，TS 类型：`(e: CustomEvent<ChatMessagesData[]>) => void`                                                                                                                                                                                                | N    |
| onChatReady       | Function        | -      | 内部消息引擎初始化完成回调，TS 类型：`(e: CustomEvent) => void`                                                                                                                                                                                                              | N    |
| onChatAfterSend   | Function        | -      | 发送消息回调，TS 类型：`(e: CustomEvent<ChatRequestParams>) => void`                                                                                                                                                                                                         | N    |

### TdChatListProps 消息列表配置

| 名称            | 类型     | 默认值 | 说明                                          | 必传 |
| --------------- | -------- | ------ | --------------------------------------------- | ---- |
| autoScroll      | Boolean  | true   | 高度变化时列表是否自动滚动到底部              | N    |
| defaultScrollTo | String   | bottom | 默认初始时滚动定位。可选项：top/bottom/bottom | N    |
| onScroll        | Function | -      | 滚动事件回调                                  | N    |

### ChatServiceConfig 类型说明

聊天服务核心配置类型，主要作用包括基础通信配置，请求流程控制及全生命周期管理（初始化 → 传输 → 完成/中止），流式数据的分块处理策略，状态通知回调等。

| 名称       | 类型     | 默认值    | 说明                                                                                                                                 | 必传 |
| ---------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| endpoint   | String   | -         | 聊天服务请求地址 url                                                                                                                 | N    |
| protocol   | String   | 'default' | 聊天服务协议，支持'default'和'agui'                                                                                                  | N    |
| stream     | Boolean  | true      | 是否使用流式传输                                                                                                                     | N    |
| onStart    | Function | -         | 流开始传输时的回调。TS 类型：`(params: ChatRequestParams) => RequestInit`                                                            | N    |
| onRequest  | Function | -         | 请求前的回调，可修改请求参数。TS 类型：`(params: ChatRequestParams) => RequestInit`                                                  | N    |
| onMessage  | Function | -         | 处理流式消息的回调。TS 类型：`(chunk: SSEChunkData) => AIMessageContent / AIMessageContent[] / null`                                 | N    |
| onComplete | Function | -         | 请求结束时的回调。TS 类型：`(isAborted: boolean, params: RequestInit, result?: any) => AIMessageContent / AIMessageContent[] / null` | N    |
| onAbort    | Function | -         | 中止请求时的回调。TS 类型：`() => Promise<void>`                                                                                     | N    |
| onError    | Function | -         | 错误处理回调。TS 类型：`(err: Error \| Response) => void`                                                                            | N    |

### Chatbot 实例方法

| 名称                  | 类型                                                                              | 描述                                         |
| --------------------- | --------------------------------------------------------------------------------- | -------------------------------------------- |
| setMessages           | (messages: ChatMessagesData[], mode?: 'replace' \| 'prepend' \| 'append') => void | 批量设置消息                                 |
| sendUserMessage       | (params: ChatRequestParams) => Promise<void>                                      | 发送用户消息，处理请求参数并触发消息流       |
| sendSystemMessage     | (msg: string) => void                                                             | 发送系统级通知消息，用于展示系统提示/警告    |
| abortChat             | () => Promise<void>                                                               | 中止当前进行中的聊天请求，清理网络连接       |
| addPrompt             | (prompt: string) => void                                                          | 将预设提示语添加到输入框，辅助用户快速输入   |
| selectFile            | () => void                                                                        | 触发文件选择对话框，用于附件上传功能         |
| regenerate            | (keepVersion?: boolean) => Promise<void>                                          | 重新生成最后一条消息，可选保留历史版本       |
| registerMergeStrategy | (type: T['type'], handler: (chunk: T, existing?: T) => T) => void                 | 注册自定义消息合并策略，用于处理流式数据更新 |
| scrollList            | ({ to: 'bottom' \| 'top', behavior: 'auto' \| 'smooth' }) => void                 | 受控滚动到指定位置                           |
| isChatEngineReady     | boolean                                                                           | ChatEngine 是否就绪                          |
| chatMessageValue      | ChatMessagesData[]                                                                | 获取当前消息列表的只读副本                   |
| chatStatus            | ChatStatus                                                                        | 获取当前聊天状态（空闲/进行中/错误等）       |
| senderLoading         | boolean                                                                           | 当前输入框按钮是否在'输出中'                 |

### useChat Hook

useChat 是聊天组件核心逻辑 Hook，用于管理聊天状态与生命周期：初始化聊天引擎、同步消息数据、订阅状态变更，并自动处理组件卸载时的资源清理，对外暴露聊天引擎实例/消息列表/状态等核心参数。

- **请求参数说明**

| 参数名            | 类型                    | 说明                                                                             |
| ----------------- | ----------------------- | -------------------------------------------------------------------------------- |
| defaultMessages   | ChatMessagesData[]      | 初始化消息列表，用于设置聊天记录的初始值                                         |
| chatServiceConfig | ChatServiceConfigSetter | 聊天服务配置，支持静态配置或动态生成配置的函数，用于设置 API 端点/重试策略等参数 |

- **返回值说明**

| 返回值     | 类型               | 说明                                                      |
| ---------- | ------------------ | --------------------------------------------------------- |
| chatEngine | IChatEngine        | 聊天引擎实例，提供核心操作方法，同上方 `Chatbot 实例方法` |
| messages   | ChatMessagesData[] | 当前聊天消息列表所有数据                                  |
| status     | ChatStatus         | 当前聊天状态                                              |
