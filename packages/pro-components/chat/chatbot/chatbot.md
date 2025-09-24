---
title: Chatbot 智能对话
description: 功能完备的智能对话组件，专为快速集成AI应用而设计。组件内置了完整的状态管理、SSE流式传输、消息渲染和交互逻辑，支持多种业务场景，包括智能客服、问答系统、代码助手、任务规划等。
isComponent: true
spline: navigation
---

## 基本用法

### 标准化集成

组件内置状态管理，SSE 解析，自动处理消息内容渲染与交互逻辑，可开箱即用快速集成实现标准聊天界面。本示例演示了如何快速创建一个具备以下功能的智能对话组件：

- 初始化预设消息
- 预设消息内容渲染支持（markdown、搜索、思考、建议等）
- 与服务端的 SSE（Server-Sent Events）通信，支持流式消息响应
- 自定义流式内容结构解析
- 自定义请求参数处理
- 常用消息操作处理及回调（复制、重试、点赞/点踩）
- 支持手动触发填入 prompt, 重新生成，发送消息等

{{ simple }}

### 组合式用法

可以通过 `useChat` Hook 提供的对话引擎实例及状态控制方法，同时自行组合拼装`ChatList`，`ChatMessage`, `ChatSender`等组件集成聊天界面，适合需要深度定制组件结构和消息处理流程的场景
{{ hookComponent }}

### 自定义

如果组件内置的消息渲染方案不能满足需求，还可以通过自定义**消息结构解析逻辑**和**消息内容渲染组件**来实现更多渲染需求。以下示例给出了一个自定义实现图表渲染的示例，实现自定义渲染需要完成**四步**，概括起来就是：**扩展类型，准备组件，解析数据，植入插槽**：

- 1、扩展自定义消息体 type 类型
- 2、实现自定义渲染的组件，示例中使用了 tvision-charts-react 实现图表渲染
- 3、流式数据增量更新回调`onMessage`中可以对返回数据进行标准化解构，返回渲染组件所需的数据结构，同时可以通过返回`strategy`来决定**同类新增内容块**的追加策略（merge/append），如果需要更灵活影响到数据整合可以返回完整消息数组`AIMessageContent[]`，或者注册合并策略方法（参考下方‘任务规划’示例）
- 4、在 render 函数中遍历消息内容数组，植入自定义消息体渲染插槽，需保证 slot 名在 list 中的唯一性

如果组件内置的几种操作 `TdChatMessageActionName` 不能满足需求，示例中同时给出了**自定义消息操作区**的方法，可以自行实现更多操作。

{{ custom }}

## 场景化示例

以下再通过几个常见的业务场景，展示下如何使用 `Chatbot` 组件

### 代码助手

通过使用 tdesign 开发登录框组件的案例，演示了使用 Chatbot 搭建简单的代码助手场景，该示例你可以了解到如何按需开启**markdown 渲染代码块**，如何**自定义实现代码预览**
{{ code }}

### 文案助手

以下案例演示了使用 Chatbot 搭建简单的文案写作助手应用，通过该示例你可以了解到如何**发送附件**，同时演示了**附件类型的内容渲染**
{{ docs }}

### 图像生成

以下案例演示了使用 Chatbot 搭建简单的图像生成应用，通过该示例你可以了解到如何**自定义输入框操作区域**，同时演示了**自定义生图内容渲染**
{{ image }}

### 任务规划

以下案例模拟了使用 Chatbot 搭建任务规划型智能体应用，分步骤依次执行并输出结果，通过该示例你可以了解到如何**注册自定义消息内容合并策略**，**自定义消息插槽名规则**，同时演示了**自定义任务流程渲染**
{{ agent }}

### 非流式输出模式

该示例适用于需要与`不支持流式传输的后端服务进行交互`，或者需要更简单、更可控的请求-响应模式的场景。

- **非流式配置**：通过 `stream: false` 关闭流式传输，使用传统的请求-响应模式
- **完整响应处理**：在 `onComplete` 回调中处理完整的响应数据

{{ nostream }}

## AG-UI 协议适配

[AG-UI（Agent-User Interface)](https://docs.ag-ui.com/introduction) 是一个专为 AI Agent 与前端应用交互设计的轻量级协议，专注于实时交互、状态流式传输和人机协作。Chatbot 组件内置了对 AG-UI 协议的支持，可以**无缝集成符合 AG-UI 标准的后端服务**。

### 文本消息

以下示例演示了如何使用 Chatbot 组件与 AG-UI 协议后端进行基础交互：

- **协议配置**：通过 `protocol: 'agui'` 开启 AG-UI 协议解析支持
- **事件处理**：组件自动解析 AG-UI 标准事件类型（如 `TEXT_MESSAGE_*`、`THINKING_*`、`TOOL_CALL_*` 等）

{{ agui }}

### 工具调用

基于 AG-UI 协议的**视频剪辑助手**组件，展示了如何基于`useAgentToolcall`提供的自定义组件注册机制，完成订阅`TOOL_CALL_*`事件数据流，并通过`useAgentState`完成`STATE_*`事件数据流的订阅。该组件能够实时显示视频剪辑任务的进度，并提供交互式的步骤查看功能。
{{ videoclipState }}

### 交互式步骤规划

该示例通过一个完整的**旅游规划 Agent 场景**，演示了如何使用 AG-UI 协议构建复杂的**多步骤任务规划**应用，包括了**16 种标准化事件类型**的应用示例，同时演示了状态流式传输、人机协作工作流和丰富的自定义消息渲染形式。：

- **多步骤流程**：支持分步骤执行复杂任务（如旅游规划）
- **状态管理**：实时更新应用状态，支持状态快照和增量更新
- **Human-in-the-Loop**：支持人机协作，在流程中插入用户输入环节
- **工具调用**：集成外部工具调用，如天气查询、行程规划等
- **历史消息**：支持加载和展示历史对话记录
- **自定义渲染**：针对不同内容类型（天气、行程、酒店等）提供专门的渲染组件

{{ travelToolcall }}

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

### useAgentToolcall Hook

useAgentToolcall 是用于注册 AG-UI 协议工具调用组件的 Hook，它提供了统一的工具调用适配器机制，支持自定义工具调用的渲染组件和交互逻辑。

#### 基本用法

```javascript
import { useAgentToolcall, createToolConfigWithState } from '@tencent/tdesign-chatbot-dev';

// 方式一：自动注册模式
const toolConfigs = [
  {
    name: 'weather_query',
    description: '查询天气信息',
    parameters: [{ name: 'city', type: 'string', required: true, description: '城市名称' }],
    component: WeatherComponent,
  },
];

const { register, unregister, isRegistered } = useAgentToolcall(toolConfigs);

// 方式二：手动注册模式
const { register, unregister, isRegistered } = useAgentToolcall();

useEffect(() => {
  register({
    name: 'custom_tool',
    description: '自定义工具',
    parameters: [],
    component: CustomComponent,
  });
}, [register]);

// 方式三：带状态感知的工具配置
const toolConfigWithState = createToolConfigWithState({
  name: 'show_steps',
  description: '显示步骤信息',
  parameters: [{ name: 'stepId', type: 'string' }],
  component: ({ status, args, agentState }) => {
    const stepData = agentState?.[args.stepId];
    return <StepDisplay data={stepData} />;
  },
});

useAgentToolcall([toolConfigWithState]);
```

#### 参数说明

| 参数名 | 类型                                                              | 说明                                                     |
| ------ | ----------------------------------------------------------------- | -------------------------------------------------------- |
| config | AgentToolcallConfig \| AgentToolcallConfig[] \| null \| undefined | 工具调用配置对象或数组，传入时自动注册，不传入时手动注册 |

#### 返回值说明

| 返回值        | 类型                                                           | 说明                     |
| ------------- | -------------------------------------------------------------- | ------------------------ |
| register      | (config: AgentToolcallConfig \| AgentToolcallConfig[]) => void | 手动注册工具配置         |
| unregister    | (names: string \| string[]) => void                            | 取消注册工具配置         |
| isRegistered  | (name: string) => boolean                                      | 检查工具是否已注册       |
| getRegistered | () => string[]                                                 | 获取所有已注册的工具名称 |
| config        | any                                                            | 当前配置的引用           |

#### AgentToolcallConfig 配置说明

| 属性名      | 类型                                                  | 说明                                       | 必传 |
| ----------- | ----------------------------------------------------- | ------------------------------------------ | ---- |
| name        | string                                                | 工具调用名称，需要与后端定义的工具名称一致 | Y    |
| description | string                                                | 工具调用描述                               | Y    |
| parameters  | ParameterDefinition[]                                 | 参数定义数组                               | Y    |
| component   | React.ComponentType<ToolcallComponentProps>           | 自定义渲染组件                             | Y    |
| handler     | (args: TArgs, result?: TResult) => Promise<TResponse> | 非交互式工具的处理函数（可选）             | N    |

#### ParameterDefinition 参数定义

| 属性名      | 类型    | 说明                                         | 必传 |
| ----------- | ------- | -------------------------------------------- | ---- |
| name        | string  | 参数名称                                     | Y    |
| type        | string  | 参数类型（如 'string', 'number', 'boolean'） | Y    |
| required    | boolean | 是否必传                                     | N    |
| description | string  | 参数描述                                     | N    |

#### ToolcallComponentProps 组件属性

| 属性名  | 类型                                           | 说明                                |
| ------- | ---------------------------------------------- | ----------------------------------- |
| status  | 'idle' \| 'executing' \| 'complete' \| 'error' | 工具调用状态                        |
| args    | TArgs                                          | 解析后的工具调用参数                |
| result  | TResult                                        | 工具调用结果                        |
| error   | Error                                          | 错误信息（当 status 为 'error' 时） |
| respond | (response: TResponse) => void                  | 响应回调函数（用于交互式工具）      |

#### createToolConfigWithState 辅助函数

用于创建带状态感知的工具配置，自动为组件注入 `agentState` 属性：

```javascript
const config = createToolConfigWithState({
  name: 'tool_name',
  description: '工具描述',
  parameters: [],
  component: ({ status, args, agentState }) => {
    // agentState 会自动注入当前的状态数据
    return <YourComponent />;
  },
});
```

### useAgentState Hook

useAgentState 是用于订阅 AG-UI 协议状态事件的 Hook，它提供了灵活的状态订阅机制，根据是否传入 stateKey 自动决定订阅模式。

#### 基本用法

```javascript
import { useAgentState, AgentStateProvider } from '@tencent/tdesign-chatbot-dev';

// 方式一：在组件中直接使用
const MyComponent = () => {
  const { state, setStateMap, stateKey } = useAgentState({
    initialState: {},
    stateKey: 'my-task-id', // 可选，用于状态隔离
  });

  // 处理历史状态恢复
  const loadHistoryState = (historyState) => {
    setStateMap(historyState);
  };

  return <div>{/* 使用状态数据 */}</div>;
};

// 方式二：使用 Provider 模式（推荐）
const App = () => {
  return (
    <AgentStateProvider initialState={{}}>
      <MyComponent />
    </AgentStateProvider>
  );
};

const MyComponent = () => {
  const { state, setStateMap } = useAgentStateContext();
  return <div>{/* 使用状态数据 */}</div>;
};
```

#### 参数说明

| 参数名  | 类型               | 说明             |
| ------- | ------------------ | ---------------- |
| options | StateActionOptions | 状态订阅配置选项 |

#### StateActionOptions 配置说明

| 属性名       | 类型                | 说明                                                                                                                                    | 必传 |
| ------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| stateKey     | string              | 指定要订阅的 stateKey。传入时为绑定模式（适用于状态隔离场景），不传入时为最新模式（适用于状态覆盖场景）。多轮对话建议设置，一般为 runId | N    |
| initialState | Record<string, any> | 初始状态值，用于设置 stateMap 的初始值                                                                                                  | N    |

#### 返回值说明

| 返回值          | 类型                                                                                            | 说明                                                             |
| --------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| state           | Record<string, any>                                                                             | 当前状态数据映射表，包含所有订阅的状态                           |
| stateKey        | string \| null                                                                                  | 当前活跃状态的 key（latest 模式）或绑定的 stateKey（bound 模式） |
| setStateMap     | (stateMap: Record<string, any> \| ((prev: Record<string, any>) => Record<string, any>)) => void | 手动设置状态映射表的方法，支持函数式更新                         |
| getCurrentState | () => Record<string, any>                                                                       | 获取当前完整状态的方法                                           |
| getStateByKey   | (key: string) => any                                                                            | 获取特定 key 状态的方法                                          |

#### 订阅模式说明

**绑定模式（Bound Mode）**：

- 使用场景：状态隔离，多个任务并行执行
- 触发条件：传入 `stateKey` 参数
- 行为：只订阅指定 stateKey 的状态变化

**最新模式（Latest Mode）**：

- 使用场景：状态覆盖，单任务执行
- 触发条件：不传入 `stateKey` 参数
- 行为：订阅最新的状态变化，自动切换到最新的 stateKey

#### 状态数据结构

AG-UI 协议的状态数据通常包含以下结构：

```javascript
interface StateData {
  items: Array<{
    label: string,
    status: 'pending' | 'running' | 'completed' | 'failed',
    content: string,
    items?: Array<{
      label: string,
      status: string,
      content: string,
    }>,
  }>;
}

// 实际使用中的状态结构示例
const exampleState = {
  'task-123': {
    items: [
      {
        label: '步骤1：数据收集',
        status: 'completed',
        content: '已完成数据收集',
        items: [{ label: '子任务1', status: 'completed', content: '完成' }],
      },
      {
        label: '步骤2：数据处理',
        status: 'running',
        content: '正在处理数据...',
      },
    ],
  },
};
```

### useAgentStateContext Hook

用于在组件树中获取 AgentStateProvider 提供的状态上下文：

```javascript
import { useAgentStateContext } from '@tencent/tdesign-chatbot-dev';

const MyComponent = () => {
  const { state, setStateMap, stateKey } = useAgentStateContext();

  // 必须在 AgentStateProvider 内部使用
  return <div>{/* 使用状态 */}</div>;
};
```

#### 返回值

返回值与 `useAgentState` 相同，包含完整的状态管理接口。

#### 注意事项

- 必须在 `AgentStateProvider` 组件内部使用
- 如果在 Provider 外部使用会抛出错误
- 推荐在需要跨组件共享状态时使用

## 故障排查

### 常见问题

1. **消息不显示**

   - 检查`chatServiceConfig.onMessage`返回值格式
   - 确认消息数据结构符合类型定义

2. **流式传输中断**

   - 检查网络连接和 SSE 端点
   - 确认服务端正确发送 SSE 格式数据

3. **自定义组件不渲染**

   - 检查 slot 名称是否符合规则
   - 确认组件已正确注册

4. **AG-UI 协议解析失败**
   - 确认`protocol: 'agui'`配置正确
   - 检查事件数据格式是否符合 AG-UI 标准

### 调试技巧

```javascript
// 开启调试模式
const chatServiceConfig = {
  endpoint: '/api/chat',
  onMessage: (chunk) => {
    console.log('Received chunk:', chunk); // 调试消息接收
    return parseMessage(chunk);
  },
  onError: (error) => {
    console.error('Chat error:', error); // 调试错误信息
  },
};

// 监听消息变化
useEffect(() => {
  console.log('Messages updated:', messages);
}, [messages]);
```

## 常见问题

### Q: 如何处理网络错误？

A: 在 chatServiceConfig 中配置 onError 回调：

```javascript
const chatServiceConfig = {
  endpoint: '/api/chat',
  onError: (error) => {
    if (error instanceof Response) {
      // HTTP错误
      if (error.status === 429) {
        console.log('请求过于频繁，请稍后再试');
      }
    } else {
      // 网络错误
      console.log('网络连接异常');
    }
  },
};
```

### Q: 如何自定义消息样式？

A: 使用 messageProps 配置：

```javascript
const messageProps = (message) => ({
  placement: message.role === 'user' ? 'right' : 'left',
  avatar: message.role === 'user' ? '/user.png' : '/bot.png',
  className: `message-${message.role}`,
});
```

### Q: 如何实现消息持久化？

A: 监听消息变化并保存：

```javascript
<ChatBot
  onMessageChange={(e) => {
    localStorage.setItem('chat-messages', JSON.stringify(e.detail));
  }}
  defaultMessages={JSON.parse(localStorage.getItem('chat-messages') || '[]')}
/>
```
