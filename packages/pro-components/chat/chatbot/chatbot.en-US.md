:: BASE_DOC ::

## API
### Chatbot Props

name | type | default | description | required
-- | -- | -- | -- | --
layout | String | both | 布局模式。可选项：single/both。`single`只显示消息列表，`both`显示消息列表和发送框 | N
reverse | Boolean | false | 是否倒序渲染消息 | N
autoSendPrompt | String | - | 自动发送的提示文本 | N
defaultMessages | Array | - | 初始消息列表。TS类型：`ChatMessagesData[]`。[类型定义](./chat-message?tab=api#message-消息对象结构) | N
messageProps | Object/Function | - | 消息项配置。TS类型：`TdChatMessageConfig \| Function` 。[类型定义](./chat-message?tab=api)  | N
listProps | Object | - | 消息列表配置。TS类型：`TdChatListProps`。 | N
senderProps | Object | - | 发送框配置。TS类型：`TdChatSenderProps`。[类型定义](./chat-sender?tab=api) | N
chatServiceConfig | Object | - | 聊天服务配置。TS类型：`ChatServiceConfig` | N
injectCSS | Object | - | 自定义样式注入。TS类型：`{ ChatSender?: string, chatList?: string, chatItem?: string }` | N
onMessageChange | Function | - | 消息变化回调 | N

### TdChatListProps 消息列表配置

name | type | default | description | required
-- | -- | -- | -- | --
autoScroll | Boolean | true | 是否自动滚动到底部 | N
defaultScrollPosition | String | bottom | 初始滚动位置。可选项：top/bottom/bottom | N
onScroll | Function | - | 滚动事件回调 | N

### ChatServiceConfig 属性

name | type | default | description | required
-- | -- | -- | -- | --
endpoint | String | -  | 聊天服务的API端点URL | N
stream | Boolean | true | 是否使用流式传输 | N
retryInterval | Number | - | 重试间隔时间(毫秒) | N
maxRetries | Number | - | 最大重试次数 | N
onRequest | Function | - | 请求前的回调，可修改请求参数。TS类型：`(params: ChatRequestParams) => RequestInit` | N
onMessage | Function | - | 处理流式消息的回调。TS类型：`(chunk: SSEChunkData) => AIMessageContent / null` | N
onComplete | Function | - | 请求完成时的回调。TS类型：`(isAborted: boolean, params: RequestInit, result?: any) => void` | N
onAbort | Function | - | 中止请求时的回调。TS类型：`() => Promise<void>` | N
onError | Function | - | 错误处理回调。TS类型：`(err: Error \| Response) => void` | N