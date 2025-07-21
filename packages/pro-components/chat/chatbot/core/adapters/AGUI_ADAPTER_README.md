# AG-UI 协议适配器

TDesign Chatbot 组件的 AG-UI（Agent User Interaction Protocol）协议适配器，支持标准化AI代理通信。

## 概述

AG-UI 是一个用于前端应用与 AI 代理通信的标准化协议。本适配器使 TDesign Chatbot 组件能够：

1. **兼容 AG-UI 标准**：与遵循 AG-UI 协议的服务端和前端工具无缝集成
2. **向后兼容**：保持对现有 TDesign 格式的完全支持
3. **灵活适配**：自动转换不同数据格式，提供可插拔的适配层

## 三种使用场景

### 场景 1：服务端原生 AG-UI 协议

**适用于**：服务端已经支持 AG-UI 协议的新项目

```typescript
import { createAGUIAdapter } from './adapters/agui-adapter';

const aguiConfig = {
  mode: 'native' as const,
  agentId: 'my-agent',
  onEvent: (event) => {
    console.log('AG-UI事件:', event);
  }
};

const adapter = createAGUIAdapter(aguiConfig);
const config = adapter.wrapConfig({
  endpoint: '/api/chat/agui-native',
  stream: true
});

const engine = new ChatEngine();
engine.init(config);
```

**服务端响应格式**：
```json
{
  "type": "TEXT_MESSAGE_CHUNK",
  "data": {
    "content": "你好！",
    "contentType": "text"
  },
  "timestamp": 1234567890,
  "runId": "run_abc",
  "agentId": "my-agent"
}
```

### 场景 2：适配器转换模式

**适用于**：现有项目需要 AG-UI 标准化，但服务端暂未支持

```typescript
const aguiConfig = {
  mode: 'adapter' as const,
  agentId: 'my-agent',
  onEvent: (event) => {
    // 接收转换后的标准AG-UI事件
    console.log('转换后的AG-UI事件:', event);
  },
  // 可选：自定义适配逻辑
  customAdapter: (chunk) => {
    if (chunk.data?.type === 'special_format') {
      return {
        type: 'CUSTOM',
        data: { type: 'special', content: chunk.data.content }
      };
    }
    return null; // 使用默认适配器
  }
};

const adapter = createAGUIAdapter(aguiConfig);
const config = adapter.wrapConfig({
  endpoint: '/api/chat/tdesign-format',
  stream: true
});
```

**服务端响应格式**（现有TDesign格式）：
```json
{"type": "text", "msg": "你好！"}
{"type": "thinking", "content": "正在思考...", "title": "思考中"}
```

**自动转换为**：
```json
{
  "type": "TEXT_MESSAGE_CHUNK",
  "data": {"content": "你好！", "contentType": "text"}
}
{
  "type": "CUSTOM",
  "data": {"type": "thinking", "content": "正在思考...", "title": "思考中"}
}
```

### 场景 3：传统回调模式

**适用于**：现有项目无需 AG-UI 标准化

```typescript
const config = {
  endpoint: '/api/chat/traditional',
  stream: true,
  callbacks: {
    onMessage: (chunk) => {
      // 自定义业务逻辑
      if (chunk.data?.type === 'text') {
        return {
          type: 'text',
          data: chunk.data.msg,
          strategy: 'append'
        };
      }
      return null;
    },
    onComplete: (isAborted, params, result) => {
      console.log('对话完成');
    }
  }
};

// 直接使用，无需适配器
const engine = new ChatEngine();
engine.init(config);
```

## API 参考

### AGUIConfig

```typescript
interface AGUIConfig {
  /** 使用模式 */
  mode: 'disabled' | 'native' | 'adapter';
  
  /** Agent ID */
  agentId?: string;
  
  /** 是否启用双向通信 */
  bidirectional?: boolean;
  
  /** AG-UI事件处理器 */
  onEvent?: (event: AGUIEvent) => void;
  
  /** 自定义内容解析器 */
  contentParser?: (event: AGUIEvent) => AIContentChunkUpdate | null;
  
  /** 自定义适配器（adapter模式） */
  customAdapter?: (chunk: SSEChunkData) => AGUIEvent | null;
}
```

### AG-UI 标准事件类型

- **生命周期事件**：`RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR`
- **文本消息事件**：`TEXT_MESSAGE_START`, `TEXT_MESSAGE_CHUNK`, `TEXT_MESSAGE_END`
- **工具调用事件**：`TOOL_CALL_START`, `TOOL_CALL_CHUNK`, `TOOL_CALL_END`
- **状态管理事件**：`STATE_SNAPSHOT`, `STATE_DELTA`, `MESSAGES_SNAPSHOT`
- **扩展事件**：`RAW`, `CUSTOM`

### 工具函数

```typescript
// 创建适配器
const adapter = createAGUIAdapter(config);

// 事件类型检查
import { AGUIUtils } from './adapters/agui-adapter';

AGUIUtils.isTextEvent(event);      // 检查是否为文本事件
AGUIUtils.isToolEvent(event);      // 检查是否为工具事件
AGUIUtils.isLifecycleEvent(event); // 检查是否为生命周期事件
AGUIUtils.isStateEvent(event);     // 检查是否为状态事件
```

## 默认适配规则

### TDesign → AG-UI 转换

| TDesign 格式 | AG-UI 事件类型 | 说明 |
|-------------|---------------|------|
| `{type: "text", msg: "..."}` | `TEXT_MESSAGE_CHUNK` | 文本消息 |
| `{type: "markdown", msg: "..."}` | `TEXT_MESSAGE_CHUNK` | Markdown消息 |
| `{type: "thinking", content: "..."}` | `CUSTOM` | 思考过程 |
| `{type: "search", query: "..."}` | `CUSTOM` | 搜索动作 |
| 字符串 | `TEXT_MESSAGE_CHUNK` | 纯文本 |

### AG-UI → AIContentChunkUpdate 转换

| AG-UI 事件 | TDesign 内容类型 | 策略 |
|-----------|----------------|------|
| `TEXT_MESSAGE_CHUNK` | `text` / `markdown` | `append` |
| `TOOL_CALL_*` | `search` | `append` |
| `CUSTOM` (thinking) | `thinking` | `append` |
| `RUN_ERROR` | `text` | `append` |

## 最佳实践

### 1. 选择合适的模式

- **新项目 + AG-UI服务端** → `native` 模式
- **现有项目 + 需要标准化** → `adapter` 模式  
- **现有项目 + 无需AG-UI** → 传统回调模式

### 2. 事件处理

```typescript
// ✅ 好的做法：分离关注点
onEvent: (event) => {
  // AG-UI协议层：发送到外部系统
  websocket.send(JSON.stringify(event));
  analytics.track('agui_event', event);
  
  // 不要在这里处理UI业务逻辑
}

// ✅ 业务逻辑在内容解析器中处理
contentParser: (event) => {
  if (event.type === 'TEXT_MESSAGE_CHUNK') {
    updateChatUI(event.data.content);
    return {
      type: 'text',
      data: event.data.content,
      strategy: 'append'
    };
  }
  return null;
}
```

### 3. 自定义适配器

```typescript
customAdapter: (chunk) => {
  // 只处理特殊格式，其他交给默认适配器
  if (chunk.data?.type === 'special_format') {
    return {
      type: 'CUSTOM',
      data: transformSpecialFormat(chunk.data)
    };
  }
  return null; // 使用默认适配器
}
```

## 示例代码

完整的使用示例请参考：`src/chatbot/_example/agui-scenarios-example.tsx`

## 相关资源

- [AG-UI 官方文档](https://docs.ag-ui.com/)
- [AG-UI GitHub](https://github.com/ag-ui-protocol/ag-ui)
- [TDesign Chatbot 文档](./README.md) 