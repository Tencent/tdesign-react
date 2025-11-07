---
title: Chatbot 智能对话
description: 高度封装且功能完备的一体化智能对话组件，专为快速集成标准AI应用而设计。
isComponent: true
spline: navigation
---

## 阅读指引

Chatbot 作为高度封装且功能完备的一体化智能对话组件，专为快速集成标准AI应用而设计。组件内置了完整的状态管理、SSE流式传输、消息渲染和交互逻辑，支持多种业务场景，包括智能客服、问答系统、代码助手、任务规划等。

本文档按照**从简单到复杂**的顺序组织，建议按以下路径循序渐进阅读：

1. **快速开始** - 5分钟上手，了解最基本的配置
2. **基础用法** - 了解常用功能特性，掌握核心概念，查看“综合示例”
3. **场景示例** - 参考实战案例，快速应用到项目中

## 快速开始

最简单的 Chatbot 配置示例，只需配置 `endpoint` 和 `onMessage` 即可实现一个可用的对话界面。

{{ quick-start }}

## 基础用法

### 初始化消息

使用 `defaultMessages` 设置静态初始化消息，或通过 `setMessages` 实例方法动态加载历史消息。

{{ initial-messages }}

### 角色消息配置

使用 `messageProps` 配置不同角色的消息展示效果，这些配置会透传给内部的 [ChatMessage](/react-aigc/components/chat-message) 组件。包括**消息样式**（气泡样式、位置、头像、昵称）、**操作回调**（复制、点赞、点踩、重试）、**内容展示**行为（思考过程、搜索结果、Markdown 等）。支持静态配置对象和动态配置函数两种方式。篇幅有限更多配置项和示例请参考 [ChatMessage 文档](/react-aigc/components/chat-message)。

{{ role-message-config }}

### 输入配置

使用 `senderProps` 配置输入框的各种行为，这些配置会透传给内部的 [ChatSender](/react-aigc/components/chat-sender) 组件。包括基础配置（占位符、自动高度）、附件上传配置（文件类型、附件展示）、输入事件回调等。更多配置项和高级用法请参考 [ChatSender 文档](/react-aigc/components/chat-sender)。

{{ sender-config }}

### 数据处理

以上完成消息列表初始化并配置好消息气泡的展示形态后，接下来开始处理后端返回的数据格式。`chatServiceConfig` 是 Chatbot 的核心配置，控制着与后端的通信和数据处理，是连接前端组件和后端服务的桥梁。包括 **请求配置** (endpoint、onRequest设置请求头、请求参数)、**数据转换** (onMessage：将后端数据转换为组件所需格式)、**生命周期回调** (onStart、onComplete、onError、onAbort)。

根据后端服务协议的不同，有两种配置方式：

**自定义协议**：当后端使用自定义数据格式时，往往不能按照前端组件的要求来输出，这时需要通过 `onMessage` 进行数据转换。

{{ service-config }}

**AG-UI 协议**：当后端服务符合 [AG-UI 协议](/react-aigc/agui) 时，只需设置 `protocol: 'agui'`，无需编写 `onMessage` 进行数据转换，大大简化了接入流程。这里只给出了一个简单的文本对话示例，更多复杂的AG-UI场景可以参考 [ChatEngine集成方式](/react-aigc/components/chat-engine)。

{{ agui }}

### 实例方法

通过 ref 获取组件实例，调用[各种方法](/react-aigc/components/chatbot?tab=api#chatbot-实例方法和属性)控制组件行为（消息设置、发送管理、列表滚动等）。

{{ instance-methods }}

### 自定义渲染

使用**动态插槽机制**实现自定义渲染，包括自定义`内容渲染`、自定义`操作栏`、自定义`输入区域`。

- **自定义内容渲染**：如果需要自定义消息内容的渲染方式，可以按照以下步骤实现：
  - 1. 扩展类型：通过 TypeScript 声明自定义内容类型
  - 2. 解析数据：在 `onMessage` 中返回自定义类型的数据结构
  - 3. 监听变化：通过 `onMessageChange` 监听消息变化并同步到本地状态
  - 4. 植入插槽：循环 `messages` 数组，使用 `slot = ${msg.id}-${content.type}-${index}` 属性来渲染自定义组件

- **自定义操作栏**：如果组件库内置的 [`ChatActionbar`](/react-aigc/components/chat-actionbar) 不能满足需求，可以通过 `slot = ${msg.id}-actionbar` 属性来渲染自定义组件。

- **自定义输入区域**：如果需要自定义ChatSender输入区，可以通过 `slot = sender-${slotName}` 属性，可用插槽slotName详见[ChatSender插槽](/react-aigc/components/chat-sender?tab=api#插槽) 

{{ custom-content }}


<!-- ### 自定义合并策略

应对每次新的流式数据chunk到来，自定义合并策略有两种方式：

**1. strategy 配置（简单场景）**

使用内置的合并策略，适用于大多数常见场景，如上方案例中对于图表和文字的合并方式：
- `merge`：合并到同一个内容块，适用于文本累积
- `append`（默认）：追加为新的内容块，适用于多段落、多图片等

**2. registerMergeStrategy（复杂场景）**

注册自定义合并逻辑，完全控制数据的合并方式：
- 适用于进度条、任务步骤、嵌套结构等复杂场景
- 可以实现状态机、累积计算等高级逻辑
- 另外也可以参考下方 [任务规划示例](#任务规划) 了解更复杂的用法

{{ custom-merge }} -->

## 场景示例

在了解了以上各个基础属性的用法后，这里给出一个完整的示例，展示如何在生产实践中综合使用多个功能：初始消息、消息配置、数据转换、请求配置、实例方法和自定义插槽。

> 💡 **示例说明**：所有示例都基于 Mock SSE 服务，您可以打开浏览器开发者工具（F12），切换到 Network（网络）标签，查看接口的请求和响应数据，了解数据格式。

### 基础问答

{{ comprehensive }}

### 代码助手

构建代码助手应用，展示代码高亮、代码预览等功能。

{{ code }}

<!-- ### 文档助手

构建文档写作助手，展示附件上传和附件渲染功能。

{{ docs }} -->

### 图像生成

构建图像生成应用，展示自定义输入框操作区和图片渲染。

{{ image }}

### 任务规划

构建任务规划智能体，展示复杂的自定义渲染和任务流程管理。

{{ agent }}


## API

### Chatbot Props

| 名称              | 类型            | 默认值 | 说明                                                                                                                                                                                                                                                                         | 必传 |
| ----------------- | --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| defaultMessages   | Array           | -      | 初始消息数据列表。TS 类型：`ChatMessagesData[]`。[详细类型定义](/react-aigc/components/chat-message?tab=api)                                                                                                                                                                 | N    |
| messageProps      | Object/Function | -      | 消息项配置，透传给内部 [ChatMessage](/react-aigc/components/chat-message) 组件。按角色聚合了消息项的配置，可以是静态配置对象或动态配置函数。TS 类型：`TdChatMessageConfig \| ((msg: ChatMessagesData) => Omit<TdChatMessageProps, 'message'>)` ，[详细类型定义](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chatbot/type.ts) | N    |
| listProps         | Object          | -      | 消息列表配置，见下方详细说明。TS 类型：`TdChatListProps`。                                                                                                                                                                                                                                   | N    |
| senderProps       | Object          | -      | 发送框配置，透传给内部 [ChatSender](/react-aigc/components/chat-sender) 组件。TS 类型：`TdChatSenderProps`。[详细 API 文档](/react-aigc/components/chat-sender?tab=api)                                                                                                                                                                            | N    |
| chatServiceConfig | Object          | -      | 聊天服务配置，包含网络请求和回调配置，见下方详细说明，TS 类型：`ChatServiceConfig`                                                                                                                                                                                                                   | N    |
| onMessageChange   | Function        | -      | 消息列表数据变化回调，TS 类型：`(e: CustomEvent<ChatMessagesData[]>) => void`                                                                                                                                                                                                | N    |
| onChatReady       | Function        | -      | 内部对话引擎初始化完成回调，TS 类型：`(e: CustomEvent) => void`                                                                                                                                                                                                              | N    |
| onChatAfterSend   | Function        | -      | 发送消息后的回调，TS 类型：`(e: CustomEvent<ChatRequestParams>) => void`                                                                                                                                                                                                         | N    |

### TdChatListProps 消息列表配置

| 名称       | 类型     | 默认值 | 说明                             | 必传 |
| ---------- | -------- | ------ | -------------------------------- | ---- |
| autoScroll | Boolean  | true   | 高度变化时列表是否自动滚动到底部 | N    |
| onScroll   | Function | -      | 滚动事件回调                     | N    |

### ChatServiceConfig 类型说明

聊天服务核心配置类型，主要作用包括基础通信配置，请求流程控制及全生命周期管理（初始化 → 传输 → 完成/中止），流式数据的分块处理策略，状态通知回调等。

| 名称       | 类型     | 默认值    | 说明                                                                                                                                 | 必传 |
| ---------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| endpoint   | String   | -         | 聊天服务请求地址 url                                                                                                                 | N    |
| protocol   | String   | 'default' | 聊天服务协议，支持'default'和'agui'                                                                                                  | N    |
| stream     | Boolean  | true      | 是否使用流式传输                                                                                                                     | N    |
| onStart    | Function | -         | 流式传输开始时的回调。TS 类型：`(chunk: string) => void`                                                            | N    |
| onRequest  | Function | -         | 请求发送前的配置回调，可修改请求参数、添加 headers 等。TS 类型：`(params: ChatRequestParams) => RequestInit`                                                  | N    |
| onMessage  | Function | -         | 处理流式消息的回调，用于解析后端数据并映射为组件所需格式。TS 类型：`(chunk: SSEChunkData) => AIMessageContent / AIMessageContent[] / null`                                 | N    |
| onComplete | Function | -         | 请求结束时的回调。TS 类型：`(isAborted: boolean, params: RequestInit, result?: any) => AIMessageContent / AIMessageContent[] / null` | N    |
| onAbort    | Function | -         | 中止请求时的回调。TS 类型：`() => Promise<void>`                                                                                     | N    |
| onError    | Function | -         | 错误处理回调。TS 类型：`(err: Error \| Response) => void`                                                                            | N    |

### Chatbot 实例方法和属性

通过 ref 获取组件实例，调用以下方法。

| 名称                  | 类型                                                                              | 描述                                         |
| --------------------- | --------------------------------------------------------------------------------- | -------------------------------------------- |
| setMessages           | (messages: ChatMessagesData[], mode?: 'replace' \| 'prepend' \| 'append') => void | 批量设置消息                                 |
| sendUserMessage       | (params: ChatRequestParams) => Promise<void>                                      | 发送用户消息，处理请求参数并触发消息流       |
| sendAIMessage         | (params: ChatRequestParams) => Promise<void>                                      | 发送 AI 消息，处理请求参数并触发消息流       |
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

## 常见问题

### 如何回填消息（初始化消息/加载历史消息）？

组件支持两种方式回填消息：

**1. 初始化时回填**

通过 `defaultMessages` 属性传入初始消息列表：

```tsx
<Chatbot
  defaultMessages={[
    {
      id: '1',
      role: 'user',
      content: [{ type: 'text', data: '你好' }],
      datetime: '2024-01-01 10:00:00'
    },
    {
      id: '2',
      role: 'assistant',
      content: [{ type: 'text', data: '你好！有什么可以帮助你的吗？' }],
      datetime: '2024-01-01 10:00:01',
      status: 'complete'
    }
  ]}
/>
```

**2. 动态加载历史消息**

通过 ref 调用 `setMessages` 方法，支持三种模式：

```tsx
const chatbotRef = useRef(null);

// 替换所有消息
chatbotRef.current.setMessages(historyMessages, 'replace');

// 在顶部追加历史消息（适用于上拉加载更多）
chatbotRef.current.setMessages(olderMessages, 'prepend');

// 在底部追加消息
chatbotRef.current.setMessages(newMessages, 'append');
```

**消息数据结构说明**：

每条消息必须包含以下字段：
- `id`：消息唯一标识
- `role`：消息角色（user/assistant/system）
- `content`：消息内容数组，详见 [ChatMessage 组件文档](/react-aigc/components/chat-message?tab=api)
- `datetime`：消息时间（可选）
- `status`：消息状态（可选），AI 消息建议设置为 'complete'

### 如何处理后端返回的消息数据转换？

后端返回的数据格式通常与组件所需的消息结构不一致，需要在 `onMessage` 回调中进行转换。

**核心概念**：
- `onMessage` 的返回值决定了如何更新消息内容
- 返回 `null` 或 `undefined` 表示忽略本次数据块，不更新消息
- 返回 `AIMessageContent` 表示要添加/更新单个内容块
- 返回 `AIMessageContent[]` 表示批量更新多个内容块

**场景 1：简单文本流式响应**

```tsx
chatServiceConfig={{
  onMessage: (chunk) => {
    // 后端返回：{ event: 'message', data: { text: '你好' } }
    if (chunk.event === 'message') {
      return {
        type: 'text',
        data: chunk.data.text,
        strategy: 'merge'  // 合并到同一个文本块
      };
    }
    return null;  // 忽略其他事件
  }
}}
```

**场景 2：多种消息类型混合**

```tsx
chatServiceConfig={{
  onMessage: (chunk) => {
    const { type, ...rest } = chunk.data;
    
    // 处理思考过程
    if (type === 'think') {
      return {
        type: 'thinking',
        data: { text: rest.content, title: '思考中' }
      };
    }
    
    // 处理搜索结果
    if (type === 'search') {
      return {
        type: 'search',
        data: {
          title: rest.title,
          references: rest.content
        }
      };
    }
    
    // 处理文本内容
    if (type === 'text') {
      return {
        type: 'markdown',
        data: rest.content,
        strategy: 'merge'
      };
    }
    
    return null;  // 忽略未知事件
  }
}}
```

**场景 3：批量更新多个内容块**

```tsx
chatServiceConfig={{
  onMessage: (chunk, message) => {
    // message 是当前正在构建的消息对象
    const { event, data } = chunk;
    
    // 返回数组表示批量更新多个内容块
    if (event === 'batch_update') {
      return [
        {
          type: 'thinking',
          data: { text: data.thinking, title: '分析中' },
          id: 'thinking-1'  // 通过 id 或 type 匹配已存在的内容块
        },
        {
          type: 'markdown',
          data: data.answer,
          id: 'answer-1'
        }
      ];
    }
    
    // 也可以根据当前消息内容动态决定
    if (event === 'complete') {
      const currentContent = message?.content || [];
      // 移除思考过程，只保留最终答案
      return currentContent.filter(c => c.type !== 'thinking');
    }
    
    return null;
  }
}}
```

**返回值处理逻辑**：

| 返回值类型 | 处理逻辑 | 适用场景 |
|-----------|---------|---------|
| `null` / `undefined` | 忽略本次数据块，不更新消息 | 过滤无关事件、跳过中间状态 |
| `AIMessageContent` | 根据 `strategy` 字段决定：<br>• `merge`（默认）：查找相同 type 的最后一个内容块并合并<br>• `append`：追加为新的独立内容块 | 大多数流式响应场景 |
| `AIMessageContent[]` | 遍历数组，根据 `id` 或 `type` 匹配已存在的内容块：<br>• 匹配到：更新该内容块<br>• 未匹配：追加到末尾 | 批量更新多个内容块、动态调整内容结构 |

**strategy 字段说明**：

- `merge`（默认）：查找相同 type 的**最后一个**内容块进行合并，适用于流式文本累积
- `append`：始终追加为新的独立内容块，适用于多段落、多图片等场景

**内容块匹配规则**（返回数组时）：

当返回 `AIMessageContent[]` 时，组件会遍历数组中的每个内容块：
1. 优先通过 `id` 字段匹配已存在的内容块
2. 如果没有 `id` 或未匹配到，则通过 `type` 字段匹配
3. 匹配到则更新该内容块，未匹配到则追加到末尾

**调试技巧**：

```tsx
onMessage: (chunk, message) => {
  console.log('收到数据块:', chunk);
  console.log('当前消息:', message);
  console.log('当前内容块:', message?.content);
  
  const result = /* 你的转换逻辑 */;
  console.log('返回结果:', result);
  
  return result;
}
```
