---
name: tdesign-pro-component
description: This skill should be used when developing or modifying TDesign Pro Components (AIGC/Chat). It provides the ChatEngine architecture, component patterns, AG-UI protocol integration, and Generative UI development guide.
---

# TDesign Pro Component 开发指南（AIGC/Chat）

本技能提供 TDesign AIGC/Chat 组件套件的开发指南，涵盖 ChatEngine 架构、组件开发模式、AG-UI 协议集成和 Generative UI 开发。

## 触发条件

当用户需要执行以下任务时使用此技能：
- 开发或修改 Chat 相关组件
- 集成 ChatEngine 或 AG-UI 协议
- 创建自定义 AI 对话界面
- 实现 Tool Call、Activity 等高级功能
- 使用 Generative UI（json-render / A2UI）
- 调试 Chat 组件行为

## 源码与文档位置

| 资源 | 路径 |
|------|------|
| **组件源码** | `packages/pro-components/chat/` |
| **ChatEngine Agent 指南** | `packages/pro-components/chat/chat-engine/AGENTS.md` |
| **架构设计文档** | `packages/pro-components/chat/chat-engine/docs/ARCHITECTURE.md` |
| **组件使用文档** | `packages/pro-components/chat/chat-engine/chat-engine.md` |
| **示例代码** | `packages/pro-components/chat/chat-engine/_example/` |
| **发布包** | `packages/tdesign-react-aigc/` |
| **npm 包名** | `@tdesign-react/chat` |

## 1. 组件架构总览

### 1.1 组件清单

`packages/pro-components/chat/` 导出以下组件：

| 组件 | 目录 | 说明 |
|------|------|------|
| **ChatBot** | `chatbot/` | 开箱即用的聊天机器人组件（ChatEngine + Preset UI） |
| **ChatEngine** | `chat-engine/` | 底层对话引擎核心（Headless） |
| **ChatMessage** | `chat-message/` | 消息气泡组件 |
| **ChatSender** | `chat-sender/` | 消息发送组件 |
| **ChatActionbar** | `chat-actionbar/` | 操作栏组件 |
| **ChatMarkdown** | `chat-markdown/` | Markdown 渲染组件 |
| **ChatThinking** | `chat-thinking/` | 思考过程展示组件 |
| **ChatLoading** | `chat-loading/` | 加载状态组件 |
| **ChatFilecard** | `chat-filecard/` | 文件卡片组件 |
| **Attachments** | `attachments/` | 附件组件 |

### 1.2 两种使用模式

```
┌─────────────────────────────────────────────────────┐
│                   开发者选择                          │
│                                                      │
│  方式 A: ChatBot（开箱即用）                           │
│  ────────────────────                                │
│  <ChatBot chatServiceConfig={...} />                 │
│  适合：快速集成，标准对话场景                           │
│                                                      │
│  方式 B: ChatEngine + 原子组件（深度定制）              │
│  ────────────────────────────────                    │
│  const { chatEngine, messages } = useChat({...});    │
│  <ChatList><ChatMessage /><ChatSender /></ChatList>  │
│  适合：复杂布局，自定义 UI，多步骤 Agent               │
└─────────────────────────────────────────────────────┘
```

## 2. ChatEngine 核心概念

### 2.1 核心 Hooks

#### useChat — 主 Hook

```typescript
import { useChat } from '@tdesign-react/chat';

const { chatEngine, messages, status } = useChat({
  chatServiceConfig: {
    endpoint: '/api/chat',
    protocol: 'agui',      // 推荐: 'agui' | 'default' | 'openclaw'
    stream: true,
    onRequest: (params) => ({ ...params, headers: { Authorization: '...' } }),
    onMessage: (chunk) => ({ /* 自定义解析, protocol='default' 时需要 */ }),
    onStart: () => {},
    onComplete: () => {},
    onError: (err) => {},
  },
  defaultMessages: [],     // 初始消息
});
```

#### useAgentToolcall — 工具调用注册

```typescript
import { useAgentToolcall } from '@tdesign-react/chat';

useAgentToolcall({
  name: 'weather_query',           // 必须与后端工具名一致
  component: WeatherCard,          // React 组件, 接收 { args, result, status }
  subscribeKey: (props) => props.args?.taskId,  // 可选: 订阅特定状态
});
```

#### useAgentActivity — 动态内容注册

```typescript
import { useAgentActivity } from '@tdesign-react/chat';

useAgentActivity({
  activityType: 'stock-chart',     // 必须与后端 activity type 一致
  component: StockChart,           // React 组件, 接收 { content }
});
```

#### useAgentState — Agent 状态订阅

```typescript
import { useAgentState } from '@tdesign-react/chat';

const { stateMap, currentStateKey } = useAgentState();
// stateMap['task_1']?.percent → 获取 Agent 任务进度
```

### 2.2 支持的协议

| 协议 | `protocol` 值 | 传输方式 | 适用场景 |
|------|---------------|---------|----------|
| **Default** | `'default'` / 不传 | SSE (HTTP) | 标准 LLM 对话，用户在 `onMessage` 中自行解析 |
| **AG-UI** | `'agui'` | SSE (HTTP) | AG-UI 标准协议，自动解析 ToolCall/Activity/State/Thinking |
| **OpenClaw** | `'openclaw'` | WebSocket | 双向通信、RPC、设备认证 |

### 2.3 AG-UI 事件体系

使用 `protocol: 'agui'` 时，引擎自动处理以下事件：

| 事件类别 | 事件名 | 说明 |
|----------|--------|------|
| **文本消息** | `TEXT_MESSAGE_START/CONTENT/END` | 流式文本响应 |
| **思考过程** | `THINKING_START/CONTENT/END` | AI 思考过程 |
| **工具调用** | `TOOL_CALL_START/ARGS/END/RESULT` | Agent 工具使用 |
| **动态内容** | `ACTIVITY_START/SNAPSHOT/DELTA/END` | 动态 UI（Charts/Forms） |
| **状态同步** | `STATE_SNAPSHOT/STATE_DELTA` | 共享 Agent 状态 |

### 2.4 Generative UI

动态 UI 生成采用 **json-render** 理念，双层架构：

- **Catalog（约束层）**：定义 AI 可用组件的 Zod Schema
- **Registry（渲染层）**：定义组件的 React 渲染实现

```typescript
import { generateCatalogPrompt, createCustomRegistry, createJsonRenderActivityConfig } from '@tdesign-react/chat';

// 1. 生成系统提示词
const systemPrompt = generateCatalogPrompt(catalog);

// 2. 创建组件注册表
const registry = createCustomRegistry({ Button: MyButton, Chart: MyChart });

// 3. 配置 Activity
const activityConfig = createJsonRenderActivityConfig({ registry });
```

支持的协议：
- **json-render**：原生邻接表 Schema（扁平结构），详见 https://json-render.dev/docs
- **A2UI**：Google 邻接表 Schema，详见 https://a2ui.org/specification/v0.9-a2ui/

## 3. 开发工作流

### 3.1 本地开发

```bash
# 启动 AIGC 组件站点
pnpm dev:aigc

# 组件开发目录
packages/pro-components/chat/<component>/

# 示例文件
packages/pro-components/chat/chat-engine/_example/
```

### 3.2 构建

```bash
# 构建 AIGC 包
pnpm build:aigc

# 产物目录
packages/tdesign-react-aigc/es/
```

### 3.3 组件文件结构

```
packages/pro-components/chat/<component>/
├── <Component>.tsx          # 组件实现
├── index.ts                 # 导出
├── type.ts                  # 类型定义
├── defaultProps.ts          # 默认 props
├── <component>.md           # 组件文档（包含 {{ xxx }} 占位符）
├── style/                   # 样式
│   ├── index.js             # Less 入口
│   └── css.js               # CSS 入口
├── _example/                # TSX 示例
└── _example-js/             # JSX 示例（自动生成）
```

### 3.4 文档与示例映射

Pro 组件的文档**不使用** `:: BASE_DOC ::` 双层拼接（区别于基础组件），而是在组件自身的 `<component>.md` 中直接编写全部内容。

**映射规则**：Markdown 中的 `{{ xxx }}` 占位符对应 `_example/xxx.tsx` 文件中默认导出的 React 组件。

```markdown
---
title: ChatEngine 对话引擎
description: 智能体对话底层逻辑引擎
isComponent: true
spline: navigation
---

## 快速开始

{{ basic }}          ──→ _example/basic.tsx

## AG-UI 协议

{{ agui-basic }}     ──→ _example/agui-basic.tsx
{{ agui-toolcall }}  ──→ _example/agui-toolcall.tsx
```

> 🤖 **AI 索引路径**：要了解某个 Chat 组件的用法：
> 1. 读取 `<component>.md` 获取功能说明和示例索引
> 2. 通过 `{{ xxx }}` 定位 `_example/xxx.tsx` 获取可运行示例代码
> 3. `_example/` 中可能包含超出文档引用的辅助文件（如 `components/`、`utils/` 子目录）

## 4. Coding Standards

### 4.1 推荐做法

- ✅ **Prefer Hooks**：使用 `useChat`、`useAgentToolcall` 等，而非直接操作 ChatEngine 实例
- ✅ **Protocol First**：优先使用 `protocol: 'agui'`，自动处理流式解析
- ✅ **Generative UI Safety**：始终使用 Catalog 约束 AI 输出，禁止任意 HTML/JS
- ✅ **State via useAgentState**：跨组件状态共享使用 Agent State，而非 prop drilling
- ✅ **Slots for Customization**：使用 `messageSlot`、`headerSlot` 等插槽做 UI 定制

### 4.2 反模式（禁止）

- ❌ 不要手动解析 SSE 流（`protocol: 'agui'` 时 SDK 自动处理）
- ❌ 不要直接修改 `messages` 状态，使用 `chatEngine.sendUserMessage()`、`chatEngine.setMessages()`
- ❌ 不要使用 `dangerouslySetInnerHTML` 渲染 AI 内容，使用内置 Markdown 或 Generative UI
- ❌ 不要混用 `protocol: 'agui'` 和自定义 `onMessage`（除非明确需要覆盖特定事件处理）

## 5. 场景指引

### 5.1 快速开始（基础对话）

```tsx
import { useChat, ChatList, ChatMessage, ChatSender } from '@tdesign-react/chat';

const App = () => {
  const { chatEngine, messages } = useChat({
    chatServiceConfig: { endpoint: '/api/chat', stream: true },
  });
  return (
    <>
      <ChatList>
        {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </ChatList>
      <ChatSender chatEngine={chatEngine} />
    </>
  );
};
```

### 5.2 AG-UI 工具调用（Human-in-the-Loop）

```tsx
useAgentToolcall({
  name: 'search_flight',
  component: ({ args, respond }) => (
    <FlightForm
      defaultCity={args.city}
      onSubmit={(data) => respond(data)} // 将用户输入返回给 Agent
    />
  ),
});
```

### 5.3 Headless 事件总线

```tsx
chatEngine.eventBus.on(ChatEngineEventType.REQUEST_COMPLETE, (payload) => {
  logAnalytics(payload);
});
```

## 6. 参考资源

- **ChatEngine Agent 指南**: `packages/pro-components/chat/chat-engine/AGENTS.md`
- **架构文档**: `packages/pro-components/chat/chat-engine/docs/ARCHITECTURE.md`
- **更多示例**: `packages/pro-components/chat/chat-engine/_example/`
- **AG-UI 协议**: https://docs.ag-ui.com/introduction
- **json-render**: https://json-render.dev/docs
