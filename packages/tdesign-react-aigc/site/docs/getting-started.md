---
title: 快速上手
order: 2
description: TDesign Chat 智能对话组件库快速上手指南
spline: ai
---

## 安装

### 环境要求

- React >= 18.0.0
- TypeScript >= 4.0 (可选，但推荐)

### 使用 npm 安装

```bash
npm install @tdesign-react/chat
```

### 使用 yarn 安装

```bash
yarn add @tdesign-react/chat
```

### 使用 pnpm 安装

```bash
pnpm add @tdesign-react/chat
```

## 接入使用

TDesign Chat 提供了两种主要的使用方式，适用于不同的业务场景和定制需求。

### 选型指南

建议根据具体业务场景选择合适的集成方案：

| 使用方式       | 适用场景               | 定制程度 | 开发复杂度 |
| -------------- | ---------------------- | -------- | ---------- |
| **一体化组件** | 快速集成、标准聊天界面 | 中等     | 低         |
| **组合式开发** | 深度定制、复杂交互逻辑 | 高       | 中等       |

### 用法一：一体化组件集成

直接使用 `ChatBot` 组件，内置完整的 UI 结构和交互逻辑，适合快速集成标准聊天界面的场景，参考[ChatBot 用法](/react-chat/components/chatbot)。

#### 最简示例

```js
import React from 'react';
import { ChatBot } from '@tdesign-react/chat';
import '@tdesign-react/chat/es/style/index.js'; // 少量公共样式

export default function () {
  // 聊天服务配置
  const chatServiceConfig = {
    // 对话服务地址
    endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal`,
    // 开启流式对话传输
    stream: true,
    // 自定义流式数据结构解析
    onMessage: (chunk) => chunk.data,
  };

  return <ChatBot chatServiceConfig={chatServiceConfig} />;
}
```

就是这么简单！三行配置你已经拥有了一个功能完整的聊天界面，包括：

- 消息发送和接收
- 标准问答聊天界面
- 消息加载状态展示
- 流式消息解析与渲染，内置强大 markdown 语法解析
- 自动滚动
- 发送控制

### 用法二：组合式开发

通过使用 `useChat` Hook 来获取 chatEngine 对话引擎实例和实时消息数据，自由组合独立的 UI 组件（`ChatList`、`ChatMessage`、`ChatSender`），或者可以完全自己实现 UI 部分，适合需要深度定制 UI 结构和交互逻辑的场景，参考[ChatEngine SDK 用法](/react-chat/components/chat-engine)。

```js
import React, { useState } from 'react';
import { Space } from 'tdesign-react';
import { useChat, ChatList, ChatMessage, ChatSender } from '@tdesign-react/chat';
import '@tdesign-react/chat/es/style/index.js'; // 少量公共样式

export default function CompositeChat() {
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
      stream: true,
      onMessage: (chunk) => chunk.data,
    },
  });

  const sendMessage = async (params) => {
    await chatEngine.sendUserMessage(params);
  };

  const stopHandler = () => {
    chatEngine.abortChat();
  };

  return (
    <Space direction="vertical" className="accessible-chat">
      <ChatList>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </ChatList>
      <ChatSender
        loading={status === 'streaming'}
        onSend={(e) => sendMessage({ prompt: e.detail.value })}
        onStop={stopHandler}
      />
    </Space>
  );
}
```

- 组合式开发的优势

  - **高度灵活**：完全控制 UI 结构和样式
  - **逻辑分离**：业务逻辑与 UI 渲染分离
  - **渐进增强**：可以逐步添加功能
  - **复用性强**：组件可在不同场景复用

## 配置服务

TDesign Chat 支持两种后端 AI Agent 服务返回数据协议模式：**自定义协议**和**AG-UI 标准协议**。您可以根据后端服务的实际情况选择合适的协议模式。

### 自定义协议模式

适用于已有后端服务或需要自定义数据结构的场景，您的后端服务只需要返回标准 SSE 格式即可。

```js
// 自定义后端接口（/api/chat）返回案例
data: {"type": "think", "content": "正在分析您的问题..."}
data: {"type": "text", "content": "我是**腾讯云**助手"}
data: {"type": "text", "content": "很高兴为您服务！"}
```

接下来，前端通过配置 `onMessage` 回调来解析流式数据, 将自定义数据映射为组件所需格式。

```javascript
const chatServiceConfig = {
  endpoint: '/api/chat',
  onMessage: (chunk) => {
    const { type, content } = chunk.data;
    switch (type) {
      case 'text':
        return {
          type: 'markdown',
          data: content,
        };
      case 'think':
        return {
          type: 'thinking',
          data: {
            title: '思考中...',
            text: content,
          },
        };
      default:
        return null;
    }
  },
};
```

### AG-UI 标准协议

**AG-UI 协议**是专为 AI 代理与前端应用交互设计的标准化轻量级协议，内置支持工具调用、状态管理、多步骤任务等高级功能。AG-UI 协议支持 16 种标准化事件类型，组件会自动解析并渲染，包括对话生命周期`RUN_*`、文本消息`TEXT_MESSAGE_*`、思考过程`THINKING_*`、工具调用`TOOL_CALL_*`、状态更新`STATE_*`等。

TDesign Chat 内置支持**AG-UI 协议数据双向转换**，符合该协议的后端 Agent 服务，可以无缝接入使用，只需在配置中开启即可。详细介绍见[与 AG-UI 协议集成](/react-chat/agui)

```js
// 符合AG-UI协议的后端接口（/api/agui/chat）返回案例
data: {"type": "RUN_STARTED", "runId": "run_456"}
data: {"type": "TEXT_MESSAGE_CONTENT", "delta": "正在处理您的请求..."}
data: {"type": "TOOL_CALL_START", "toolCallName": "search"}
data: {"type": "TOOL_CALL_RESULT", "content": "查询结果"}
data: {"type": "RUN_FINISHED", "runId": "run_456"}
```

```javascript
const chatServiceConfig = {
  endpoint: '/api/agui/chat',
  protocol: 'agui', // 启用AG-UI协议
  stream: true,
};
```

### 协议选择建议

| 场景               | 推荐协议   | 理由                              |
| ------------------ | ---------- | --------------------------------- |
| 快速集成到现有服务 | 自定义协议 | 灵活适配现有数据结构              |
| 构建复杂 AI 应用   | AG-UI 协议 | 业界标准、功能完整、扩展性强      |
| 多工具调用场景     | AG-UI 协议 | 内置工具注册、调用及状态管理 Hook |
| 简单问答场景       | 自定义协议 | 配置简单、开发快速                |

更多详细配置和示例请参考[组件文档](/react-chat/components/chatbot)。

## 下一步

恭喜！你已经掌握了 TDesign Chat 的基本用法。接下来可以：

- 查看完整 API 文档了解更多配置选项
- 探索更多示例和最佳实践
- 了解高级定制和扩展功能
- 加入社区讨论获取帮助

## 浏览器兼容性

| IE / Edge | Firefox      | Chrome      | Safari        |
| --------- | ------------ | ----------- | ------------- |
| Edge >=84 | Firefox >=83 | Chrome >=84 | Safari >=14.1 |

详情参见[桌面端组件库浏览器兼容性说明](https://github.com/Tencent/tdesign/wiki/%E6%A1%8C%E9%9D%A2%E7%AB%AF%E7%BB%84%E4%BB%B6%E5%BA%93%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7%E8%AF%B4%E6%98%8E)
