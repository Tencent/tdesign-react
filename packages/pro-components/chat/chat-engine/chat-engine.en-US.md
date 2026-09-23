:: BASE_DOC ::

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

#### EventBus

Access the EventBus instance through `chatEngine.eventBus`, supporting the following methods:

| Method       | Parameters                  | Return Value | Description                                           |
| ------------ | --------------------------- | ------------ | ----------------------------------------------------- |
| on           | `(event, callback)`         | `() => void` | Subscribe to event, returns unsubscribe function      |
| once         | `(event, callback)`         | `() => void` | One-time subscription                                 |
| off          | `(event, callback?)`        | `void`       | Unsubscribe, omit callback to unsubscribe all         |
| emit         | `(event, payload)`          | `void`       | Emit event                                            |
| waitFor      | `(event, timeout?)`         | `Promise`    | Wait for event to trigger                             |
| waitForMatch | `(event, filter, timeout?)` | `Promise`    | Wait with condition                                   |
| onCustom     | `(eventName, callback)`     | `() => void` | Subscribe to custom event                             |
| emitCustom   | `(eventName, data)`         | `void`       | Emit custom event                                     |
| getHistory   | `()`                        | `EventHistoryItem[]` | Get event history                               |
| clear        | `()`                        | `void`       | Clear all subscriptions                               |
| destroy      | `()`                        | `void`       | Destroy event bus                                     |

#### Supported Event Types

| Event Type            | Event Name            | Description                                          | Payload Fields                                         |
| --------------------- | --------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| **Lifecycle**         |                       |                                                      |                                                        |
| ENGINE_INIT           | `engine:init`         | Engine initialization complete                       | `timestamp`                                            |
| ENGINE_DESTROY        | `engine:destroy`      | Engine destroyed                                     | `timestamp`                                            |
| **Message Events**    |                       |                                                      |                                                        |
| MESSAGE_CREATE        | `message:create`      | Message created                                      | `message`, `messages`                                  |
| MESSAGE_UPDATE        | `message:update`      | Message updated                                      | `messageId`, `content`, `message`                      |
| MESSAGE_DELETE        | `message:delete`      | Message deleted                                      | `messageId`, `messages`                                |
| MESSAGE_CLEAR         | `message:clear`       | Messages cleared                                     | `timestamp`                                            |
| MESSAGE_STATUS_CHANGE | `message:status`      | Message status changed                               | `messageId`, `status`, `previousStatus`                |
| **Request Events**    |                       |                                                      |                                                        |
| REQUEST_START         | `request:start`       | Request started                                      | `params`, `messageId`                                  |
| REQUEST_STREAM        | `request:stream`      | Triggered when receiving SSE chunk (high frequency)  | `messageId`, `chunk`, `content`                        |
| REQUEST_COMPLETE      | `request:complete`    | Request completed                                    | `messageId`, `params`, `message`                       |
| REQUEST_ERROR         | `request:error`       | Request error                                        | `messageId`, `error`, `params`                         |
| REQUEST_ABORT         | `request:abort`       | Request aborted                                      | `messageId`, `params`                                  |
| **AG-UI Events**      |                       |                                                      |                                                        |
| AGUI_RUN_START        | `agui:run:start`      | AG-UI run started                                    | `runId`, `threadId`, `timestamp`                       |
| AGUI_RUN_COMPLETE     | `agui:run:complete`   | AG-UI run completed                                  | `runId`, `threadId`, `timestamp`                       |
| AGUI_RUN_ERROR        | `agui:run:error`      | AG-UI run error                                      | `error`, `runId`                                       |

### useAgentToolcall

A Hook for registering tool call configurations, supporting both automatic and manual registration modes.

#### Parameters

| Parameter | Type                                                              | Description                                                                                                      | Required |
| --------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------- |
| config    | AgentToolcallConfig \| AgentToolcallConfig[] \| null \| undefined | Tool call configuration object or array, auto-registers when passed, manual registration when not passed | N        |

#### Return Value

| Return Value  | Type                                                            | Description                    |
| ------------- | --------------------------------------------------------------- | ------------------------------ |
| register      | (config: AgentToolcallConfig \| AgentToolcallConfig[]) => void  | Manually register tool configuration |
| unregister    | (names: string \| string[]) => void                             | Unregister tool configuration        |
| isRegistered  | (name: string) => boolean                                       | Check if tool is registered    |
| getRegistered | () => string[]                                                  | Get all registered tool names  |

#### AgentToolcallConfig Configuration

| Property     | Type                                        | Description                                              | Required |
| ------------ | ------------------------------------------- | -------------------------------------------------------- | -------- |
| name         | string                                      | Tool call name, must match the backend-defined tool name | Y        |
| description  | string                                      | Tool call description                                    | N        |
| parameters   | `Array<{ name: string; type: string; required?: boolean }>` | Parameter definition array                               | N        |
| component    | `React.ComponentType<ToolcallComponentProps>` | Custom rendering component                               | Y        |
| handler      | `(args: TArgs, backendResult?: any) => Promise<TResult>` | Handler function for non-interactive tools (optional)    | N        |
| subscribeKey | `(props: ToolcallComponentProps<TArgs, TResult>) => string \| undefined` | State subscription key extraction function (optional), return value used to subscribe to corresponding state data, if not configured or not returned then subscribe to all state changes | N        |

#### ToolcallComponentProps Component Properties

| Property   | Type                                                 | Description                                |
| ---------- | ---------------------------------------------------- | ------------------------------------------ |
| status     | 'idle' \| 'executing' \| 'complete' \| 'error'      | Tool call status                           |
| args       | TArgs                                                | Parsed tool call parameters                |
| result     | TResult                                              | Tool call result                           |
| error      | Error                                                | Error information (when status is 'error') |
| respond    | (response: TResponse) => void                        | Response callback function (for interactive tools) |
| agentState | `Record<string, any>` | Subscribed state data, returned based on subscribeKey configuration |

### ToolCallRenderer

A unified rendering component for tool calls, responsible for automatically finding configuration based on the tool name, parsing parameters, managing state, and rendering the corresponding UI component.

#### Props

| Property  | Type                                        | Description                                           | Required |
| --------- | ------------------------------------------- | ----------------------------------------------------- | -------- |
| toolCall  | ToolCall [Object Structure](https://github.com/TDesignOteam/tdesign-web-components/blob/develop/src/chat-engine/type.ts#L97) | Tool call object, containing toolCallName, args, result, etc. | Y        |
| onRespond | (toolCall: ToolCall, response: any) => void | Response callback for interactive tools, used to return user input to backend | N        |

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
| initialState | `Record<string, any>` | Initial state value                                                                  | N        |

#### Return Value

| Return Value    | Type                                                | Description                                    |
| --------------- | --------------------------------------------------- | ---------------------------------------------- |
| stateMap        | `Record<string, any>` | State map, format is `{ [stateKey]: stateData }` |
| currentStateKey | string \| null                                      | Currently active stateKey                      |
| setStateMap     | `(stateMap: Record<string, any> \| Function) => void` | Method to manually set the state map           |
| getCurrentState | `() => Record<string, any>` | Method to get the current complete state       |
| getStateByKey   | (key: string) => any                                | Method to get state for a specific key         |

### useAgentActivity

A Hook for registering Activity configurations, supporting both automatic and manual registration modes. Activity focuses on pure display scenarios, achieving dynamic content display through streaming updates.

#### Parameters

| Parameter | Type                                                              | Description                                                                                                      | Required |
| --------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------- |
| config    | ActivityConfig \| ActivityConfig[] \| null \| undefined | Activity configuration object or array, auto-registers when passed, manual registration when not passed | N        |

#### Return Value

| Return Value  | Type                                                            | Description                    |
| ------------- | --------------------------------------------------------------- | ------------------------------ |
| register      | (config: ActivityConfig \| ActivityConfig[]) => void            | Manually register Activity configuration |
| unregister    | (names: string \| string[]) => void                             | Unregister Activity configuration        |
| isRegistered  | (name: string) => boolean                                       | Check if Activity is registered    |
| getRegistered | () => string[]                                                  | Get all registered Activity types  |

#### ActivityConfig Configuration

| Property     | Type                                        | Description                                              | Required |
| ------------ | ------------------------------------------- | -------------------------------------------------------- | -------- |
| activityType | string                                      | Activity type name, must match the backend-defined type  | Y        |
| description  | string                                      | Activity description                                     | N        |
| component    | `React.ComponentType<ActivityComponentProps>` | Custom rendering component                               | Y        |

#### ActivityComponentProps Component Properties

| Property     | Type   | Description             |
| ------------ | ------ | ----------------------- |
| activityType | string | Activity type name      |
| content      | any    | Activity content data   |
| messageId    | string | Message ID              |

### ActivityRenderer

A unified rendering component for Activity, responsible for automatically finding configuration based on Activity type and rendering the corresponding UI component.

#### Props

| Property | Type         | Description                                           | Required |
| -------- | ------------ | ----------------------------------------------------- | -------- |
| activity | ActivityData | Activity data object, containing activityType, content, messageId, etc. | Y        |

#### ActivityData Object Structure

| Property     | Type   | Description             |
| ------------ | ------ | ----------------------- |
| activityType | string | Activity type name      |
| content      | any    | Activity content data   |
| messageId    | string | Message ID              |

## FAQ

### Callback Mechanism vs EventBus: How to Choose?

ChatEngine provides two mechanisms for handling events: callbacks in `chatServiceConfig` and the `eventBus` EventBus.

| Scenario | Callback Mechanism | EventBus | Description |
|----------|:------------------:|:--------:|-------------|
| Parse SSE data to message content | ✅ Recommended | ❌ | `onMessage` can return value to affect message |
| Custom request parameters/headers | ✅ Recommended | ❌ | `onRequest` handles request configuration |
| Logging and monitoring | ⚠️ Available | ✅ Recommended | EventBus is more decoupled |
| Cross-component state synchronization | ❌ | ✅ Recommended | Multiple components subscribe to same event |
| Tracking and data analysis | ⚠️ Available | ✅ Recommended | Side effects separated from data flow |
| Wait for specific event completion (Promise) | ❌ | ✅ Recommended | `waitFor` unique capability |

**Simple Judgment**:
- **Data transformation** use callbacks (`onMessage`/`onRequest`) — can return value to affect data flow
- **Side effect handling** use EventBus — logging, statistics, notifications, cross-component communication

```javascript
// Recommended: Mixed usage
const { chatEngine } = useChat({
  chatServiceConfig: {
    // ✅ Callback: Data transformation
    onMessage: (chunk) => ({ type: 'text', data: chunk.data?.content }),
  },
});

// ✅ EventBus: Side effects
useEffect(() => {
  const unsub = chatEngine.eventBus.on(ChatEngineEventType.REQUEST_COMPLETE, () => {
    // Tracking, notifications, etc.
  });
  return unsub;
}, [chatEngine.eventBus]);
```

### Activity and ToolCall: How to Choose?

| Scenario | Recommendation | Reason |
|----------|----------------|--------|
| Pure display UI (charts, progress bars, data visualization) | Activity | Lightweight, focused on display |
| Content requiring streaming incremental updates (real-time stocks, log streams) | Activity | Native support for JSON Patch |
| User interactive form collection (Human-in-the-Loop) | ToolCall | Supports `respond` callback |
| Components needing to subscribe to global `agentState` | ToolCall | Supports `subscribeKey` |
| Need fine-grained lifecycle control (idle/executing/complete/error) | ToolCall | Complete state machine |

**Simple Judgment**: Only display backend data → Activity; Need interaction or global state → ToolCall.

### Why Use useAgentToolcall Instead of Custom Rendering?

| Comparison Item | useAgentToolcall | Custom Rendering |
|-----------------|------------------|------------------|
| Configuration Cohesion | ✅ Tool definition, parameters, UI centrally managed | ❌ Scattered in multiple places |
| Type Safety | ✅ Complete TypeScript support | ⚠️ Needs manual maintenance |
| State Subscription | ✅ Built-in `subscribeKey` + `agentState` | ❌ Needs self-implementation |
| Portability | ✅ Configuration reusable across projects | ❌ Coupled with business code |
| Error Boundary | ✅ Built-in protection | ❌ Needs self-implementation
