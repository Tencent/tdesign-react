---
title: ChatEngine
description: A low-level conversational engine for AI agents, providing flexible Hook APIs for deep customization.
isComponent: true
spline: navigation
---

## Reading Guide

ChatEngine is a low-level conversational engine that provides flexible Hook APIs for deep customization. It supports custom UI structures, message processing, and the AG-UI protocol, making it suitable for building complex AI agent applications such as tool calling, multi-step task planning, and state streaming. Compared to the Chatbot component, it offers greater flexibility and is ideal for scenarios requiring **deep customization of UI structure and message processing flow**. The Chatbot component itself is built on top of ChatEngine.

We recommend following this progressive reading path:

1. **Quick Start** - Learn the basic usage of the useChat Hook and how to compose components to build a chat interface
2. **Basic Usage** - Master key features including data processing, message management, UI customization, lifecycle, and custom rendering
3. **AG-UI Protocol** - Learn how to use the AG-UI protocol and its advanced features (tool calling, state subscription, etc.)

> 💡 **Example Notes**: All examples are based on Mock SSE services. You can open the browser developer tools (F12), switch to the Network tab, and view the request and response data to understand the data format.

## Quick Start

The simplest example: use the `useChat` Hook to create a conversational engine, and compose `ChatList`, `ChatMessage`, and `ChatSender` components to build a chat interface.

{{ basic }}

## Basic Usage

### Initial Messages

Use `defaultMessages` to set static initial messages, or dynamically load message history via `chatEngine.setMessages`.

{{ initial-messages }}

### Data Processing

`chatServiceConfig` is the core configuration of ChatEngine, controlling communication with the backend and data processing. It serves as the bridge between frontend components and backend services. Its roles include:

- **Request Configuration** (endpoint, onRequest for setting headers and parameters)
- **Data Transformation** (onMessage: converting backend data to the format required by components)
- **Lifecycle Callbacks** (onStart, onComplete, onError, onAbort)

Depending on the backend service protocol, there are two configuration approaches:

- **Custom Protocol**: When the backend uses a custom data format that doesn't match the frontend component's requirements, you need to use `onMessage` for data transformation.
- **AG-UI Protocol**: When the backend service conforms to the [AG-UI Protocol](/react-chat/agui), you only need to set `protocol: 'agui'` without writing `onMessage` for data transformation, greatly simplifying the integration process. See the [AG-UI Protocol](#ag-ui-protocol) section below for details.

The configuration usage in this section is consistent with Chatbot. For examples, refer to the [Chatbot Data Processing](/react-chat/components/chatbot#data-processing) section.

### Instance Methods

Control component behavior (message setting, send management, etc.) by calling [various methods](#chatengine-instance-methods) through `chatEngine`.

{{ instance-methods }}

### Custom Rendering

Use the **dynamic slot mechanism** to implement custom rendering, including custom `content rendering`, custom `action bar`, and custom `input area`.

- **Custom Content Rendering**: If you need to customize how message content is rendered, follow these steps:

  - 1. Extend Types: Declare custom content types via TypeScript
  - 2. Parse Data: Return custom type data structures in `onMessage`
  - 3. Listen to Changes: Monitor message changes via `onMessageChange` and sync to local state
  - 4. Insert Slots: Loop through the `messages` array and use the `slot = ${content.type}-${index}` attribute to render custom components

- **Custom Action Bar**: If the built-in [`ChatActionbar`](/react-chat/components/chat-actionbar) doesn't meet your needs, you can use the `slot='actionbar'` attribute to render a custom component.

- **Custom Input Area**: If you need to customize the ChatSender input area, see available slots in [ChatSender Slots](/react-chat/components/chat-sender?tab=api#slots)

{{ custom-content }}

### Comprehensive Example

After understanding the usage of the above basic properties, here's a complete example showing how to comprehensively use multiple features in production: initial messages, message configuration, data transformation, request configuration, instance methods, and custom slots.

{{ comprehensive }}

## AG-UI Protocol

[AG-UI (Agent-User Interface)](https://docs.ag-ui.com/introduction) is a lightweight protocol designed specifically for AI Agent and frontend application interaction, focusing on real-time interaction, state streaming, and human-machine collaboration. ChatEngine has built-in support for the AG-UI protocol, enabling **seamless integration with backend services that conform to AG-UI standards**.

### Basic Usage

Enable AG-UI protocol support (`protocol: 'agui'`), and the component will automatically parse standard event types (such as `TEXT_MESSAGE_*`, `THINKING_*`, `TOOL_CALL_*`, `STATE_*`, etc.). Use the `AGUIAdapter.convertHistoryMessages` method to backfill message history that conforms to the [`AGUIHistoryMessage`](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chat-engine/adapters/agui/types.ts) data structure.

{{ agui-basic }}

### Tool Calling

The AG-UI protocol supports AI Agents calling frontend tool components through `TOOL_CALL_*` events to enable human-machine collaboration.

> **Protocol Compatibility Note**: `useAgentToolcall` and `ToolCallRenderer` are protocol-agnostic; they only depend on the [ToolCall data structure](#toolcall-object-structure) and don't care about the data source. The advantage of the AG-UI protocol is automation (backend directly outputs standard `TOOL_CALL_*` events), while regular protocols require manually converting backend data to the `ToolCall` structure in `onMessage`. Adapters can reduce the complexity of manual conversion.

#### Core Hooks and Components

ChatEngine provides several core Hooks around tool calling, each with its own responsibilities working together:

- **`useAgentToolcall` Hook**: Registers tool configurations (metadata, parameters, UI components). Compared to traditional custom rendering approaches, it provides highly cohesive configuration, unified API interface, complete type safety, and better portability. See [FAQ](/react-chat/components/chat-engine?tab=demo#faq) below for details
- **`ToolCallRenderer` Component**: A unified renderer for tool calls, responsible for finding the corresponding configuration based on the tool name, parsing parameters, managing state, and rendering the registered UI component. Simply pass in the `toolCall` object to automatically complete rendering
- **`useAgentState` Hook**: Subscribes to AG-UI protocol's `STATE_SNAPSHOT` and `STATE_DELTA` events to get real-time task execution status.

#### Usage Flow

1. Use `useAgentToolcall` to register tool configurations (metadata, parameters, UI components)
2. Use the `ToolCallRenderer` component to render tool calls when rendering messages
3. `ToolCallRenderer` automatically finds configuration, parses parameters, manages state, and renders UI

#### Basic Example

A simulated image generation assistant Agent demonstrating core usage of tool calling and state subscription:

- **Tool Registration**: Use `useAgentToolcall` to register the `generate_image` tool
- **State Subscription**: Use the injected `agentState` parameter to subscribe to image generation progress (preparing → generating → completed/failed)
- **Progress Display**: Real-time display of progress bar and status information
- **Result Presentation**: Display the image after generation is complete
- **Suggested Questions**: By returning `toolcallName: 'suggestion'`, you can seamlessly integrate with the built-in suggested questions component

{{ agui-toolcall }}

### Tool State Subscription

In the AG-UI protocol, besides displaying state inside tool components, sometimes we also need to subscribe to and display tool execution status in **UI outside the conversation component** (such as a progress bar at the top of the page, a task list in the sidebar, etc.). The Agent service implements streaming of state changes and snapshots by adding `STATE_SNAPSHOT` and `STATE_DELTA` events during tool calling.

To facilitate state subscription for external UI components, you can use `useAgentState` to get state data and render task execution progress and status information in real-time. For example, to display the current task's execution progress at the top of the page without showing it in the conversation flow, you can implement it like this:

```javascript
// External progress panel component
const GlobalProgressBar: React.FC = () => {
  // Subscribe to state using useAgentState
  const { stateMap, currentStateKey } = useAgentState();

  /* Backend pushes state data through STATE_SNAPSHOT and STATE_DELTA events, sample data as follows:
  // 
  // STATE_SNAPSHOT (initial snapshot):
  // data: {"type":"STATE_SNAPSHOT","snapshot":{"task_xxx":{"progress":0,"message":"Preparing to start planning...","items":[]}}}
  //
  // STATE_DELTA (incremental update, using JSON Patch format):
  // data: {"type":"STATE_DELTA","delta":[
  //   {"op":"replace","path":"/task_xxx/progress","value":20},
  //   {"op":"replace","path":"/task_xxx/message","value":"Analyzing destination information"},
  //   {"op":"replace","path":"/task_xxx/items","value":[{"label":"Analyzing destination information","status":"running"}]}
  // ]}
  */

  // useAgentState internally handles these events automatically, merging snapshot and delta into stateMap

  // Get current task state
  const currentState = currentStateKey ? stateMap[currentStateKey] : null;

  // items array contains information about each step of the task
  // Each item contains: label (step name), status (state: running/completed/failed)
  const items = currentState?.items || [];
  const completedCount = items.filter((item: any) => item.status === 'completed').length;

  return (
    <div>
      <div>
        Progress: {completedCount}/{items.length}
      </div>
      {items.map((item: any, index: number) => (
        <div key={index}>
          {item.label} - {item.status}
        </div>
      ))}
    </div>
  );
};
```

When multiple external components need to access the same state, use the Provider pattern. Share state by using `AgentStateProvider` + `useAgentStateContext`.

For a complete example, please refer to the [Comprehensive Example](#comprehensive-example) demonstration below.

### Comprehensive Example

Simulates a complete **travel planning Agent scenario**, demonstrating how to use the AG-UI protocol to build a complex **multi-step task planning** application. First collect user preferences (Human-in-the-Loop), then execute based on the submitted preferences: query weather, display planning steps through tool calls, and finally summarize to generate the final plan.

**Core Features:**

- **16 Standardized Event Types**: Complete demonstration of the AG-UI protocol event system
- **Multi-step Flow**: Support for executing complex tasks step by step (such as travel planning)
- **State Streaming**: Real-time application state updates, supporting state snapshots and incremental updates
- **Human-in-the-Loop**: Support for human-machine collaboration, inserting user input steps in the flow
- **Tool Calling**: Integration of external tool calls, such as weather queries, itinerary planning, etc.
- **External State Subscription**: Demonstrates how to subscribe to and display tool execution status outside the conversation component

**Example Highlights:**

1. **Three Typical Tool Calling Patterns**

   - Weather Query: Demonstrates basic `TOOL_CALL_*` event handling
   - Planning Steps: Demonstrates `STATE_*` event subscription + automatic `agentState` injection
   - User Preferences: Demonstrates Human-in-the-Loop interactive tools

2. **State Usage Inside Tool Components**

   - Tool components automatically get state through the `agentState` parameter, no additional Hook needed
   - Configure `subscribeKey` to tell the Renderer which state key to subscribe to

3. **External UI State Subscription**
   - Use `useAgentState` to subscribe to state outside the conversation component
   - Real-time display of task execution progress and status information

{{ agui-comprehensive }}

## API

### useChat

A core Hook for managing chat state and lifecycle, initializing the chat engine, synchronizing message data, subscribing to state changes, and automatically handling resource cleanup when the component unmounts.

#### Parameters

| Parameter         | Type               | Description                                                                                                                     | Required |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------- | -------- |
| defaultMessages   | ChatMessagesData[] | Initial message list                                                                                                            | N        |
| chatServiceConfig | ChatServiceConfig  | Chat service configuration, see [Chatbot Documentation](/react-chat/components/chatbot?tab=api#chatserviceconfig-configuration) | Y        |

#### Return Value

| Return Value | Type               | Description                                                                                 |
| ------------ | ------------------ | ------------------------------------------------------------------------------------------- |
| chatEngine   | ChatEngine         | Chat engine instance, see [ChatEngine Instance Methods](#chatengine-instance-methods) below |
| messages     | ChatMessagesData[] | Current chat message list                                                                   |
| status       | ChatStatus         | Current chat status (idle/pending/streaming/complete/stop/error)                            |

### ChatEngine Instance Methods

ChatEngine instance methods are completely consistent with Chatbot component instance methods. See [Chatbot Instance Methods Documentation](/react-chat/components/chatbot?tab=api#chatbot-instance-methods-and-properties).

### useAgentToolcall

A Hook for registering tool call configurations, supporting both automatic and manual registration modes.

#### Parameters

| Parameter | Type                   | Description              | Required |
| --------- | ---------------------- | ------------------------ | -------- | --------- | -------------------------------------------------------------------------------------------------------- | --- |
| config    | AgentToolcallConfig \\ | AgentToolcallConfig[] \\ | null \\  | undefined | Tool call configuration object or array, auto-registers when passed, manual registration when not passed | N   |

#### Return Value

| Return Value  | Type                            | Description                    |
| ------------- | ------------------------------- | ------------------------------ | ------------------------------------ |
| register      | (config: AgentToolcallConfig \\ | AgentToolcallConfig[]) => void | Manually register tool configuration |
| unregister    | (names: string \\               | string[]) => void              | Unregister tool configuration        |
| isRegistered  | (name: string) => boolean       | Check if tool is registered    |
| getRegistered | () => string[]                  | Get all registered tool names  |

#### AgentToolcallConfig Configuration

| Property     | Type                                        | Description                                              | Required                                              |
| ------------ | ------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- | --- |
| name         | string                                      | Tool call name, must match the backend-defined tool name | Y                                                     |
| description  | string                                      | Tool call description                                    | Y                                                     |
| parameters   | ParameterDefinition[]                       | Parameter definition array                               | Y                                                     |
| component    | React.ComponentType<ToolcallComponentProps> | Custom rendering component                               | Y                                                     |
| handler      | (args, result?) => Promise<any>             | Handler function for non-interactive tools (optional)    | N                                                     |
| subscribeKey | (props) => string \\                        | undefined                                                | State subscription key extraction function (optional) | N   |

#### ToolcallComponentProps Component Properties

| Property   | Type                          | Description                                                          |
| ---------- | ----------------------------- | -------------------------------------------------------------------- | -------------- | ------------- | ------- | ---------------- |
| status     | 'idle' \\                     | 'inProgress' \\                                                      | 'executing' \\ | 'complete' \\ | 'error' | Tool call status |
| args       | TArgs                         | Parsed tool call parameters                                          |
| result     | TResult                       | Tool call result                                                     |
| error      | Error                         | Error information (when status is 'error')                           |
| respond    | (response: TResponse) => void | Response callback function (for interactive tools)                   |
| agentState | Record<string, any>           | Subscribed state data (auto-injected after configuring subscribeKey) |

### ToolCallRenderer

A unified rendering component for tool calls, responsible for automatically finding configuration based on the tool name, parsing parameters, managing state, and rendering the corresponding UI component.

#### Props

| Property  | Type                                                                                                                         | Description                                                                   | Required |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------- |
| toolCall  | ToolCall [Object Structure](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chat-engine/type.ts#L97) | Tool call object, containing toolCallName, args, result, etc.                 | Y        |
| onRespond | (toolCall: ToolCall, response: any) => void                                                                                  | Response callback for interactive tools, used to return user input to backend | N        |

### useAgentState

A Hook for subscribing to AG-UI protocol state events, providing a flexible state subscription mechanism.

> 💡 **Usage Recommendation**: For detailed usage instructions and scenario examples, please refer to the [Tool State Subscription](#tool-state-subscription) section above.

#### Parameters

| Parameter | Type               | Description                              | Required |
| --------- | ------------------ | ---------------------------------------- | -------- |
| options   | StateActionOptions | State subscription configuration options | N        |

#### StateActionOptions Configuration

| Property     | Type                | Description                                                                          | Required |
| ------------ | ------------------- | ------------------------------------------------------------------------------------ | -------- |
| subscribeKey | string              | Specify the stateKey to subscribe to, subscribes to the latest state when not passed | N        |
| initialState | Record<string, any> | Initial state value                                                                  | N        |

#### Return Value

| Return Value    | Type                              | Description                                    |
| --------------- | --------------------------------- | ---------------------------------------------- | ------------------------------------ |
| stateMap        | Record<string, any>               | State map, format is { [stateKey]: stateData } |
| currentStateKey | string \\                         | null                                           | Currently active stateKey            |
| setStateMap     | (stateMap: Record<string, any> \\ | Function) => void                              | Method to manually set the state map |
| getCurrentState | () => Record<string, any>         | Method to get the current complete state       |
| getStateByKey   | (key: string) => any              | Method to get state for a specific key         |
