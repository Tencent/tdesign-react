---
title: Chatbot 智能对话
description: 智能对话聊天组件，适用于需要快速集成智能客服、问答系统等的AI应用
isComponent: true
spline: navigation
---

## 基本用法


### 步骤规划
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
