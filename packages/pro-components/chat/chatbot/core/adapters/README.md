# TDesign Chatbot AG-UI 协议适配器

为TDesign Web Components的Chatbot组件提供AG-UI协议支持，支持与标准化AI代理通信协议的无缝集成。

## 🎯 设计目标

- **配置分离**：网络配置、业务回调、协议转换完全独立
- **互斥模式**：传统回调与AG-UI事件处理二选一，避免混淆
- **向后兼容**：不启用时零影响，启用时可选择兼容模式
- **职责清晰**：业务逻辑、协议通信、技术监控分层处理

## 📋 三种配置模式

### 1. 传统回调模式

使用原有的`callbacks`配置，适合现有项目迁移：

```typescript
const config: ChatServiceConfig = {
  // 网络配置
  endpoint: 'http://localhost:3000/sse/chat',
  stream: true,
  retryInterval: 1000,
  maxRetries: 3,

  // 传统业务回调
  callbacks: {
    onRequest: (params) => {
      console.log('发送请求:', params);
      return { headers: { 'Content-Type': 'application/json' } };
    },
    
    onMessage: (chunk, message) => {
      console.log('收到消息:', chunk);
      // 解析并返回内容
      return { type: 'text', data: chunk.data };
    },
    
    onComplete: (isAborted) => {
      console.log('对话完成:', isAborted);
    },
    
    onError: (error) => {
      console.error('处理错误:', error);
    },
  },

  // 连接技术监控
  connection: {
    onHeartbeat: (event) => console.log('连接心跳'),
    onConnectionStateChange: (event) => console.log('连接状态变化'),
  },
};
```

**特点：**
- ✅ 使用熟悉的回调API
- ✅ 适合现有项目无缝迁移  
- ❌ 无AG-UI协议功能

### 2. AG-UI纯模式（推荐新项目）

完全基于AG-UI事件驱动，不使用传统回调：

```typescript
const config: ChatServiceConfig = {
  // 网络配置
  endpoint: 'http://localhost:3000/sse/chat',
  stream: true,

  // ⚠️ 注意：AG-UI纯模式下不配置callbacks！
  // callbacks: undefined,

  // AG-UI协议配置
  agui: {
    enabled: true,
    agentId: 'my-chatbot',
    bidirectional: true,

    // 业务逻辑处理（替代传统callbacks）
    onBusinessEvent: (event: AGUIEvent) => {
      console.log('AG-UI业务事件:', event);

      switch (event.type) {
        case 'RUN_STARTED':
          console.log('🚀 对话开始');
          break;

        case 'TEXT_MESSAGE_CHUNK':
          console.log('📝 接收文本:', event.data.content);
          // 在这里处理UI更新逻辑
          updateChatUI(event.data.content);
          break;

        case 'TOOL_CALL_CHUNK':
          console.log('🔧 工具调用:', event.data.toolName);
          break;

        case 'RUN_FINISHED':
          console.log('✅ 对话完成:', event.data.reason);
          enableInputField();
          break;

        case 'RUN_ERROR':
          console.error('❌ 运行错误:', event.data.error);
          showErrorMessage(event.data.error);
          break;
      }
    },

    // 协议通信（发送到外部系统）
    onProtocolEvent: (event: AGUIEvent) => {
      console.log('📡 协议事件:', event.type);
      
      // 发送到外部AG-UI兼容系统
      websocket.send(JSON.stringify(event));
      analytics.track('agui_event', event);
      messageQueue.publish('agui-events', event);
    },

    // 外部事件处理（双向通信）
    onExternalEvent: (event: AGUIEvent) => {
      console.log('🔄 外部事件:', event);
      // 处理外部系统发送的AG-UI事件
    },
  },
};
```

**特点：**
- ✅ 完全基于AG-UI标准事件
- ✅ 支持双向通信
- ✅ 现代化事件驱动架构
- ✅ 与外部AG-UI系统无缝集成
- ❌ 需要学习AG-UI事件API

### 3. 传统兼容模式

同时支持传统回调和AG-UI协议，适合渐进迁移：

```typescript
const config: ChatServiceConfig = {
  // 网络配置
  endpoint: 'http://localhost:3000/sse/chat',
  stream: true,

  // 传统业务回调（保持原有逻辑不变）
  callbacks: {
    onMessage: (chunk, message) => {
      console.log('💬 传统业务处理:', chunk);
      // 原有的业务逻辑保持不变
      return { type: 'text', data: String(chunk.data) };
    },

    onComplete: (isAborted) => {
      console.log('🏁 传统完成处理:', isAborted);
      enableInputField();
    },

    onError: (error) => {
      console.error('🚨 传统错误处理:', error);
      showErrorMessage(error);
    },
  },

  // 同时启用AG-UI协议转换
  agui: {
    enabled: true,
    agentId: 'compatibility-bot',
    
    // 仅用于协议通信，不处理业务逻辑
    onProtocolEvent: (event: AGUIEvent) => {
      console.log('📡 AG-UI协议事件:', event.type);
      
      // 发送到外部AG-UI兼容系统
      websocket.send(JSON.stringify(event));
      fetch('/api/agui-events', { 
        method: 'POST', 
        body: JSON.stringify(event) 
      });
    },
  },
};
```

**特点：**
- ✅ 保持原有业务逻辑不变
- ✅ 增加AG-UI协议支持
- ✅ 业务逻辑与协议通信分离
- ✅ 适合现有项目渐进迁移
- ⚠️ 两套API同时存在

## 🔧 AG-UI事件类型

AG-UI协议定义了16种标准事件类型：

| 事件类型 | 描述 | 数据结构 |
|---------|------|----------|
| `RUN_STARTED` | 对话开始 | `{ prompt, messageId, attachments }` |
| `TEXT_MESSAGE_CHUNK` | 文本消息块 | `{ content, messageId, contentType? }` |
| `TOOL_CALL_CHUNK` | 工具调用块 | `{ toolName, action, input }` |
| `TOOL_RESULT_CHUNK` | 工具结果块 | `{ toolName, result, success }` |
| `INPUT_REQUEST` | 请求用户输入 | `{ requestId, prompt, options }` |
| `RUN_FINISHED` | 对话结束 | `{ success, reason, result? }` |
| `RUN_ERROR` | 运行错误 | `{ error, details }` |
| `HEARTBEAT` | 心跳检测 | `{ connectionId, timestamp }` |
| `STATE_CHANGE` | 状态变化 | `{ from, to, connectionId }` |
| `CONNECTION_ESTABLISHED` | 连接建立 | `{ connectionId }` |
| `CONNECTION_LOST` | 连接断开 | `{ connectionId, reason }` |
| `USER_INPUT` | 用户输入 | `{ requestId, input }` |
| `AGENT_MESSAGE` | 代理消息 | `{ type, content, title? }` |
| `SYSTEM_MESSAGE` | 系统消息 | `{ content, level }` |
| `METADATA_UPDATE` | 元数据更新 | `{ type, data }` |

## 🎨 使用示例

### 基础使用

```tsx
import { Component } from 'omi';
import type { ChatServiceConfig } from 'tdesign-web-components/chatbot';

export default class MyChatBot extends Component {
  // AG-UI纯模式配置
  chatConfig: ChatServiceConfig = {
    endpoint: '/api/chat',
    stream: true,
    
    agui: {
      enabled: true,
      agentId: 'my-assistant',
      bidirectional: true,
      
      onBusinessEvent: (event) => {
        // 处理所有业务逻辑
        this.handleBusinessEvent(event);
      },
      
      onProtocolEvent: (event) => {
        // 发送到外部系统
        this.sendToExternalSystem(event);
      },
    },
  };

  handleBusinessEvent(event) {
    switch (event.type) {
      case 'TEXT_MESSAGE_CHUNK':
        // 更新UI显示
        this.updateChatDisplay(event.data.content);
        break;
      case 'RUN_FINISHED':
        // 启用输入框
        this.enableInput();
        break;
    }
  }

  render() {
    return (
      <t-chatbot
        chatServiceConfig={this.chatConfig}
        onChatReady={() => console.log('聊天就绪')}
      />
    );
  }
}
```

### 双向通信

```typescript
// 请求用户输入
const userInput = await chatEngine.requestUserInput(
  '请选择你的偏好设置：',
  { type: 'select', options: ['A', 'B', 'C'] }
);

// 处理外部AG-UI事件
chatEngine.handleAGUIEvent({
  type: 'USER_INPUT',
  data: { requestId: 'req_123', input: 'A' },
  timestamp: Date.now(),
});
```

### 自定义事件映射

```typescript
const config: ChatServiceConfig = {
  agui: {
    enabled: true,
    
    // 自定义事件映射
    eventMapping: {
      'TEXT_MESSAGE_CHUNK': 'custom_text',
      'RUN_STARTED': 'session_begin',
      'RUN_FINISHED': 'session_end',
    },
    
    onProtocolEvent: (event) => {
      // 事件类型已经被映射
      console.log('映射后的事件:', event.type);
    },
  },
};
```

## 📚 配置对比表

| 配置项 | 传统模式 | AG-UI纯模式 | 兼容模式 |
|-------|---------|------------|----------|
| `callbacks` | ✅ 必需 | ❌ 不使用 | ✅ 保留 |
| `agui.enabled` | ❌ 不启用 | ✅ 必需 | ✅ 启用 |
| `agui.onBusinessEvent` | ❌ 不使用 | ✅ 必需 | ❌ 不使用 |
| `agui.onProtocolEvent` | ❌ 不使用 | ✅ 可选 | ✅ 推荐 |
| 业务逻辑处理 | callbacks | onBusinessEvent | callbacks |
| AG-UI协议支持 | 无 | 完整 | 仅协议转换 |
| 迁移难度 | 无需迁移 | 需要重写 | 无需更改 |
| 推荐场景 | 现有项目 | 新项目 | 渐进迁移 |

## 🔍 调试和监控

### 获取适配器状态

```typescript
const adapter = chatEngine.getAGUIAdapter();
if (adapter) {
  console.log('适配器状态:', adapter.getState());
}
```

### 监听协议事件

```typescript
// 监听所有AG-UI协议事件
window.addEventListener('agui-protocol-event', (event) => {
  console.log('收到AG-UI事件:', event.detail);
});
```

### 调试日志

启用AG-UI适配器后，控制台会显示详细的运行模式信息：

```
🤖 [TDesign-Chatbot] AG-UI协议适配器已启用 - AG-UI纯模式
{
  agentId: "my-chatbot",
  bidirectional: true,
  mode: "AG-UI纯模式",
  hasCallbacks: false,
  hasBusinessEvent: true
}
```

## 🚀 最佳实践

### 1. 选择合适的模式

- **新项目**：使用AG-UI纯模式，获得最佳的事件驱动体验
- **现有项目**：使用传统兼容模式，渐进式增加AG-UI支持
- **简单项目**：使用传统模式，保持简单

### 2. 事件处理分离

```typescript
// ✅ 正确：职责分离
const config = {
  agui: {
    enabled: true,
    
    // 业务逻辑：处理UI更新、状态管理
    onBusinessEvent: (event) => {
      updateUI(event);
      updateState(event);
    },
    
    // 协议通信：发送到外部系统
    onProtocolEvent: (event) => {
      websocket.send(JSON.stringify(event));
      analytics.track('agui_event', event);
    },
  },
};

// ❌ 错误：职责混淆
const config = {
  agui: {
    onProtocolEvent: (event) => {
      // 不要在协议层处理业务逻辑
      updateUI(event); // 错误！
      websocket.send(JSON.stringify(event)); // 正确
    },
  },
};
```

### 3. 错误处理

```typescript
const config = {
  agui: {
    enabled: true,
    
    onBusinessEvent: (event) => {
      try {
        handleBusinessLogic(event);
      } catch (error) {
        console.error('业务逻辑错误:', error);
        // 不要让业务错误影响协议通信
      }
    },
    
    onProtocolEvent: (event) => {
      try {
        sendToExternalSystem(event);
      } catch (error) {
        console.error('协议通信错误:', error);
        // 协议错误不应影响主业务流程
      }
    },
  },
};
```

## 🔗 相关链接

- [AG-UI协议官方文档](https://docs.ag-ui.com)
- [TDesign Chatbot组件文档](../README.md)
- [示例代码](../_example/agui-clear-example.tsx)

## 📋 FAQ

### Q: 如何从传统模式迁移到AG-UI模式？

A: 推荐使用传统兼容模式作为过渡：

1. 启用AG-UI适配器但保留原有callbacks
2. 逐步将业务逻辑迁移到onBusinessEvent
3. 最后删除callbacks配置

### Q: 可以同时使用callbacks和onBusinessEvent吗？

A: 不建议。两者是互斥的：
- 有callbacks：传统兼容模式，onBusinessEvent不生效
- 无callbacks：AG-UI纯模式，使用onBusinessEvent

### Q: AG-UI协议事件与传统回调有什么区别？

A: 主要区别：
- **传统回调**：函数式API，直接处理SSE数据
- **AG-UI事件**：标准化事件格式，包含runId、agentId等元数据
- **适用场景**：AG-UI适合多代理通信，传统回调适合简单场景 