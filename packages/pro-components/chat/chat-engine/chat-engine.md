---
title: ChatEngine 对话引擎
description: 智能体对话底层逻辑引擎，提供灵活的 Hook API 用于深度定制。
isComponent: true
spline: navigation
---

## 阅读指引

ChatEngine 是一个底层对话引擎，提供灵活的 Hook API 用于深度定制。支持自定义 UI 结构、消息处理和 AG-UI 协议，适合构建复杂智能体应用，如工具调用、多步骤任务规划、状态流式传输等场景，相比 Chatbot 组件提供了更高的灵活性，适合需要**深度定制 UI 结构和消息处理流程**的场景。Chatbot组件本身也是基于 ChatEngine 构建的。

建议按以下路径循序渐进阅读:

1. **快速开始** - 了解 useChat Hook 的基本用法
2. **基础用法** - 掌握数据处理、消息管理、UI 定制、生命周期
3. **高级定制** - 学习自定义渲染和合并策略
4. **AG-UI 协议** - 学习 AG-UI 协议的使用和高级特性

> 💡 **示例说明**：所有示例都基于 Mock SSE 服务，可以打开浏览器开发者工具（F12），切换到 Network（网络）标签，查看接口的请求和响应数据，了解数据格式。


## 快速开始

最简单的示例，使用 `useChat` Hook 创建对话引擎，组合 `ChatList`、`ChatMessage`、`ChatSender` 组件构建聊天界面。

{{ basic }}

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
- **AG-UI 协议**：当后端服务符合 [AG-UI 协议](/react-aigc/agui) 时，只需设置 `protocol: 'agui'`，无需编写 `onMessage` 进行数据转换，大大简化了接入流程。详见下方 [AG-UI 协议](#ag-ui-协议) 章节。

这部分的配置用法与Chatbot中一致，示例可以参考 [Chatbot 数据处理](/react-aigc/components/chatbot#数据处理) 章节。

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


- **自定义操作栏**：如果组件库内置的 [`ChatActionbar`](/react-aigc/components/chat-actionbar) 不能满足需求，可以通过 `slot='actionbar'` 属性来渲染自定义组件。

- **自定义输入区域**：如果需要自定义ChatSender输入区，可用插槽详见[ChatSender插槽](/react-aigc/components/chat-sender?tab=api#插槽) 


{{ custom-content }}

### 综合示例

在了解了以上各个基础属性的用法后，这里给出一个完整的示例，展示如何在生产实践中综合使用多个功能：初始消息、消息配置、数据转换、请求配置、实例方法和自定义插槽。

{{ comprehensive }}


## AG-UI 协议

[AG-UI（Agent-User Interface)](https://docs.ag-ui.com/introduction) 是一个专为 AI Agent 与前端应用交互设计的轻量级协议，专注于实时交互、状态流式传输和人机协作。ChatEngine 内置了对 AG-UI 协议的支持，可以**无缝集成符合 AG-UI 标准的后端服务**。

### 基础用法

开启 AG-UI 协议支持（`protocol: 'agui'`），组件会自动解析标准事件类型（如 `TEXT_MESSAGE_*`、`THINKING_*`、`TOOL_CALL_*`、`STATE_*` 等）。使用`AGUIAdapter.convertHistoryMessages`方法即可实现符合[`AGUIHistoryMessage`](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chat-engine/adapters/agui/types.ts)数据结构的历史消息回填。

{{ agui-basic }}

### 工具调用

使用 `useAgentToolcall` Hook 注册自定义工具组件，订阅 `TOOL_CALL_*` 事件数据流，并通过 `useAgentState` 订阅 `STATE_*` 事件数据流。

**示例场景：视频剪辑助手**
- 实时显示视频剪辑任务的进度
- 提供交互式的步骤查看功能
- 展示工具调用和状态管理的完整流程

{{ agui-toolcall }}

### 综合示例

一个完整的**旅游规划 Agent 场景**，演示了如何使用 AG-UI 协议构建复杂的**多步骤任务规划**应用。

**核心特性：**
- **16 种标准化事件类型**：完整展示 AG-UI 协议的事件体系
- **多步骤流程**：支持分步骤执行复杂任务（如旅游规划）
- **状态流式传输**：实时更新应用状态，支持状态快照和增量更新
- **Human-in-the-Loop**：支持人机协作，在流程中插入用户输入环节
- **工具调用**：集成外部工具调用，如天气查询、行程规划等
- **历史消息**：支持加载和展示历史对话记录
- **自定义渲染**：针对不同内容类型（天气、行程、酒店等）提供专门的渲染组件

{{ agui-comprehensive }}

## API

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
| chatEngine | IChatEngine        | 聊天引擎实例，提供核心操作方法，详见下方 `ChatEngine 实例方法` |
| messages   | ChatMessagesData[] | 当前聊天消息列表所有数据                                  |
| status     | ChatStatus         | 当前聊天状态（idle/pending/streaming/complete/stop/error） |

### ChatServiceConfig 配置说明

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

### ChatEngine 实例方法

通过 `chatEngine` 获取引擎实例，调用以下方法。

| 名称                  | 类型                                                                              | 描述                                         |
| --------------------- | --------------------------------------------------------------------------------- | -------------------------------------------- |
| setMessages           | (messages: ChatMessagesData[], mode?: 'replace' \| 'prepend' \| 'append') => void | 批量设置消息                                 |
| sendUserMessage       | (params: ChatRequestParams) => Promise<void>                                      | 发送用户消息，处理请求参数并触发消息流       |
| sendAIMessage         | (params: ChatRequestParams) => Promise<void>                                      | 发送 AI 消息，处理请求参数并触发消息流       |
| sendSystemMessage     | (msg: string) => void                                                             | 发送系统级通知消息，用于展示系统提示/警告    |
| abortChat             | () => Promise<void>                                                               | 中止当前进行中的聊天请求，清理网络连接       |
| regenerateAIMessage   | (keepVersion?: boolean) => Promise<void>                                          | 重新生成最后一条消息，可选保留历史版本       |
| registerMergeStrategy | (type: T['type'], handler: (chunk: T, existing?: T) => T) => void                 | 注册自定义消息合并策略，用于处理流式数据更新 |

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
import { useAgentStateContext } from '@tdesign-react/chat';

const MyComponent = () => {
  const { state, setStateMap, stateKey } = useAgentStateContext();

  // 必须在 AgentStateProvider 内部使用
  return <div>{/* 使用状态 */}</div>;
};
```

#### 返回值

返回值与 `useAgentState` 相同，包含完整的状态管理接口。