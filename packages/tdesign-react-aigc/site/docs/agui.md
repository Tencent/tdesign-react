## AG-UI 协议集成



### 🤖 AG-UI 标准协议

[AG-UI协议](https://docs.ag-ui.com/introduction) 是专为AI Agent设计的标准化协议，内置支持工具调用、状态管理、多步骤任务等高级功能。

#### 基础配置

```javascript
const chatServiceConfig = {
  endpoint: '/api/agui/chat',
  protocol: 'agui', // 启用AG-UI协议
  stream: true,
  // AG-UI协议下，组件会自动解析标准事件
  // 可选：自定义事件处理逻辑
  onMessage: (chunk) => {
    // 优先级高于内置AG-UI解析
    // 返回null则使用内置解析
    return null;
  },
};
```

#### AG-UI 事件类型

AG-UI协议支持16种标准化事件类型，组件会自动解析并渲染：

| 事件类型 | 说明 | 自动渲染 |
|---------|------|---------|
| `TEXT_MESSAGE_*` | 文本消息事件 | ✅ |
| `THINKING_*` | 思考过程事件 | ✅ |
| `TOOL_CALL_*` | 工具调用事件 | ✅ |
| `STATE_*` | 状态更新事件 | ✅ |
| `MESSAGE_SNAPSHOT_*` | 消息快照事件 | ✅ |
| `SUGGESTIONS_*` | 建议问题事件 | ✅ |

#### 后端数据结构要求

AG-UI协议的后端需要返回标准化的事件格式：

```javascript
// AG-UI标准事件格式
data: {
  "event": "TEXT_MESSAGE_DELTA",
  "data": {
    "messageId": "msg_123",
    "content": "这是增量文本内容"
  }
}

data: {
  "event": "TOOL_CALL_START",
  "data": {
    "toolCallId": "tool_456",
    "toolName": "weather_query",
    "parameters": {"city": "北京"}
  }
}
```

### 🔄 协议选择建议

| 场景 | 推荐协议 | 理由 |
|------|---------|------|
| 快速集成现有服务 | 自定义协议 | 灵活适配现有数据结构 |
| 构建复杂AI应用 | AG-UI协议 | 标准化、功能完整 |
| 多工具调用场景 | AG-UI协议 | 内置工具调用支持 |
| 简单问答场景 | 自定义协议 | 配置简单、开发快速 |

### 📝 完整示例

```javascript
import { ChatBot } from '@tdesign-react/chat';

// 自定义协议示例
const customConfig = {
  endpoint: '/api/chat/custom',
  protocol: 'default',
  stream: true,
  onMessage: (chunk) => ({
    type: 'markdown',
    data: chunk.data.content,
  }),
};

// AG-UI协议示例
const aguiConfig = {
  endpoint: '/api/chat/agui',
  protocol: 'agui',
  stream: true,
};

export default function MyChat() {
  return <ChatBot chatServiceConfig={customConfig} />;
}
```

TDesign Chat 内置对 AG-UI 协议的支持，可以轻松集成支持该协议的 AI 服务：

```javascript
import React from 'react';
import { ChatBot } from '@tdesign-react/chat';

export default function AguiChatbot() {
  const chatServiceConfig = {
    endpoint: '/api/agui-chat',
    stream: true,
    protocol: 'agui', // 启用AG-UI协议
    onMessage: (chunk) => {
      // AG-UI协议自动解析
      return chunk.data;
    },
  };

  return (
    <div style="height: '600px'">
      <ChatBot
        chatServiceConfig={chatServiceConfig}
        // AG-UI协议支持的事件类型
        onToolCall={(event) => {
          console.log('工具调用:', event.detail);
        }}
        onAgentState={(event) => {
          console.log('Agent状态:', event.detail);
        }}
      />
    </div>
  );
}
```
