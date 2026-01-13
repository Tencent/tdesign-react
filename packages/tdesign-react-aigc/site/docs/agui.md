---
title: 与AG-UI协议集成
order: 4
group:
  title: 快速上手
  order: 3
---

## 什么是 AG-UI

**AG-UI（Agent User Interaction Protocol）** 是专为 AI Agent 与前端应用交互设计的标准化协议。它建立了一套统一的[通信规范](https://docs.ag-ui.com/introduction)，让前端界面能够与各种 AI 服务无缝对话，就像是 AI 应用的"通用语言"。

AG-UI 采用**事件驱动模型**，通过标准化的事件流实现前后端解耦：

- **统一接口标准**：屏蔽不同 AI 供应商的差异，提供一致的交互体验
- **实时流式通信**：支持 SSE/WebSocket 等方式的流式数据传输
- **有状态会话管理**：维护完整的对话上下文和共享状态
- **工具调用机制**：标准化的工具定义、调用和结果处理流程

## 为什么选择 AG-UI 协议？

### 与传统对比

| 对比维度         | 传统自定义协议                   | AG-UI 标准协议                        |
| ---------------- | -------------------------------- | ------------------------------------- |
| **协议标准化**   | 各家自定义格式，互不兼容         | 统一标准，跨服务兼容                  |
| **事件模型**     | 简单请求-响应，缺乏细粒度控制    | 16 种标准事件，支持复杂交互流程       |
| **流式传输**     | 需自行设计流式协议和解析逻辑     | 标准化流式事件，开箱即用              |
| **状态管理**     | 无标准状态同步机制               | Snapshot + Delta 标准模式             |
| **工具调用**     | 各家格式不同，集成复杂           | 统一工具调用生命周期                  |
| **迁移适配成本** | 每个 AI 服务需单独开发前端适配层 | 一套前端代码适配所有遵循 AG-UI 的服务 |

### 核心价值

- **统一标准化**：通过统一的事件格式屏蔽底层 AI 服务的差异，一套前端代码可以处理所有遵循 AG-UI 协议的后端服务
- **组件标准化**：接口协议一致性使得消息渲染、工具调用等核心功能可跨项目复用
- **可扩展性**：标准化的扩展点，便于添加新功能

## 协议要点

### 事件类型速查

AG-UI 定义了[16 种标准事件类型](https://docs.ag-ui.com/concepts/events)，覆盖 AI 交互的完整生命周期：

| 事件分类         | 事件名                                                      | 含义                                                        |
| ---------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| **生命周期事件** | `RUN_STARTED` / `RUN_FINISHED` / `RUN_ERROR`                | 必须成对出现，标记 Agent 运行边界                           |
| **文本消息事件** | `TEXT_MESSAGE_START` / `TEXT_MESSAGE_CONTENT` / `TEXT_MESSAGE_END` | 流式文本输出，通过 delta 增量传输                           |
| **思考过程事件** | `THINKING_START` / `THINKING_END`                           | 思考过程的起止                                              |
|                  | `THINKING_TEXT_MESSAGE_START` / `CONTENT` / `END`           | 思考过程文本内容的流式传输                                  |
| **工具调用事件** | `TOOL_CALL_START` / `TOOL_CALL_ARGS` / `TOOL_CALL_END`      | 工具调用生命周期                                            |
|                  | `TOOL_CALL_RESULT`                                          | 工具执行结果                                                |
| **状态管理事件** | `STATE_SNAPSHOT` / `STATE_DELTA`                            | 全局状态同步，Delta 基于 JSON Patch（RFC 6902）             |
|                  | `MESSAGES_SNAPSHOT`                                         | 消息历史快照                                                |
| **Activity 事件** | `ACTIVITY_SNAPSHOT` / `ACTIVITY_DELTA`                     | 动态内容展示（图表、进度条等）                              |
| **步骤追踪事件** | `STEP_STARTED` / `STEP_FINISHED`                            | 可选，用于多步骤任务进度追踪                                |

### 事件流模式

AG-UI 事件遵循两种核心模式：

1. **Start → Content → End 模式**：用于流式内容（文本消息、工具调用）
2. **Snapshot → Delta 模式**：用于状态同步（全局状态、Activity）

### 交互流程

AG-UI 基于事件驱动架构，实现前后端的实时双向通信：

#### **基础交互流程**

1. **前端请求**：用户输入 → 封装为`RunAgentInput结构` → 发送到服务端点
2. **后端处理**：解析请求 → 启动 AI 代理 → 通过 SSE 发送事件流
3. **前端响应**：接收事件 → 实时更新界面 → 展示处理过程
4. **Human-in-Loop 流程**：AG-UI 支持人机协作的交互模式，允许在 AI 处理过程中插入人工干预

#### **核心特性**

- **状态共享**：通过`STATE_SNAPSHOT`和`STATE_DELTA`事件实现前后端状态同步
- **工具双向调用**：前端定义工具，Agent 通过`TOOL_CALL_*`事件主动调用
- **实时流式传输**：支持文本、思考过程、工具调用的流式展示
- **上下文维护**：threadId/runId/stepId 体系维护完整的对话上下文

这些能力构成了 AG-UI 成为生产级 Agent 应用的关键基础。

## 前端 TDesign Chat 集成方式

### 基础配置

只需要简单配置`protocol: 'agui'`即可开启 TDesign Chat UI 与 AG-UI 协议的无缝对接，内置了对话生命周期`RUN_*`、思考过程事件`THINKING_*`、文本事件`TEXT_MESSAGE_*`和常见`TOOL_CALL_*`事件比如 search 搜索等的渲染支持, 也提供了标准消息结构的转换方法`AGUIAdapter.convertHistoryMessages`用于回填历史消息。

```javascript
import { ChatBot, AGUIAdapter } from '@tdesign-react/chat';

export default function AguiChat() {
  const chatServiceConfig = {
    endpoint: '/api/agui/chat',
    protocol: 'agui', // 启用AG-UI协议
    stream: true,
    // 可选：自定义事件处理
    onMessage: (chunk) => {
      // 返回null使用内置AG-UI解析
      // 返回自定义内容覆盖内置解析
      return null;
    },
  };

  return <ChatBot chatServiceConfig={chatServiceConfig} />;
}
```

### 高级功能

TDesign Chat 为 AG-UI 协议提供了专用 Hook：

| Hook | 用途 | 对应事件 |
|------|------|----------|
| `useAgentToolcall` | 注册和管理工具调用组件 | `TOOL_CALL_*` |
| `useAgentState` | 订阅全局状态变化 | `STATE_SNAPSHOT` / `STATE_DELTA` |
| `useAgentActivity` | 注册动态展示组件 | `ACTIVITY_SNAPSHOT` / `ACTIVITY_DELTA` |

详细的使用方法请参考 [ChatEngine 工具调用](/react-chat/components/chat-engine#工具调用)。

## 后端事件输出规范

本节帮助后端开发者正确输出符合 AG-UI 协议的事件流。

### 1. 生命周期事件（必须）

每次 Agent 运行**必须**以 `RUN_STARTED` 开始，以 `RUN_FINISHED` 或 `RUN_ERROR` 结束：

```javascript
// ✅ 正确：完整的生命周期
data: {"type": "RUN_STARTED", "threadId": "thread_1", "runId": "run_1"}
data: {"type": "TEXT_MESSAGE_START", "messageId": "msg_1", "role": "assistant"}
data: {"type": "TEXT_MESSAGE_CONTENT", "messageId": "msg_1", "delta": "你好！"}
data: {"type": "TEXT_MESSAGE_END", "messageId": "msg_1"}
data: {"type": "RUN_FINISHED", "threadId": "thread_1", "runId": "run_1"}

// ❌ 错误：缺少 RUN_STARTED 或 RUN_FINISHED
data: {"type": "TEXT_MESSAGE_CONTENT", "messageId": "msg_1", "delta": "你好！"}
```

### 2. 文本消息事件

文本消息遵循 Start → Content → End 模式，`messageId` 必须保持一致：

```javascript
// 流式输出文本
data: {"type": "TEXT_MESSAGE_START", "messageId": "msg_1", "role": "assistant"}
data: {"type": "TEXT_MESSAGE_CONTENT", "messageId": "msg_1", "delta": "我来"}
data: {"type": "TEXT_MESSAGE_CONTENT", "messageId": "msg_1", "delta": "帮你"}
data: {"type": "TEXT_MESSAGE_CONTENT", "messageId": "msg_1", "delta": "分析..."}
data: {"type": "TEXT_MESSAGE_END", "messageId": "msg_1"}
```

### 3. 工具调用事件

工具调用同样遵循 Start → Args → End 模式，参数以 JSON 片段流式输出：

```javascript
// 调用天气查询工具
data: {"type": "TOOL_CALL_START", "toolCallId": "tc_1", "toolCallName": "get_weather", "parentMessageId": "msg_1"}
data: {"type": "TOOL_CALL_ARGS", "toolCallId": "tc_1", "delta": "{\"city\":"}
data: {"type": "TOOL_CALL_ARGS", "toolCallId": "tc_1", "delta": "\"北京\"}"}
data: {"type": "TOOL_CALL_END", "toolCallId": "tc_1"}

// 工具执行完成后返回结果
data: {"type": "TOOL_CALL_RESULT", "toolCallId": "tc_1", "content": "{\"temp\": 25, \"weather\": \"晴\"}"}
```

> **前端对接**：使用 `useAgentToolcall` 注册对应 `toolCallName` 的 UI 组件，`ToolCallRenderer` 会自动匹配并渲染。

### 4. 状态事件

状态事件用于在工具组件中展示执行进度，支持快照和增量更新：

```javascript
// 初始状态快照
data: {"type": "STATE_SNAPSHOT", "snapshot": {"task_1": {"progress": 0, "message": "开始处理..."}}}

// 增量更新（使用 JSON Patch RFC 6902）
data: {"type": "STATE_DELTA", "delta": [
  {"op": "replace", "path": "/task_1/progress", "value": 50},
  {"op": "replace", "path": "/task_1/message", "value": "处理中..."}
]}
```

> **前端对接**：工具组件通过 `agentState` 参数自动获取状态，或使用 `useAgentState` 在外部订阅。

### 5. Activity 事件

Activity 事件用于展示实时动态内容（图表、进度条等），同样支持快照和增量更新：

```javascript
// Activity 快照
data: {"type": "ACTIVITY_SNAPSHOT", "messageId": "activity_1", "activityType": "stock-chart", "content": {"title": "腾讯控股", "data": [], "status": "loading"}}

// Activity 增量更新
data: {"type": "ACTIVITY_DELTA", "messageId": "activity_1", "activityType": "stock-chart", "patch": [
  {"op": "add", "path": "/data/-", "value": {"time": "09:30", "price": 350.2}},
  {"op": "replace", "path": "/status", "value": "active"}
]}
```

> **前端对接**：使用 `useAgentActivity` 注册对应 `activityType` 的展示组件。

### 6. Human-in-the-Loop 模式

当需要用户输入时，使用工具调用等待用户响应：

```javascript
// 1. Agent 发起工具调用，请求用户输入
data: {"type": "TOOL_CALL_START", "toolCallId": "tc_pref", "toolCallName": "collect_preferences"}
data: {"type": "TOOL_CALL_ARGS", "toolCallId": "tc_pref", "delta": "{\"prompt\": \"请选择您的偏好\"}"}
data: {"type": "TOOL_CALL_END", "toolCallId": "tc_pref"}
// 此时 Agent 暂停，等待前端返回用户输入

// 2. 用户在前端填写表单后，前端调用 respond 回调
// 3. 前端将用户响应发送给后端，Agent 继续执行
```

> **前端对接**：工具组件通过 `respond` 回调将用户输入返回给后端。

## 总结

AG-UI 协议为 AI 应用开发提供了完整的标准化解决方案。通过采用 AG-UI 协议，TDesign Chat 为开发者提供了构建专业级 AI 交互应用的完整工具链，让 AI 功能集成变得简单、高效、可维护。

### 完整事件流示例

以下是一个旅游规划 Agent 的完整事件流示例，展示了各类事件的协作：

```javascript
// 1. 运行开始
data: {"type": "RUN_STARTED", "threadId": "t1", "runId": "r1"}

// 2. 初始状态
data: {"type": "STATE_SNAPSHOT", "snapshot": {"plan_task": {"progress": 0, "steps": []}}}

// 3. 开始回复
data: {"type": "TEXT_MESSAGE_START", "messageId": "m1", "role": "assistant"}
data: {"type": "TEXT_MESSAGE_CONTENT", "messageId": "m1", "delta": "好的，我来帮您规划行程..."}
data: {"type": "TEXT_MESSAGE_END", "messageId": "m1"}

// 4. 调用天气工具
data: {"type": "TOOL_CALL_START", "toolCallId": "tc1", "toolCallName": "get_weather"}
data: {"type": "TOOL_CALL_ARGS", "toolCallId": "tc1", "delta": "{\"city\": \"北京\"}"}
data: {"type": "TOOL_CALL_END", "toolCallId": "tc1"}
data: {"type": "TOOL_CALL_RESULT", "toolCallId": "tc1", "content": "{\"temp\": 25}"}

// 5. 更新状态进度
data: {"type": "STATE_DELTA", "delta": [{"op": "replace", "path": "/plan_task/progress", "value": 50}]}

// 6. 展示实时数据（Activity）
data: {"type": "ACTIVITY_SNAPSHOT", "messageId": "a1", "activityType": "stock-chart", "content": {"title": "相关股票", "data": []}}
data: {"type": "ACTIVITY_DELTA", "messageId": "a1", "activityType": "stock-chart", "patch": [{"op": "add", "path": "/data/-", "value": {"price": 100}}]}

// 7. 收集用户偏好（Human-in-the-Loop）
data: {"type": "TOOL_CALL_START", "toolCallId": "tc2", "toolCallName": "collect_preferences"}
data: {"type": "TOOL_CALL_ARGS", "toolCallId": "tc2", "delta": "{\"options\": [\"经济型\", \"舒适型\"]}"}
data: {"type": "TOOL_CALL_END", "toolCallId": "tc2"}
// 等待用户响应...

// 8. 用户响应后继续
data: {"type": "TOOL_CALL_RESULT", "toolCallId": "tc2", "content": "{\"choice\": \"舒适型\"}"}

// 9. 最终回复
data: {"type": "TEXT_MESSAGE_START", "messageId": "m2", "role": "assistant"}
data: {"type": "TEXT_MESSAGE_CONTENT", "messageId": "m2", "delta": "根据您的偏好，推荐以下行程..."}
data: {"type": "TEXT_MESSAGE_END", "messageId": "m2"}

// 10. 运行结束
data: {"type": "RUN_FINISHED", "threadId": "t1", "runId": "r1"}
```

### 前后端协作要点

| 职责 | 后端（Agent 服务） | 前端（TDesign Chat） |
|------|-------------------|----------------------|
| **事件生成** | 按协议格式输出 SSE 事件流 | 自动解析和处理事件 |
| **工具定义** | 定义工具的 name、参数结构 | 使用 `useAgentToolcall` 注册 UI 组件 |
| **状态管理** | 输出 `STATE_*` 事件 | 使用 `useAgentState` 或 `agentState` 订阅 |
| **Activity** | 输出 `ACTIVITY_*` 事件 | 使用 `useAgentActivity` 注册展示组件 |
| **Human-in-the-Loop** | 发起工具调用并等待 | 调用 `respond` 返回用户输入 |

### 调试建议

1. **打开浏览器 Network 面板**：查看 SSE 事件流，确认事件格式正确
2. **检查 ID 一致性**：同一消息/工具的所有事件必须使用相同的 `messageId` / `toolCallId`
3. **验证 JSON Patch 格式**：`STATE_DELTA` 和 `ACTIVITY_DELTA` 必须符合 [RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902)
4. **确保生命周期完整**：每次运行必须有 `RUN_STARTED` 和 `RUN_FINISHED` / `RUN_ERROR`


## 相关资源

- [AG-UI 官方文档](https://docs.ag-ui.com/)
- [TDesign ChatEngine 组件文档](/react-chat/components/chat-engine)
