# AGENTS.md (TDesign ChatEngine)

> **SYSTEM PROMPT / INSTRUCTIONS**
> This file contains the foundational rules, architectural context, and coding standards for the TDesign ChatEngine SDK.
> As an AI Agent (Cursor, Copilot, Windsurf), you MUST read and follow these instructions before generating any code using this SDK.

## 1. Project Context & Identity
- **Name**: TDesign ChatEngine (React)
- **Type**: React Component Library / Headless SDK
- **Goal**: Provide a complete, production-ready solution for building AI chat applications, supporting standard protocols (AG-UI) and Generative UI.
- **Package**: `@tdesign-react/chat`
- **Key Features**:
  - Headless `ChatEngine` for logic reuse.
  - `ChatBot` component for out-of-the-box usage.
  - Native support for **AG-UI Protocol** (Agent-User Interaction).
  - **Generative UI** engine (json-render & A2UI support).

## 2. Core Concepts

### 2.1 ChatEngine (Headless Core)
The `ChatEngine` is the logic core that handles:
- **Message Management**: Send, receive, update, delete, and history management.
- **Stream Processing**: Built-in SSE (Server-Sent Events) and fetch stream handling.
- **Protocol Adaptation**: Adapts backend data to frontend message formats (AG-UI or Custom).
- **Event Bus**: Pub/Sub system for cross-component communication and side effects.

### 2.2 ChatBot (UI Component)
`ChatBot` is a high-level component built on top of `ChatEngine` that provides:
- **Complete UI**: Message list, input area, action bar, and auto-scroll.
- **Built-in Rendering**: Markdown (Cherry Markdown), Thinking process, Tool calls, Suggestions.
- **Slot Customization**: `headerSlot`, `messageSlot`, `senderSlot`, `footerSlot`.

### 2.3 AG-UI Protocol
A standard protocol for AI Agent interaction.
- **Events**:
  - `TEXT_MESSAGE_*`: Streaming text responses.
  - `THINKING_*`: AI thought process visibility.
  - `TOOL_CALL_*`: Agent tool usage (Start -> Args -> End -> Result).
  - `ACTIVITY_*`: Dynamic content (Charts, Forms) via Snapshots & Deltas.
  - `STATE_*`: Shared agent state synchronization.
- **Flow**: Stream-based, event-driven architecture.

### 2.4 Generative UI
Dynamic UI generation based on AI output, adopting the **json-render** (Vercel Labs) philosophy with a dual-layer architecture:
- **Catalog (Constraint Layer)**: Defines what components AI can use (Zod Schema).
- **Registry (Render Layer)**: Defines how components are rendered (React implementation).
- **Protocols**:
  - `json-render`: Native adjacency-list schema (flat structure), details [here](https://json-render.dev/docs).
  - `A2UI`: Google's adjacency-list schema (supported via built-in adapter)，details [here](https://a2ui.org/specification/v0.9-a2ui/).

> **Note**: The ChatEngine Generative UI engine is optimized for and exclusively supports these flat adjacency-list schemas for efficient streaming and updates.

## 3. Key APIs & Hooks

### 3.1 `useChat`
The main hook for initializing and managing chat state.

```typescript
const { chatEngine, messages, status } = useChat({
  chatServiceConfig: {
    endpoint: '/api/chat',
    protocol: 'agui', // Recommended: 'agui' for standard agents
    stream: true,
    // Optional: Custom headers or body
    onRequest: (params) => ({ ...params, headers: { Authorization: '...' } })
  },
  defaultMessages: [] // Optional initial messages
});
```

### 3.2 `useAgentToolcall`
Registers custom UI components for AI tool calls.

```typescript
useAgentToolcall({
  name: 'weather_query', // Must match backend tool name
  component: WeatherCard, // React Component receiving { args, result, status }
  // Optional: Subscribe to specific state keys during execution
  subscribeKey: (props) => props.args?.taskId 
});
```

### 3.3 `useAgentActivity`
Registers components for dynamic content (Generative UI).

```typescript
useAgentActivity({
  activityType: 'stock-chart', // Must match backend activity type
  component: StockChart // React Component receiving { content }
});
```

### 3.4 `useAgentState`
Subscribes to shared agent state (AG-UI `STATE_*` events).

```typescript
const { stateMap, currentStateKey } = useAgentState();
// Access state: stateMap['task_1']
```

### 3.5 Generative UI Helpers
- `generateCatalogPrompt`: Generates system prompt for LLM.
- `createCustomRegistry`: Creates component registry.
- `createJsonRenderActivityConfig`: Configures json-render activity.

## 4. Coding Standards & Best Practices

- **Prefer Hooks**: Use `useChat`, `useAgentToolcall`, etc., over direct class instantiation when in React components.
- **Protocol First**: Prefer `protocol: 'agui'` for standard AI agent integration. It handles streaming, tool calls, and state automatically.
- **Generative UI Safety**: Always use `Catalog` to constrain AI output. Never allow AI to generate arbitrary HTML/JS.
- **State Management**: Use `useAgentState` for cross-component state sharing instead of prop drilling or external stores when dealing with Agent state.
- **Customization**: 
  - Use `ChatBot` slots (`messageSlot`, `headerSlot`) for minor tweaks.
  - Use `useChat` + atomic components (`ChatList`, `ChatSender`) for full custom layouts.

## 5. Anti-Patterns (What NOT to do)

- ❌ **Do not** manually parse SSE streams if using `protocol: 'agui'`. The SDK handles this.
- ❌ **Do not** modify `messages` state directly; use `chatEngine` methods (`sendUserMessage`, `setMessages`).
- ❌ **Do not** use `dangerouslySetInnerHTML` for AI content; use built-in Markdown or Generative UI components.
- ❌ **Do not** mix `protocol: 'agui'` with custom `onMessage` parsers unless you strictly need to override specific event handling.

## 6. Scenario Guide & Examples

This section maps common development scenarios to specific implementation patterns and example files found in `packages/pro-components/chat/chat-engine/_example`，and you can also refer to the `packages/pro-components/chat/chat-engine.md`for more details.

### 6.1 Basic Usage Scenarios

#### 6.1.1 Quick Start (Basic Chat)
- **Goal**: Create a simple chat interface with minimal configuration.
- **Key Pattern**: `useChat` + `ChatBot` or `ChatList/ChatSender`.
- **Example**: `basic.tsx`
```tsx
// Minimal setup
const { chatEngine, messages } = useChat({
  chatServiceConfig: { endpoint: '/api/chat', stream: true }
});
```

#### 6.1.2 Managing History (Initial Messages)
- **Goal**: Load chat history or set a welcome message.
- **Key Pattern**: `defaultMessages` prop or `chatEngine.setMessages()`.
- **Example**: `initial-messages.tsx`
```tsx
// Load history
<ChatBot defaultMessages={historyMessages} />
// Or dynamic load
useEffect(() => {
  fetchHistory().then(msgs => chatEngine.setMessages(msgs));
}, []);
```

#### 6.1.3 Controlling the Engine (Instance Methods)
- **Goal**: Programmatically send messages, stop generation, or clear chat.
- **Key Pattern**: `chatEngine.sendUserMessage()`, `chatEngine.abort()`, `chatEngine.clearMessages()`.
- **Example**: `instance-methods.tsx`

#### 6.1.4 Custom UI Rendering
- **Goal**: Customize message bubbles, action bars, or input areas.
- **Key Pattern**: Slots (`messageSlot`, `headerSlot`) or Custom Components in `onMessage`.
- **Example**: `custom-content.tsx`
```tsx
// Custom message rendering via slot
<ChatBot
  messageSlot={(msg) => msg.type === 'custom' ? <MyComponent data={msg.content} /> : null}
/>
```

### 6.2 AG-UI Protocol Scenarios (Agent Integration)

#### 6.2.1 Standard Agent Integration
- **Goal**: Connect to an AG-UI compliant backend (supports streaming, tools, thinking).
- **Key Pattern**: `protocol: 'agui'`.
- **Example**: `agui-basic.tsx`

#### 6.2.2 Tool Calling (Human-in-the-Loop)
- **Goal**: Render UI for agent tool calls (e.g., weather widget, forms) and handle user interaction.
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

#### 6.2.3 Real-time Status Subscription
- **Goal**: Display agent progress (e.g., "Scanning database...") outside the chat flow.
- **Key Pattern**: `useAgentState` subscribing to `STATE_SNAPSHOT/DELTA` events.
- **Example**: `agui-comprehensive.tsx` (See `GlobalProgressBar` component)
```tsx
const { stateMap } = useAgentState();
const progress = stateMap['current_task']?.percent || 0;
```

#### 6.2.4 Dynamic Content (Activity)
- **Goal**: Display live-updating charts or dashboards driven by the agent.
- **Key Pattern**: `useAgentActivity` + `ACTIVITY_SNAPSHOT/DELTA` events.
- **Example**: `agui-activity.tsx`

### 6.3 Generative UI Scenarios

#### 6.3.1 Full Generative UI (json-render)
- **Goal**: Let AI generate complex UI based on a predefined component catalog.
- **Key Pattern**: `generateCatalogPrompt` (Constraint) + `createCustomRegistry` (Render) + `createJsonRenderActivityConfig`.
- **Example**: `agui-json-render-full-custom.tsx`

#### 6.3.2 External/Side-Panel Rendering
- **Goal**: Render AI-generated UI in a side panel instead of the chat stream.
- **Key Pattern**: Listen to `AGUI_ACTIVITY` event via `eventBus` and render independently.
- **Example**: `agui-json-render-external-panel.tsx`
```tsx
chatEngine.eventBus.on(ChatEngineEventType.AGUI_ACTIVITY, (event) => {
  setSidePanelContent(event.content);
});
```

#### 6.3.3 A2UI Protocol Support
- **Goal**: Render Google's A2UI protocol (flat-list schema) using the json-render engine.
- **Key Pattern**: `createA2UIJsonRenderActivityConfig`.
- **Example**: `agui-a2ui-json-render.tsx`

### 6.4 Advanced / Headless Scenarios

#### 6.4.1 Headless Event Bus
- **Goal**: Handle side effects (logging, analytics) without UI coupling.
- **Key Pattern**: `chatEngine.eventBus.on()`.
- **Example**: `headless-eventbus.tsx`
```tsx
chatEngine.eventBus.on(ChatEngineEventType.REQUEST_COMPLETE, (payload) => {
  logAnalytics(payload);
});
```

#### 6.4.2 Complex Multi-Step Agent
- **Goal**: Build a complex agent with planning, tools, and dynamic UI.
- **Key Pattern**: Combining `useAgentToolcall`, `useAgentActivity`, and `useAgentState`.
- **Example**: `agui-comprehensive.tsx` (Travel Planner Agent)
```tsx
// ... existing code ...
