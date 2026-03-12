# AGENTS.md (TDesign ChatEngine)

> **SYSTEM PROMPT / INSTRUCTIONS**
> This file contains the foundational rules, architectural context, and coding standards for the TDesign ChatEngine SDK.
> As an AI Agent (Cursor, Copilot, Windsurf, CodeBuddy), you MUST read and follow these instructions before generating any code using this SDK.

## 1. Project Context & Identity
- **Name**: TDesign ChatEngine (React)
- **Type**: React Component Library / Headless SDK
- **Goal**: Provide a complete, production-ready solution for building AI chat applications, supporting standard protocols (AG-UI, OpenClaw) and Generative UI.
- **Package**: `@tdesign-react/chat`
- **Key Features**:
  - Headless `ChatEngine` for logic reuse (framework-agnostic core).
  - `ChatBot` component for out-of-the-box usage.
  - Multi-protocol support: **AG-UI**, **OpenClaw** (WebSocket), and **Custom**.
  - **Generative UI** engine (json-render & A2UI support).
  - Resume & Replay: `resumeRun()` for breakpoint recovery.
  - Typed Event Bus with history, `waitFor`, and custom events.

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  React Layer (hooks/ + components/)             │
│  useChat, useAgentToolcall, useAgentState,      │
│  useAgentActivity, ToolCallRenderer,            │
│  ActivityRenderer, JsonRender, A2UI             │
├─────────────────────────────────────────────────┤
│  Core (Framework-agnostic)                      │
│  ┌───────────┐ ┌──────────────┐ ┌────────────┐ │
│  │ ChatEngine│ │ EventBus     │ │ Store      │ │
│  │ (Facade)  │ │ (Pub/Sub)    │ │ (Reactive) │ │
│  └─────┬─────┘ └──────────────┘ └────────────┘ │
│        │                                        │
│  ┌─────┴──────────────────────────────────────┐ │
│  │ StreamHandlers (Strategy Pattern)          │ │
│  │ Default | AGUI | OpenClaw                  │ │
│  ├────────────────────────────────────────────┤ │
│  │ Adapters                                   │ │
│  │ AGUI | OpenClaw | json-render | A2UI       │ │
│  ├────────────────────────────────────────────┤ │
│  │ Server (Network Layer)                     │ │
│  │ SSE Client | WebSocket Client | Batch      │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## 3. Core Concepts

### 3.1 ChatEngine (Headless Core)
The `ChatEngine` is the logic core that handles:
- **Message Management**: Send, receive, update, delete, history management, and version branching (`regenerateAIMessage(keepVersion)`).
- **Stream Processing**: Built-in SSE and WebSocket handling via pluggable `StreamHandler` strategy.
- **Protocol Adaptation**: Adapts backend data to frontend message formats via protocol-specific adapters.
- **Event Bus**: Typed Pub/Sub system with history tracking, `waitFor`/`waitForMatch` Promise API, and custom events.
- **Resume & Replay**: `resumeRun()` for recovering interrupted Agent runs via `MESSAGES_SNAPSHOT`.

### 3.2 ChatBot (UI Component)
`ChatBot` is a high-level component built on top of `ChatEngine` that provides:
- **Complete UI**: Message list, input area, action bar, and auto-scroll.
- **Built-in Rendering**: Markdown (Cherry Markdown), Thinking process, Tool calls, Suggestions, Search references.
- **Slot Customization**: `headerSlot`, `messageSlot`, `senderSlot`, `footerSlot`.

### 3.3 Supported Protocols

#### AG-UI Protocol
A standard protocol for AI Agent interaction.
- **Events**:
  - `TEXT_MESSAGE_*` / `TEXT_MESSAGE_CHUNK`: Streaming text responses.
  - `THINKING_*` / `THINKING_TEXT_MESSAGE_*`: AI thought process visibility.
  - `TOOL_CALL_*`: Agent tool usage (Start → Args → End → Chunk → Result).
  - `ACTIVITY_SNAPSHOT/DELTA`: Dynamic content (Charts, Forms) via Snapshots & JSON Patch Deltas.
  - `STATE_SNAPSHOT/DELTA`: Shared agent state synchronization.
  - `MESSAGES_SNAPSHOT`: Bulk message restore for resume/replay.
  - `STEP_STARTED/FINISHED`: Multi-step agent progress tracking.
  - `RUN_STARTED/FINISHED/ERROR`: Agent run lifecycle.
  - `RAW`, `CUSTOM`: Extensible raw/custom events.
- **Flow**: SSE stream-based, event-driven architecture.

#### OpenClaw Protocol
WebSocket-based protocol for real-time AI chat (long-lived connections).
- **Features**: Heartbeat keep-alive, connect handshake, RPC handler, history auto-load.
- **Config**: `{ heartbeatInterval?, client?: { id, version, mode }, protocolVersion?: { min, max } }`
- **Key Pattern**: `protocol: 'openclaw'` + `openclaw: { ... }` in `chatServiceConfig`.

#### Custom Protocol
For non-standard backends, use `protocol: 'default'` with custom `onMessage` parser.

### 3.4 Generative UI
Dynamic UI generation based on AI output, adopting the **json-render** philosophy with a dual-layer architecture:
- **Catalog (Constraint Layer)**: Defines what components AI can use (Zod Schema → LLM system prompt).
- **Registry (Render Layer)**: Defines how components are rendered (React implementation).
- **Contexts**: Built-in `DataProvider`, `VisibilityProvider`, `ActionProvider`, `ValidationProvider` for state/data binding.
- **Protocols**:
  - `json-render`: Native adjacency-list schema (flat structure), details [here](https://json-render.dev/docs).
  - `A2UI`: Google's adjacency-list schema (supported via built-in adapter), details [here](https://a2ui.org/specification/v0.9-a2ui/).

> **Note**: The ChatEngine Generative UI engine is optimized for and exclusively supports these flat adjacency-list schemas for efficient streaming and updates.

## 4. Key APIs & Hooks

### 4.1 `useChat`
The main hook for initializing and managing chat state.

```typescript
const { chatEngine, messages, status } = useChat({
  chatServiceConfig: {
    endpoint: '/api/chat',
    protocol: 'agui',     // 'agui' | 'openclaw' | 'default'
    stream: true,
    timeout: 60000,       // Request timeout (ms)
    maxRetries: 3,        // Auto-retry count
    retryInterval: 1000,  // Retry delay (ms)
    // OpenClaw-specific config
    openclaw: { heartbeatInterval: 30000, client: { id: 'my-app' } },
    // Callbacks
    onRequest: (params) => ({ ...params, headers: { Authorization: '...' } }),
    onStart: (chunk) => console.log('First chunk:', chunk),
    onMessage: (chunk, message, parsed) => { /* custom parse */ },
    onComplete: (isAborted, params, result) => { /* cleanup */ },
    onError: (err) => console.error(err),
    onAbort: async () => { /* abort side effects */ },
    isValidChunk: (chunk) => chunk.data !== '[DONE]',  // Chunk validator
    onHistoryLoaded: (msgs) => { /* OpenClaw history */ },
  },
  defaultMessages: [] // Optional initial messages
});
```

### 4.2 `useAgentToolcall`
Registers custom UI components for AI tool calls. Supports both **non-interactive** (auto-execute) and **interactive** (Human-in-the-Loop) modes.

```typescript
// Interactive mode (Human-in-the-Loop)
useAgentToolcall({
  name: 'search_flight',         // Must match backend tool name
  component: FlightSearchCard,   // React Component receiving ToolcallComponentProps
  subscribeKey: (props) => props.args?.taskId,  // Optional: subscribe to agent state
});

// Non-interactive mode (auto-execute with handler)
useAgentToolcall({
  name: 'get_weather',
  component: WeatherCard,
  handler: async (args) => {     // Auto-executes, result fed back to agent
    const res = await fetch(`/api/weather?city=${args.city}`);
    return res.json();
  },
});

// Batch registration
useAgentToolcall([config1, config2, config3]);

// Returns management API
const { register, unregister, isRegistered, getRegistered, config } = useAgentToolcall();
```

**ToolcallComponentProps**:
```typescript
interface ToolcallComponentProps<TArgs, TResult, TResponse> {
  status: 'idle' | 'executing' | 'complete' | 'error';
  args: TArgs;           // Parsed tool arguments
  result?: TResult;      // Tool execution result
  error?: Error;         // Error if failed
  respond?: (response: TResponse) => void;  // Interactive callback
  agentState?: Record<string, any>;         // Subscribed agent state
}
```

### 4.3 `useAgentActivity`
Registers components for dynamic content (Generative UI).

```typescript
useAgentActivity({
  activityType: 'stock-chart',   // Must match backend activity type
  component: StockChart,         // React Component receiving ActivityComponentProps
  description: 'Real-time stock chart',
});

// Batch registration
useAgentActivity([activityConfig1, activityConfig2]);

// Returns management API
const { register, unregister, isRegistered, getRegistered } = useAgentActivity();
```

**ActivityComponentProps**:
```typescript
interface ActivityComponentProps<TContent> {
  activityType: string;
  content: TContent;     // Activity data (snapshot + deltas applied)
  messageId: string;
}
```

### 4.4 `useAgentState`
Subscribes to shared agent state (AG-UI `STATE_SNAPSHOT/DELTA` events).

```typescript
const { 
  stateMap,           // Record<string, any> - all state entries
  currentStateKey,    // Latest active state key
  setStateMap,        // Manual state setter
  getCurrentState,    // Get current active state data
  getStateByKey,      // Get state by specific key
} = useAgentState({ 
  initialState: {},         // Optional initial state
  subscribeKey: 'task_1',   // Optional: subscribe to specific key
});
```

**Simplified selector hook**:
```typescript
// Auto-detects AgentStateProvider context; falls back to standalone subscription
const stateData = useAgentStateDataByKey('task_1');
```

### 4.5 `ChatEngine` Instance Methods

```typescript
interface IChatEngine {
  // Message operations
  sendUserMessage(params: ChatRequestParams): Promise<void>;
  sendAIMessage(options: { params?, content?, sendRequest? }): Promise<void>;
  sendSystemMessage(msg: string): void;
  resumeRun(params?: ChatRequestParams): Promise<string>;       // Resume interrupted run
  regenerateAIMessage(keepVersion?: boolean): Promise<void>;     // keepVersion=true for branching
  setMessages(msgs, mode?: 'replace' | 'prepend' | 'append'): void;
  clearMessages(): void;

  // Request control
  sendRequest(params: ChatRequestParams): Promise<void>;        // Raw request (no auto message)
  abortChat(): Promise<void>;

  // AG-UI specific
  getToolcallByName(name: string): ToolCall | undefined;

  // Extensibility
  registerMergeStrategy(type: string, handler: MergeHandler): void;

  // State
  readonly messages: ChatMessagesData[];
  readonly status: ChatStatus;
  readonly messageStore: MessageStore;
  readonly eventBus: IChatEventBus;

  // Lifecycle
  init(config, messages?): void;
  destroy(): void;
}
```

### 4.6 Event Bus API

```typescript
interface IChatEventBus {
  // Standard listeners
  on(event: ChatEngineEventType, callback): UnsubscribeFn;
  once(event, callback): UnsubscribeFn;
  off(event, callback?): void;
  emit(event, payload): void;

  // Promise-based waiting
  waitFor(event, timeout?): Promise<Payload>;
  waitForMatch(event, filterFn, timeout?): Promise<Payload>;

  // Custom events (user-defined event names)
  onCustom(eventName: string, callback): UnsubscribeFn;
  emitCustom(eventName: string, data: any): void;

  // History & management
  getHistory(): EventHistoryItem[];
  clear(): void;
  destroy(): void;
}
```

**Event Types (`ChatEngineEventType`)**:

| Category | Events |
|----------|--------|
| Lifecycle | `ENGINE_INIT`, `ENGINE_DESTROY` |
| Message | `MESSAGE_CREATE`, `MESSAGE_UPDATE`, `MESSAGE_DELETE`, `MESSAGE_CLEAR`, `MESSAGE_STATUS_CHANGE`, `MESSAGE_CONTENT_APPEND` |
| Request | `REQUEST_START`, `REQUEST_STREAM`, `REQUEST_COMPLETE`, `REQUEST_ERROR`, `REQUEST_ABORT` |
| AG-UI | `AGUI_RUN_START`, `AGUI_RUN_COMPLETE`, `AGUI_RUN_ERROR`, `AGUI_STATE_UPDATE`, `AGUI_TOOLCALL`, `AGUI_ACTIVITY` |
| Custom | `CUSTOM` |

### 4.7 Generative UI Helpers

| Function | Description |
|----------|-------------|
| `generateCatalogPrompt(catalog)` | Generates LLM system prompt from component catalog (Zod Schema). |
| `createCustomRegistry(components, options?)` | Creates component registry (extends built-in TDesign components). |
| `createJsonRenderActivityConfig(options)` | Creates json-render Activity config for `useAgentActivity`. |
| `createA2UIJsonRenderActivityConfig(options)` | Creates A2UI Activity config with built-in protocol adapter. |
| `tdesignRegistry` | Built-in TDesign component registry (Button, Input, Card, Text, Row, Col, Space, Column, Divider). |
| `a2uiRegistry` / `createA2UIRegistry(...)` | A2UI protocol component registries. |
| `withStableProps(Component)` | Performance HOC using `React.memo` + `react-fast-compare`. |
| `withA2UIBinding(Component, config)` | A2UI data-binding HOC (auto `valuePath`/`disabledPath`/`action.context`). |

**Generative UI Contexts** (for building interactive json-render components):

| Context | Hooks |
|---------|-------|
| `DataProvider` | `useDataValue`, `useDataBinding`, `useDataUpdate`, `useDataState`, `useDataStore` |
| `VisibilityProvider` | `useVisibility`, `useIsVisible` |
| `ActionProvider` | `useActions`, `useAction`, `ConfirmDialog` |
| `ValidationProvider` | `useValidation`, `useFieldValidation` |

### 4.8 Content Type System

```typescript
// Message roles
type ChatMessageRole = 'user' | 'assistant' | 'system';

// Message status
type ChatMessageStatus = 'pending' | 'streaming' | 'complete' | 'stop' | 'error';
type ChatStatus = 'idle' | ChatMessageStatus;

// Content types (18+ varieties)
type ChatContentType = 'text' | 'markdown' | 'search' | 'attachment' | 'thinking'
  | 'image' | 'audio' | 'video' | 'suggestion' | 'reasoning' | 'toolcall' | 'activity';

// AI message content (union type)
type AIMessageContent = TextContent | MarkdownContent | ThinkingContent | ImageContent
  | SearchContent | SuggestionContent | ReasoningContent | ToolCallContent | ActivityContent;
```

**Type Guards** (all exported):
`isUserMessage`, `isAIMessage`, `isTextContent`, `isMarkdownContent`, `isThinkingContent`, `isImageContent`, `isSearchContent`, `isSuggestionContent`, `isAttachmentContent`, `isToolCallContent`, `isActivityContent`, `isReasoningContent`

### 4.9 Utility Functions

| Function | Description |
|----------|-------------|
| `applyJsonPatch(state, delta)` | Immutable JSON Patch (RFC 6902) with structural sharing. |
| `safeParseJSON(value, fallback?, context?)` | Safe JSON.parse with fallback. |
| `findTargetElement(event, selector)` | DOM target finder (Shadow DOM aware). |
| `getMessageContentForCopy(message)` | Extract message text for clipboard. |
| Content factories | `createMarkdownContent`, `createTextContent`, `createThinkingContent`, `createReasoningContent`, `createSuggestionContent`, `createToolCallContent`, `createActivityContent`, `createAIMessageContent` |

## 5. UI Components

### Core Components
| Component | Description |
|-----------|-------------|
| `ChatBot` | All-in-one chat component (Web Component bridge). |
| `ChatList` | Message list with auto-scroll. |
| `ChatMessage` | Single message bubble. |
| `ChatSender` | Input area with file upload support. |
| `ChatActionBar` | Message actions (copy, like, dislike). |
| `ChatMarkdown` / `MarkdownEngine` | Markdown rendering. |
| `ChatThinking` | Thinking process display. |
| `ChatLoading` | Loading animation. |
| `Filecard` | File card display. |
| `Attachments` | Attachment display. |
| `ChatSearchContent` | Search reference content. |
| `ChatSuggestionContent` | Suggestion chips. |

### Engine Renderer Components
| Component | Description |
|-----------|-------------|
| `ToolCallRenderer` | Auto-renders registered tool call UI. |
| `ActivityRenderer` | Auto-renders registered Activity UI. |
| `JsonRenderActivityRenderer` | json-render protocol renderer. |
| `A2UIJsonRenderActivityRenderer` | A2UI protocol renderer. |
| `ComponentErrorBoundary` | Error boundary for dynamic components. |

## 6. Coding Standards & Best Practices

- **Prefer Hooks**: Use `useChat`, `useAgentToolcall`, etc., over direct class instantiation when in React components.
- **Protocol First**: Prefer `protocol: 'agui'` for standard AI agent integration. Use `protocol: 'openclaw'` for WebSocket-based real-time chat. It handles streaming, tool calls, and state automatically.
- **Generative UI Safety**: Always use `Catalog` to constrain AI output. Never allow AI to generate arbitrary HTML/JS.
- **State Management**: Use `useAgentState` / `useAgentStateDataByKey` for cross-component state sharing instead of prop drilling or external stores when dealing with Agent state.
- **Customization**:
  - Use `ChatBot` slots (`messageSlot`, `headerSlot`) for minor tweaks.
  - Use `useChat` + atomic components (`ChatList`, `ChatSender`) for full custom layouts.
- **Performance**: Use `withStableProps` for Generative UI components to leverage structural sharing with `React.memo`.
- **Error Handling**: Wrap dynamic components with `ComponentErrorBoundary`. Use `onError` callback in config.
- **Message Modes**: Use `setMessages(msgs, 'append')` for pagination, `'prepend'` for history load, `'replace'` for full reset.

## 7. Anti-Patterns (What NOT to do)

- ❌ **Do not** manually parse SSE streams if using `protocol: 'agui'` or `protocol: 'openclaw'`. The SDK handles this.
- ❌ **Do not** modify `messages` state directly; use `chatEngine` methods (`sendUserMessage`, `setMessages`).
- ❌ **Do not** use `dangerouslySetInnerHTML` for AI content; use built-in Markdown or Generative UI components.
- ❌ **Do not** mix `protocol: 'agui'` with custom `onMessage` parsers unless you strictly need to override specific event handling.
- ❌ **Do not** create multiple `ChatEngine` instances for the same chat; use a single instance via `useChat`.
- ❌ **Do not** forget to call `destroy()` or rely on hook cleanup when unmounting — `useChat` handles this automatically.

## 8. Scenario Guide & Examples

This section maps common development scenarios to specific implementation patterns and example files found in `packages/pro-components/chat/chat-engine/_example`. Also refer to `packages/pro-components/chat/chat-engine/chat-engine.md` for more details.

### 8.1 Basic Usage Scenarios

#### 8.1.1 Quick Start (Basic Chat)
- **Goal**: Create a simple chat interface with minimal configuration.
- **Key Pattern**: `useChat` + `ChatBot` or `ChatList/ChatSender`.
- **Example**: `basic.tsx`
```tsx
const { chatEngine, messages } = useChat({
  chatServiceConfig: { endpoint: '/api/chat', stream: true }
});
```

#### 8.1.2 Managing History (Initial Messages)
- **Goal**: Load chat history or set a welcome message.
- **Key Pattern**: `defaultMessages` prop or `chatEngine.setMessages(msgs, mode)`.
- **Example**: `initial-messages.tsx`
```tsx
// Load history with append mode
chatEngine.setMessages(historyMessages, 'append');
// Or prepend for infinite scroll
chatEngine.setMessages(olderMessages, 'prepend');
```

#### 8.1.3 Controlling the Engine (Instance Methods)
- **Goal**: Programmatically send messages, stop generation, or clear chat.
- **Key Pattern**: `chatEngine.sendUserMessage()`, `chatEngine.abortChat()`, `chatEngine.clearMessages()`.
- **Example**: `instance-methods.tsx`

#### 8.1.4 Custom UI Rendering
- **Goal**: Customize message bubbles, action bars, or input areas.
- **Key Pattern**: Slots (`messageSlot`, `headerSlot`) or Custom Components in `onMessage`.
- **Example**: `custom-content.tsx`

### 8.2 AG-UI Protocol Scenarios (Agent Integration)

#### 8.2.1 Standard Agent Integration
- **Goal**: Connect to an AG-UI compliant backend (supports streaming, tools, thinking).
- **Key Pattern**: `protocol: 'agui'`.
- **Example**: `agui-basic.tsx`

#### 8.2.2 Tool Calling (Human-in-the-Loop)
- **Goal**: Render UI for agent tool calls and handle user interaction.
- **Key Pattern**: `useAgentToolcall` + `ToolCallRenderer`.
- **Example**: `agui-toolcall.tsx`
```tsx
useAgentToolcall({
  name: 'search_flight',
  component: ({ args, respond }) => (
    <FlightForm
      defaultCity={args.city}
      onSubmit={(data) => respond(data)} // Return user input to agent
    />
  )
});
```

#### 8.2.3 Real-time Status Subscription
- **Goal**: Display agent progress outside the chat flow.
- **Key Pattern**: `useAgentState` subscribing to `STATE_SNAPSHOT/DELTA` events.
- **Example**: `agui-comprehensive.tsx`
```tsx
const { stateMap } = useAgentState();
const progress = stateMap['current_task']?.percent || 0;
```

#### 8.2.4 Dynamic Content (Activity)
- **Goal**: Display live-updating charts or dashboards driven by the agent.
- **Key Pattern**: `useAgentActivity` + `ACTIVITY_SNAPSHOT/DELTA` events.
- **Example**: `agui-activity.tsx`

#### 8.2.5 Resume Interrupted Run
- **Goal**: Recover an Agent run that was interrupted (e.g., page reload, network error).
- **Key Pattern**: `chatEngine.resumeRun()` + backend `MESSAGES_SNAPSHOT` event.
- **Example**: `agui-resume.tsx`
```tsx
// Resume the last run — backend sends MESSAGES_SNAPSHOT to restore state
const messageId = await chatEngine.resumeRun({ params: { runId: lastRunId } });
```

#### 8.2.6 Chunk-based Streaming
- **Goal**: Handle `TEXT_MESSAGE_CHUNK` events for character-by-character streaming.
- **Key Pattern**: `protocol: 'agui'` with chunk events.
- **Example**: `agui-chunk.tsx`

### 8.3 OpenClaw Protocol Scenarios

#### 8.3.1 Basic OpenClaw Chat
- **Goal**: Connect to an OpenClaw WebSocket backend.
- **Key Pattern**: `protocol: 'openclaw'` + `openclaw: { ... }`.
- **Example**: `openclaw-basic.tsx`
```tsx
const { chatEngine, messages } = useChat({
  chatServiceConfig: {
    endpoint: 'wss://api.example.com/ws',
    protocol: 'openclaw',
    openclaw: {
      heartbeatInterval: 30000,
      client: { id: 'my-app', version: '1.0' }
    }
  }
});
```

#### 8.3.2 OpenClaw with Tool Calls & Activity
- **Goal**: Use tool calls and dynamic Activity content over OpenClaw protocol.
- **Example**: `openclaw-toolcall-activity.tsx`

### 8.4 Generative UI Scenarios

#### 8.4.1 Full Generative UI (json-render)
- **Goal**: Let AI generate complex UI based on a predefined component catalog.
- **Key Pattern**: `generateCatalogPrompt` (Constraint) + `createCustomRegistry` (Render) + `createJsonRenderActivityConfig`.
- **Example**: `agui-json-render-full-custom.tsx`

#### 8.4.2 External/Side-Panel Rendering
- **Goal**: Render AI-generated UI in a side panel instead of the chat stream.
- **Key Pattern**: Listen to `AGUI_ACTIVITY` event via `eventBus` and render independently.
- **Example**: `agui-json-render-external-panel.tsx`
```tsx
chatEngine.eventBus.on(ChatEngineEventType.AGUI_ACTIVITY, (event) => {
  if (event.activityType === 'dashboard') {
    setSidePanelContent(event);
  }
});
```

#### 8.4.3 A2UI Protocol Support
- **Goal**: Render Google's A2UI protocol (flat-list schema) using the json-render engine.
- **Key Pattern**: `createA2UIJsonRenderActivityConfig`.
- **Example**: `agui-a2ui-json-render.tsx`, `custom-a2ui.tsx`

### 8.5 Advanced / Headless Scenarios

#### 8.5.1 Headless Event Bus
- **Goal**: Handle side effects (logging, analytics) without UI coupling.
- **Key Pattern**: `chatEngine.eventBus.on()`.
- **Example**: `headless-eventbus.tsx`
```tsx
chatEngine.eventBus.on(ChatEngineEventType.REQUEST_COMPLETE, (payload) => {
  logAnalytics(payload);
});
```

#### 8.5.2 Promise-based Event Waiting
- **Goal**: Wait for a specific event before continuing execution.
- **Key Pattern**: `chatEngine.eventBus.waitFor()` / `waitForMatch()`.
```tsx
// Wait for run to complete (with 30s timeout)
const result = await chatEngine.eventBus.waitFor(ChatEngineEventType.AGUI_RUN_COMPLETE, 30000);
// Wait for a specific tool call
const toolResult = await chatEngine.eventBus.waitForMatch(
  ChatEngineEventType.AGUI_TOOLCALL,
  (event) => event.toolName === 'get_weather',
  10000
);
```

#### 8.5.3 Complex Multi-Step Agent
- **Goal**: Build a complex agent with planning, tools, and dynamic UI.
- **Key Pattern**: Combining `useAgentToolcall`, `useAgentActivity`, and `useAgentState`.
- **Example**: `agui-comprehensive.tsx` (Travel Planner Agent)

#### 8.5.4 Version Branching (Regenerate)
- **Goal**: Regenerate AI response while keeping previous version.
- **Key Pattern**: `chatEngine.regenerateAIMessage(true)` with `keepVersion=true`.
```tsx
// Regenerate and keep history version
await chatEngine.regenerateAIMessage(true);
```

#### 8.5.5 Custom Merge Strategy
- **Goal**: Define custom content merging logic for streaming updates.
- **Key Pattern**: `chatEngine.registerMergeStrategy(type, handler)`.
```tsx
chatEngine.registerMergeStrategy('custom-chart', (existing, incoming) => ({
  ...existing,
  data: { ...existing.data, ...incoming.data }
}));
```
