---
title: ChatEngine 对话引擎
description: 智能体对话底层逻辑引擎，提供灵活的 Hook API 用于深度定制。
isComponent: true
spline: navigation
---

## 阅读指引

ChatEngine 是一个底层对话引擎（Headless Core），提供灵活的 Hook API 用于深度定制。支持自定义 UI 结构、消息处理和 AG-UI 协议，适合构建复杂智能体应用，如工具调用、多步骤任务规划、状态流式传输等场景，相比 Chatbot 组件提供了更高的灵活性，适合需要**深度定制 UI 结构和消息处理流程**的场景。Chatbot组件本身也是基于 ChatEngine 构建的 (ChatEngine + Preset UI)。

建议按以下路径循序渐进阅读:

1. **快速开始** - 了解 useChat Hook 的基本用法，组合组件构建对话界面的方法
2. **基础用法** - 掌握数据处理、消息管理、UI 定制、生命周期、自定义渲染等主要功能
3. **AG-UI 协议** - 学习 AG-UI 协议的使用和高级特性（工具调用、状态订阅等）

> 💡 **示例说明**：所有示例都基于 Mock SSE 服务，可以打开浏览器开发者工具（F12），切换到 Network（网络）标签，查看接口的请求和响应数据，了解数据格式。


## 快速开始

最简单的示例，使用 `useChat` Hook 创建对话引擎，组合 `ChatList`、`ChatMessage`、`ChatSender` 组件构建对话界面。

{{ agui-test }}

## 基础用法

### 初始化消息

使用 `defaultMessages` 设置静态初始化消息，或通过 `chatEngine.setMessages` 动态加载历史消息。
{{ initial-messages }}

### 数据处理

`chatServiceConfig` 是 ChatEngine 的核心配置，控制着与后端的通信和数据处理，是连接前端组件和后端服务的桥梁。作用包括
- **请求配置** (endpoint、onRequest设置请求头、请求参数)
- **数据转换** (onMessage：将后端数据转换为组件所需格式)
- **生命周期回调** (onStart、onComplete、onError、onAbort)。

根据后端服务协议的不同，又有两种配置方式：

- **自定义协议**：当后端使用自定义数据格式时，往往不能按照前端组件的要求来输出，这时需要通过 `onMessage` 进行数据转换。
- **AG-UI 协议**：当后端服务符合 [AG-UI 协议](/react-chat/agui) 时，只需设置 `protocol: 'agui'`，无需编写 `onMessage` 进行数据转换，大大简化了接入流程。详见下方 [AG-UI 协议](#ag-ui-协议) 章节。

这部分的配置用法与Chatbot中一致，示例可以参考 [Chatbot 数据处理](/react-chat/components/chatbot#数据处理) 章节。

### 实例方法

通过 `chatEngine` 调用[各种方法](#chatengine-实例方法)控制组件行为（消息设置、发送管理等）。
{{ instance-methods }}


### 自定义渲染

使用**动态插槽机制**实现自定义渲染，包括自定义`内容渲染`、自定义`操作栏`、自定义`输入区域`。


- **自定义内容渲染**：如果需要自定义消息内容的渲染方式，可以按照以下步骤实现：
  - 1. 扩展类型：通过 TypeScript 声明自定义内容类型
  - 2. 解析数据：在 `onMessage` 中返回自定义类型的数据结构
  - 3. 监听变化：通过 `onMessageChange` 监听消息变化并同步到本地状态
  - 4. 植入插槽：循环 `messages` 数组，使用 `slot = ${content.type}-${index}` 属性来渲染自定义组件


- **自定义操作栏**：如果组件库内置的 [`ChatActionbar`](/react-chat/components/chat-actionbar) 不能满足需求，可以通过 `slot='actionbar'` 属性来渲染自定义组件。

- **自定义输入区域**：如果需要自定义ChatSender输入区，可用插槽详见[ChatSender插槽](/react-chat/components/chat-sender?tab=api#插槽) 


{{ custom-content }}

### 综合示例

在了解了以上各个基础属性的用法后，这里给出一个完整的示例，展示如何在生产实践中综合使用多个功能：初始消息、消息配置、数据转换、请求配置、实例方法和自定义插槽。

{{ comprehensive }}


## Headless 事件总线

ChatEngine 内置了事件总线（EventBus），支持在无 UI 场景下进行事件分发，适用于日志监控、跨组件通信、外部系统集成等场景。[支持的事件类型](/react-chat/components/chat-engine?tab=api#支持的事件类型)

{{ headless-eventbus }}


## AG-UI 协议

[AG-UI（Agent-User Interface)](https://docs.ag-ui.com/introduction) 是一个专为 AI Agent 与前端应用交互设计的轻量级协议，专注于实时交互、状态流式传输和人机协作。ChatEngine 内置了对 AG-UI 协议的支持，可以**无缝集成符合 AG-UI 标准的后端服务**。

### 基础用法

开启 AG-UI 协议支持（`protocol: 'agui'`），组件会自动解析标准事件类型（如 `TEXT_MESSAGE_*`、`THINKING_*`、`TOOL_CALL_*`、`ACTIVITY_*`、`STATE_*` 等）。使用`AGUIAdapter.convertHistoryMessages`方法即可实现符合[`AGUIHistoryMessage`](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chat-engine/adapters/agui/types.ts)数据结构的历史消息回填。

{{ agui-basic }}


### 工具调用

AG-UI 协议支持通过 `TOOL_CALL_*` 事件让 AI Agent 调用前端工具组件，实现人机协作。

> **协议兼容性说明**：`useAgentToolcall` 和 `ToolCallRenderer` 本身是协议无关的，它们只依赖 [ToolCall 数据结构](#toolcall-对象结构)，不关心数据来源。AG-UI 协议的优势在于自动化（后端直接输出标准 `TOOL_CALL_*` 事件），普通协议需要在 `onMessage` 中手动将后端数据转换为 `ToolCall` 结构。通过适配器可以降低手动转换的复杂度。

#### 核心 Hook 与组件

ChatEngine 围绕工具调用提供了几个核心 Hook，它们各司其职，协同工作：

- **`useAgentToolcall` Hook**：注册工具配置（元数据、参数、UI 组件），相比传统的自定义渲染方式，提供了高度内聚的配置、统一的 API 接口、完整的类型安全和更好的可移植性。详见下方[常见问题](/react-chat/components/chat-engine?tab=demo#常见问题)
- **`ToolCallRenderer` 组件**：工具调用的统一渲染器，负责根据工具名称查找对应的配置，解析参数，管理状态并渲染注册的 UI 组件。使用时只需传入 `toolCall` 对象即可自动完成渲染

#### 使用流程

1. 使用 `useAgentToolcall` 注册工具配置（元数据、参数、UI 组件）
2. 在消息渲染时使用 `ToolCallRenderer` 组件渲染工具调用
3. `ToolCallRenderer` 自动查找配置、解析参数、管理状态、渲染 UI


#### 基础示例

一个模拟图片生成助手的Agent，展示工具调用和状态订阅的核心用法：

- **工具注册**：使用 `useAgentToolcall` 注册 `generate_image` 工具
- **状态订阅**：使用注入的 `agentState` 参数来订阅图片生成进度（preparing → generating → completed/failed）
- **进度展示**：实时显示生成进度条和状态信息
- **结果呈现**：生成完成后展示图片
- **推荐问题**：通过返回`toolcallName: 'suggestion'`，可以无缝对接内置的推荐问题组件

{{ agui-toolcall }}


### 工具状态订阅

在 AG-UI 协议中，除了工具组件内部需要展示状态，有时我们还需要在**对话组件外部的 UI**（如页面顶部的进度条、侧边栏的任务列表等）中订阅和展示工具执行状态。Agent服务是通在工具调用过程中增加`STATE_SNAPSHOT` 和 `STATE_DELTA` 事件来实现状态变更、快照的流式传输。

为了方便旁路UI组件订阅状态，可以使用 `useAgentState` 来获取状态数据，实时渲染任务执行进度和状态信息。比如要在页面顶部显示当前任务的执行进度，不在对话流中展示， 可以这样实现。

```javascript
// 外部进度面板组件
const GlobalProgressBar: React.FC = () => {
  // 使用 useAgentState 订阅状态
  const { stateMap, currentStateKey } = useAgentState();
  
  /* 后端通过 STATE_SNAPSHOT 和 STATE_DELTA 事件推送状态数据，模拟数据如下：
  // 
  // STATE_SNAPSHOT（初始快照）：
  // data: {"type":"STATE_SNAPSHOT","snapshot":{"task_xxx":{"progress":0,"message":"准备开始规划...","items":[]}}}
  //
  // STATE_DELTA（增量更新，使用 JSON Patch 格式）：
  // data: {"type":"STATE_DELTA","delta":[
  //   {"op":"replace","path":"/task_xxx/progress","value":20},
  //   {"op":"replace","path":"/task_xxx/message","value":"分析目的地信息"},
  //   {"op":"replace","path":"/task_xxx/items","value":[{"label":"分析目的地信息","status":"running"}]}
  // ]}
  */ 
 
  // useAgentState 内部会自动处理这些事件，将 snapshot 和 delta 合并到 stateMap 中
  
  // 获取当前任务状态
  const currentState = currentStateKey ? stateMap[currentStateKey] : null;
  
  // items 数组包含任务的各个步骤信息
  // 每个 item 包含：label（步骤名称）、status（状态：running/completed/failed）
  const items = currentState?.items || [];
  const completedCount = items.filter((item: any) => item.status === 'completed').length;
  
  return (
    <div>
      <div>进度：{completedCount}/{items.length}</div>
      {items.map((item: any, index: number) => (
        <div key={index}>
          {item.label} - {item.status}
        </div>
      ))}
    </div>
  );
};
```

当多个外部组件需要访问同一份状态时，使用 Provider 模式。通过使用 `AgentStateProvider` + `useAgentStateContext` 来共享状态

完整示例请参考下方 [综合示例](#综合示例) 演示。


### Activity 事件

AG-UI 协议支持通过 `ACTIVITY_*` 事件展示动态内容组件（如实时图表、进度条等）。Activity 专注于**纯展示场景**，通过 `ACTIVITY_SNAPSHOT` 初始化数据，`ACTIVITY_DELTA` 增量更新。
- **`useAgentActivity`**：注册 Activity 配置（类型、UI 组件）
- **`ActivityRenderer`**：根据 `activityType` 自动匹配并渲染组件
- **事件流程**：`ACTIVITY_SNAPSHOT` → `ACTIVITY_DELTA` → `ACTIVITY_DELTA`...

{{ agui-activity }}


### 综合示例

模拟一个完整的**旅游规划 Agent 场景**，演示了如何使用 AG-UI 协议构建复杂的**多步骤任务规划**应用。先收集用户偏好（Human-in-the-Loop），然后根据用户提交的偏好依次执行：查询天气、展示规划步骤的工具调用，同时展示实时数据（如股票图表、进度条等 Activity），最后总结生成最终计划

**核心特性：**
- **完整事件体系**：展示 AG-UI 协议的所有事件类型，包括 `TEXT_MESSAGE_*`、`THINKING_*`、`TOOL_CALL_*`、`ACTIVITY_*`、`STATE_*` 等
- **多步骤流程**：支持分步骤执行复杂任务（如旅游规划）
- **状态流式传输**：实时更新应用状态，支持状态快照和增量更新
- **Human-in-the-Loop**：支持人机协作，在流程中插入用户输入环节
- **工具调用**：集成外部工具调用，如天气查询、行程规划等
- **Activity 展示**：支持动态内容展示，如实时图表、进度条等
- **外部状态订阅**：演示如何在对话组件外部订阅和展示工具执行状态

{{ agui-comprehensive }}

### 断点恢复（Resume）

当用户离开页面后重新进入时，如果后端 Agent 仍在运行，可以通过断点恢复机制续接进行中的任务。

**核心流程**：
1. 请求历史消息接口，获取已完成的消息 + `pendingRun` 标识
2. 使用 `AGUIAdapter.convertHistoryMessages` 转换并渲染已完成的消息
3. 如果有 `pendingRun`，调用 `chatEngine.resumeRun({ threadId, runId })` 发起续传
4. 后端推 `MESSAGES_SNAPSHOT` 事件一次性恢复已产生的中间内容（思考、工具调用、部分文本）
5. 后端继续推增量事件直到 `RUN_FINISHED`

{{ agui-resume }}


## OpenClaw 协议

[OpenClaw](https://openclaw.io) 是一个基于 WebSocket 的 AI Agent 网关协议，采用 RPC 风格的消息通信，支持实时双向交互、流式消息推送、连接保活等特性。ChatEngine 内置了对 OpenClaw 协议的支持，可以方便地接入 OpenClaw Gateway。

### 设计原则

- **配置精简**：OpenClaw 专属配置只保留协议层必需项（`heartbeatInterval`、`client`、`protocolVersion`），业务参数通过 `onRequest` 回调传入
- **复用外层配置**：`endpoint`、`maxRetries`、`retryInterval`、`timeout` 等通用网络配置复用 `ChatNetworkConfig`
- **安全考虑**：token 等敏感信息不在静态配置中暴露，通过 `onRequest` 动态获取

### 基础用法

设置 `protocol: 'openclaw'`，即可启用 OpenClaw WebSocket 连接。ChatEngine 会自动处理：
- WebSocket 连接建立和 `connect.challenge` 握手
- 心跳保活和自动重连
- 将 OpenClaw 事件（`chat`、`agent`）自动转换为 `AIMessageContent` 格式

> ⚠️ 本示例需要启动本地 Mock Server：`cd mock-server/online2 && node app.js`

{{ openclaw-basic }}



## 生成式UI

生成式 UI（Generative UI）是指由 AI/LLM 动态生成的用户界面。ChatEngine 基于 Vercel Lib [json-render](https://json-render.dev/docs) 理念构建了完整的生成式 UI 解决方案，让 AI 能够在**受约束的Catalog**内安全地生成 UI，输出始终可预测、可渲染。

### 核心设计理念

生成式 UI 采用**双层架构**实现安全可控的 AI UI 生成：

- **Catalog（约束层）**：定义 AI 可以使用的组件词汇表，通过 Zod Schema 约束每个组件的 props，确保 AI 生成的 JSON 符合预期结构。使用 `generateCatalogPrompt` 将 Catalog 转换为 AI 系统提示词
- **Registry（渲染层）**：定义组件的 React 实现，将 AI 生成的 JSON Schema 渲染为真实的 UI 组件。通过 `createCustomRegistry` 注册自定义组件

这种设计确保了：
- **安全可控**：AI 只能生成 Catalog 中定义的组件，无法生成任意代码
- **输出可预测**：JSON 输出始终符合 Schema 约束，每次都能正确渲染
- **流式渲染**：支持边生成边渲染，通过 AG-UI 协议的 `ACTIVITY_SNAPSHOT`（全量）和 `ACTIVITY_DELTA`（JSON Patch 增量）实现高性能流式更新

### 基础示例

演示生成式 UI 的完整使用流程：

1. **定义 Catalog**：使用 `generateCatalogPrompt` 生成 AI 系统提示词，告诉 AI 可以生成哪些组件（如 Card、Button、Input 等）以及每个组件接受的 props
2. **注册 Registry**：使用 `createCustomRegistry` 注册自定义组件的 React 实现，定义这些组件如何渲染
3. **配置 Activity**：使用 `createJsonRenderActivityConfig` 创建 Activity 配置，定义 Action 处理器（如表单提交、按钮点击等交互）

AI 生成符合 Catalog 约束的 JSON → json-render 引擎解析 → Registry 查找组件实现 → 渲染真实 UI。

{{ agui-json-render-full-custom }}

### 旁路UI渲染

在某些场景下，需要将 AI 生成的 UI 渲染到对话框之外的区域（如侧边栏、弹窗、独立面板等）。本示例演示如何通过 `eventBus.on(ChatEngineEventType.AGUI_ACTIVITY)` 监听 Activity 事件，获取生成的 UI Schema，然后在任意位置使用 `ActivityRenderer` 进行独立渲染。适用于需要对生成式 UI 进行额外控制和管理的场景。

{{ agui-json-render-external-panel }}

### A2UI 协议渲染

除了原生 json-render Schema，ChatEngine 还支持 [A2UI（Agent to UI）协议 v0.9](https://a2ui.org/)。A2UI 是 Google 专为 AI 动态渲染设计的流式 UI 协议，其核心特点是 **UI 结构与数据分离**：

- **四种消息类型**：`createSurface`（创建画布）、`updateComponents`（更新组件结构）、`updateDataModel`（更新数据模型）、`deleteSurface`（删除画布）
- **扁平化组件列表**：组件以邻接表形式定义，通过 ID 引用建立父子关系，支持任意顺序发送
- **数据绑定**：组件 props 可通过 `{ "path": "/user/name" }` 语法绑定到数据模型，支持双向绑定（表单输入自动更新本地数据）
- **渐进式渲染**：客户端增量解析消息流，边接收边渲染

使用 `createA2UIJsonRenderActivityConfig` 可以将 A2UI 协议消息自动转换为 json-render Schema 进行渲染，复用现有的 Registry 组件实现。

{{ agui-a2ui-json-render }}

## API

### useChat

用于管理对话状态与生命周期的核心 Hook，初始化对话引擎、同步消息数据、订阅状态变更，并自动处理组件卸载时的资源清理。

#### 参数

| 参数名            | 类型               | 说明                                                                                     | 必传 |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------- | ---- |
| defaultMessages   | ChatMessagesData[] | 初始化消息列，[详细类型定义](/react-chat/components/chat-message?tab=api) 表                                                                           | N    |
| chatServiceConfig | ChatServiceConfig  | 对话服务配置，[详细类型定义](/react-chat/components/chatbot?tab=api#chatserviceconfig-类型说明) | Y    |

#### 返回值

| 返回值     | 类型               | 说明                                                                 |
| ---------- | ------------------ | -------------------------------------------------------------------- |
| chatEngine | ChatEngine         | 对话引擎实例，详见下方 [ChatEngine 实例方法](#chatengine-实例方法) |
| messages   | ChatMessagesData[] | 当前对话消息列表                                                     |
| status     | ChatStatus         | 当前对话状态（idle/pending/streaming/complete/stop/error）          |

### ChatEngine 实例方法

ChatEngine 实例方法与 Chatbot 组件实例方法完全一致，详见 [Chatbot 实例方法文档](/react-chat/components/chatbot?tab=api#chatbot-实例方法和属性)。

#### eventBus 事件总线

通过 `chatEngine.eventBus` 访问事件总线实例，支持以下方法：

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| on | `(event, callback)` | `() => void` | 订阅事件，返回取消订阅函数 |
| once | `(event, callback)` | `() => void` | 一次性订阅 |
| off | `(event, callback?)` | `void` | 取消订阅，不传 callback 则取消全部 |
| emit | `(event, payload)` | `void` | 发布事件 |
| waitFor | `(event, timeout?)` | `Promise` | 等待事件触发 |
| waitForMatch | `(event, filter, timeout?)` | `Promise` | 带条件等待 |
| onCustom | `(eventName, callback)` | `() => void` | 订阅自定义事件 |
| emitCustom | `(eventName, data)` | `void` | 发布自定义事件 |
| getHistory | `()` | `EventHistoryItem[]` | 获取事件历史 |
| clear | `()` | `void` | 清理所有订阅 |
| destroy | `()` | `void` | 销毁事件总线 |


#### 支持的事件类型

| 事件类型 | 事件名 | 说明 | 载荷字段 |
|---------|--------|------|---------|
| **生命周期** | | | |
| ENGINE_INIT | `engine:init` | 引擎初始化完成 | `timestamp` |
| ENGINE_DESTROY | `engine:destroy` | 引擎销毁 | `timestamp` |
| **消息事件** | | | |
| MESSAGE_CREATE | `message:create` | 消息创建 | `message`, `messages` |
| MESSAGE_UPDATE | `message:update` | 消息更新 | `messageId`, `content`, `message` |
| MESSAGE_DELETE | `message:delete` | 消息删除 | `messageId`, `messages` |
| MESSAGE_CLEAR | `message:clear` | 消息清空 | `timestamp` |
| MESSAGE_STATUS_CHANGE | `message:status` | 消息状态变更 | `messageId`, `status`, `previousStatus` |
| **请求事件** | | | |
| REQUEST_START | `request:start` | 请求开始 | `params`, `messageId` |
| REQUEST_STREAM | `request:stream` | 每次接收到 SSE chunk 时触发（高频） | `messageId`, `chunk`, `content` |
| REQUEST_COMPLETE | `request:complete` | 请求完成 | `messageId`, `params`, `message` |
| REQUEST_ERROR | `request:error` | 请求错误 | `messageId`, `error`, `params` |
| REQUEST_ABORT | `request:abort` | 请求中止 | `messageId`, `params` |
| **AG-UI 事件** | | | |
| AGUI_RUN_START | `agui:run:start` | AG-UI 运行开始 | `runId`, `threadId`, `timestamp` |
| AGUI_RUN_COMPLETE | `agui:run:complete` | AG-UI 运行完成 | `runId`, `threadId`, `timestamp` |
| AGUI_RUN_ERROR | `agui:run:error` | AG-UI 运行错误 | `error`, `runId` |


### useAgentToolcall

用于注册工具调用配置的 Hook，支持自动注册和手动注册两种模式。

#### 参数

| 参数名 | 类型                                                              | 说明                                                     | 必传 |
| ------ | ----------------------------------------------------------------- | -------------------------------------------------------- | ---- |
| config | AgentToolcallConfig \\| AgentToolcallConfig[] \\| null \\| undefined | 工具调用配置对象或数组，传入时自动注册，不传入时手动注册 | N    |

#### 返回值

| 返回值        | 类型                                                           | 说明                     |
| ------------- | -------------------------------------------------------------- | ------------------------ |
| register      | (config: AgentToolcallConfig \\| AgentToolcallConfig[]) => void | 手动注册工具配置         |
| unregister    | (names: string \\| string[]) => void                            | 取消注册工具配置         |
| isRegistered  | (name: string) => boolean                                      | 检查工具是否已注册       |
| getRegistered | () => string[]                                                 | 获取所有已注册的工具名称 |

#### AgentToolcallConfig 配置

| 属性名       | 类型                                        | 说明                                       | 必传 |
| ------------ | ------------------------------------------- | ------------------------------------------ | ---- |
| name         | string                                      | 工具调用名称，需要与后端定义的工具名称一致 | Y    |
| description  | string                                      | 工具调用描述                               | N   |
| parameters   | Array<{ name: string; type: string; required?: boolean }> | 参数定义数组                               | N    |
| component    | React.ComponentType<ToolcallComponentProps> | 自定义渲染组件                             | Y    |
| handler      | (args: TArgs, backendResult?: any) => Promise<TResult>           | 非交互式工具的处理函数（可选）             | N    |
| subscribeKey |  (props: ToolcallComponentProps<TArgs, TResult>) => string | undefined             | 状态订阅 key 提取函数（可选）, 返回值用于订阅对应的状态数据，不配置或不返回则订阅所有的状态变化              | N    |

#### ToolcallComponentProps 组件属性

| 属性名     | 类型                                                 | 说明                                |
| ---------- | ---------------------------------------------------- | ----------------------------------- |
| status     | 'idle' \\| 'executing' \\| 'complete' \\| 'error' | 工具调用状态                        |
| args       | TArgs                                                | 解析后的工具调用参数                |
| result     | TResult                                              | 工具调用结果                        |
| error      | Error                                                | 错误信息（当 status 为 'error' 时） |
| respond    | (response: TResponse) => void                        | 响应回调函数（用于交互式工具）      |
| agentState | Record<string, any>                                  | 订阅的状态数据，返回依赖subscribeKey这里的配置 |


### ToolCallRenderer

工具调用的统一渲染组件，负责根据工具名称自动查找配置、解析参数、管理状态并渲染对应的 UI 组件。

#### Props

| 属性名    | 类型                                        | 说明                                           | 必传 |
| --------- | ------------------------------------------- | ---------------------------------------------- | ---- |
| toolCall  | ToolCall [对象结构](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chat-engine/type.ts#L97)                                    | 工具调用对象，包含 toolCallName、args、result 等信息 | Y    |
| onRespond | (toolCall: ToolCall, response: any) => void | 交互式工具的响应回调，用于将用户输入返回给后端 | N    |


### useAgentState

用于订阅 AG-UI 协议状态事件的 Hook，提供灵活的状态订阅机制。

> 💡 **使用建议**：详细的使用说明和场景示例请参考上方 [工具状态订阅](#工具状态订阅) 章节。

#### 参数

| 参数名  | 类型               | 说明             | 必传 |
| ------- | ------------------ | ---------------- | ---- |
| options | StateActionOptions | 状态订阅配置选项 | N    |

#### StateActionOptions 配置

| 属性名       | 类型                | 说明                                                                 | 必传 |
| ------------ | ------------------- | -------------------------------------------------------------------- | ---- |
| subscribeKey | string              | 指定要订阅的 stateKey，不传入时订阅最新状态                          | N    |
| initialState | Record<string, any> | 初始状态值                                                           | N    |

#### 返回值

| 返回值          | 类型                                                | 说明                                     |
| --------------- | --------------------------------------------------- | ---------------------------------------- |
| stateMap        | Record<string, any>                                 | 状态映射表，格式为 { [stateKey]: stateData } |
| currentStateKey | string \\| null                                      | 当前活跃的 stateKey                      |
| setStateMap     | (stateMap: Record<string, any> \\| Function) => void | 手动设置状态映射表的方法                 |
| getCurrentState | () => Record<string, any>                           | 获取当前完整状态的方法                   |
| getStateByKey   | (key: string) => any                                | 获取特定 key 状态的方法                  |

### useAgentActivity

用于注册 Activity 配置的 Hook，支持自动注册和手动注册两种模式。Activity 专注于纯展示场景，通过流式更新实现动态内容展示。

#### 参数

| 参数名 | 类型                                                              | 说明                                                     | 必传 |
| ------ | ----------------------------------------------------------------- | -------------------------------------------------------- | ---- |
| config | ActivityConfig \\| ActivityConfig[] \\| null \\| undefined | Activity 配置对象或数组，传入时自动注册，不传入时手动注册 | N    |

#### 返回值

| 返回值        | 类型                                                           | 说明                     |
| ------------- | -------------------------------------------------------------- | ------------------------ |
| register      | (config: ActivityConfig \\| ActivityConfig[]) => void | 手动注册 Activity 配置         |
| unregister    | (names: string \\| string[]) => void                            | 取消注册 Activity 配置         |
| isRegistered  | (name: string) => boolean                                      | 检查 Activity 是否已注册       |
| getRegistered | () => string[]                                                 | 获取所有已注册的 Activity 类型 |

#### ActivityConfig 配置

| 属性名       | 类型                                        | 说明                                       | 必传 |
| ------------ | ------------------------------------------- | ------------------------------------------ | ---- |
| activityType | string                                      | Activity 类型名称，需要与后端定义的类型一致 | Y    |
| description  | string                                      | Activity 描述                               | N   |
| component    | React.ComponentType<ActivityComponentProps> | 自定义渲染组件                             | Y    |

#### ActivityComponentProps 组件属性

| 属性名       | 类型   | 说明                                |
| ------------ | ------ | ----------------------------------- |
| activityType | string | Activity 类型名称                    |
| content      | any    | Activity 内容数据                    |
| messageId    | string | 消息 ID                             |

### ActivityRenderer

Activity 的统一渲染组件，负责根据 Activity 类型自动查找配置并渲染对应的 UI 组件。

#### Props

| 属性名   | 类型         | 说明                                           | 必传 |
| -------- | ------------ | ---------------------------------------------- | ---- |
| activity | ActivityData | Activity 数据对象，包含 activityType、content、messageId 等信息 | Y    |

#### ActivityData 对象结构

| 属性名       | 类型   | 说明                                |
| ------------ | ------ | ----------------------------------- |
| activityType | string | Activity 类型名称                    |
| content      | any    | Activity 内容数据                    |
| messageId    | string | 消息 ID                             |


### 生成式 UI API

以下是生成式 UI 相关的核心 API，用于创建和配置 AI 动态生成的界面组件。

#### generateCatalogPrompt

生成 AI 系统提示词的工具函数，用于告诉 AI/LLM 可以生成哪些组件及其 props 约束。生成的 prompt 包含组件文档、props 说明、actions 白名单和 JSON Schema 示例。

##### 参数

| 属性名         | 类型                                                        | 说明                                                                                           | 必传 |
| -------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---- |
| name           | string                                                      | Catalog 名称，用于标识组件集合                                                                 | N    |
| components     | Record<string, ComponentDoc>                                | 自定义组件定义，key 为组件名，value 包含 props（Zod Schema 或字符串描述）和 description        | N    |
| actions        | Record<string, { description: string }>                     | 自定义 actions 白名单，除内置的 submit/reset/cancel 外的额外操作                               | N    |
| includeExample | boolean                                                     | 是否在 prompt 中包含 JSON Schema 示例，默认 true                                               | N    |
| templateMode   | 'default' \\| 'a2ui' \\| 'custom'                            | Prompt 模板模式：default（标准 json-render）、a2ui（A2UI 协议）、custom（自定义模板）          | N    |
| customTemplate | (context: { name, components, actions }) => string          | 自定义模板生成器函数，仅当 templateMode='custom' 时使用                                        | N    |

##### 返回值

| 类型   | 说明                                                     |
| ------ | -------------------------------------------------------- |
| string | 完整的 AI 系统提示词，包含组件文档、props 说明和使用示例 |

##### ComponentDoc 类型

| 属性名      | 类型                                  | 说明                                                  |
| ----------- | ------------------------------------- | ----------------------------------------------------- |
| description | string                                | 组件描述                                              |
| props       | Record<string, string> \\| ZodObject   | Props 定义，支持字符串描述或 Zod Schema               |
| hasChildren | boolean                               | 是否支持子组件                                        |

---

#### createJsonRenderActivityConfig

创建 json-render Activity 配置的工厂函数，用于配置生成式 UI 的渲染行为和交互处理。

##### 参数 (JsonRenderActivityConfigOptions)

| 属性名         | 类型                                                               | 说明                                                                           | 必传 |
| -------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ---- |
| activityType   | string                                                             | Activity 类型标识，需要与后端返回的 activityType 一致，默认 'json-render'      | N    |
| registry       | ComponentRegistry                                                  | 组件注册表，默认使用内置的 tdesignRegistry                                     | N    |
| actionHandlers | Record<string, (params: Record<string, unknown>) => void \\| Promise<void>> | Action 处理器映射表，定义按钮点击等交互的处理函数                              | N    |
| debug          | boolean                                                            | 是否显示调试信息，默认 false                                                   | N    |
| description    | string                                                             | Activity 描述信息                                                              | N    |

##### 返回值

| 类型                                     | 说明                                          |
| ---------------------------------------- | --------------------------------------------- |
| ActivityConfig<JsonRenderActivityProps['content']> | Activity 配置对象，可传入 useAgentActivity 注册 |

---

#### createA2UIJsonRenderActivityConfig

创建 A2UI + json-render Activity 配置的工厂函数，用于将 A2UI 协议自动转换为 json-render Schema 进行渲染。

##### 参数 (JsonRenderActivityConfigOptions)

| 属性名         | 类型                                                               | 说明                                                                           | 必传 |
| -------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ---- |
| activityType   | string                                                             | Activity 类型标识，默认 'a2ui-json-render'                                     | N    |
| registry       | ComponentRegistry                                                  | 组件注册表，默认使用 a2uiRegistry（支持 valuePath/disabledPath 自动绑定）      | N    |
| actionHandlers | Record<string, (params: Record<string, unknown>) => void \\| Promise<void>> | Action 处理器映射表                                                            | N    |
| debug          | boolean                                                            | 是否显示调试信息，默认 false                                                   | N    |
| description    | string                                                             | Activity 描述信息                                                              | N    |

##### 返回值

| 类型              | 说明                                          |
| ----------------- | --------------------------------------------- |
| ActivityConfig<any> | Activity 配置对象，可传入 useAgentActivity 注册 |

---

#### createCustomRegistry

创建自定义组件注册表的工厂函数，用于扩展内置组件，注册业务自定义组件的 React 实现。

##### 参数

| 参数名           | 类型                        | 说明                                                                     | 必传 |
| ---------------- | --------------------------- | ------------------------------------------------------------------------ | ---- |
| customComponents | ComponentRegistry           | 自定义组件映射表，key 为组件名（需与 Catalog 中一致），value 为 React 组件 | Y    |
| options          | CreateCustomRegistryOptions | 配置选项                                                                 | N    |

##### CreateCustomRegistryOptions

| 属性名            | 类型    | 说明                                                                                       | 必传 |
| ----------------- | ------- | ------------------------------------------------------------------------------------------ | ---- |
| enableStableProps | boolean | 是否自动使用 React.memo + 深比较优化组件性能，默认 false（ElementRenderer 已有内置优化）    | N    |

##### 返回值

| 类型              | 说明                                               |
| ----------------- | -------------------------------------------------- |
| ComponentRegistry | 合并后的组件注册表，包含内置组件和自定义组件       |

##### ComponentRegistry 类型

组件注册表是一个组件名到 React 组件的映射对象：

```typescript
type ComponentRegistry = Record<string, React.ComponentType<ComponentRenderProps>>;
```

##### ComponentRenderProps

| 属性名   | 类型                | 说明                                     |
| -------- | ------------------- | ---------------------------------------- |
| element  | JsonRenderElement   | 元素对象，包含 type、props、children 等  |
| children | React.ReactNode     | 子元素渲染结果                           |


## 常见问题

### 回调机制 vs 事件总线如何选择？

ChatEngine 提供了两种机制处理事件：`chatServiceConfig` 中的回调函数和 `eventBus` 事件总线。

| 场景 | 回调机制 | 事件总线 | 说明 |
|------|:--------:|:--------:|------|
| 解析 SSE 数据转换为消息内容 | ✅ 推荐 | ❌ | `onMessage` 可 return 值影响消息 |
| 自定义请求参数/headers | ✅ 推荐 | ❌ | `onRequest` 处理请求配置 |
| 日志记录和监控 | ⚠️ 可用 | ✅ 推荐 | 事件总线更解耦 |
| 跨组件状态同步 | ❌ | ✅ 推荐 | 多组件订阅同一事件 |
| 埋点和数据分析 | ⚠️ 可用 | ✅ 推荐 | 副作用与数据流分离 |
| 等待特定事件完成（Promise） | ❌ | ✅ 推荐 | `waitFor` 独有能力 |

**简单判断**：
- **数据转换**用回调（`onMessage`/`onRequest`）—— 可以 return 值影响数据流
- **副作用处理**用事件总线 —— 日志、统计、通知、跨组件通信

```javascript
// 推荐：混合使用
const { chatEngine } = useChat({
  chatServiceConfig: {
    // ✅ 回调：数据转换
    onMessage: (chunk) => ({ type: 'text', data: chunk.data?.content }),
  },
});

// ✅ 事件总线：副作用
useEffect(() => {
  const unsub = chatEngine.eventBus.on(ChatEngineEventType.REQUEST_COMPLETE, () => {
    // 埋点、通知等
  });
  return unsub;
}, [chatEngine.eventBus]);
```

### Activity 和 ToolCall 如何选择？

| 场景 | 推荐 | 理由 |
|------|------|------|
| 纯展示类 UI（图表、进度条、数据可视化） | Activity | 轻量、专注展示 |
| 需要流式增量更新的内容（实时股票、日志流） | Activity | 原生支持 JSON Patch |
| 需要用户交互的表单收集（Human-in-the-Loop） | ToolCall | 支持 `respond` 回调 |
| 需要订阅全局 `agentState` 的组件 | ToolCall | 支持 `subscribeKey` |
| 需要细粒度生命周期控制（idle/executing/complete/error） | ToolCall | 完整状态机 |

**简单判断**：只展示后端数据 → Activity；需要交互或全局状态 → ToolCall。

### 为什么使用 useAgentToolcall 而不是自定义渲染？

| 对比项 | useAgentToolcall | 自定义渲染 |
|--------|------------------|------------|
| 配置内聚性 | ✅ 工具定义、参数、UI 集中管理 | ❌ 分散在多处 |
| 类型安全 | ✅ 完整的 TypeScript 支持 | ⚠️ 需手动维护 |
| 状态订阅 | ✅ 内置 `subscribeKey` + `agentState` | ❌ 需自行实现 |
| 可移植性 | ✅ 配置可跨项目复用 | ❌ 与业务代码耦合 |
| 错误边界 | ✅ 内置保护 | ❌ 需自行添加 |
