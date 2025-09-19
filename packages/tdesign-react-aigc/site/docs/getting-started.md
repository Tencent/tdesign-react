---
title: 快速上手
order: 2
group:
  title: 快速上手
  order: 2
description: TDesign Chat 智能对话组件库快速上手指南
spline: ai
---

## 安装

### 环境要求

- React >= 17.0.0
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

## 主要用法

TDesign Chat 提供了两种主要的使用方式，适用于不同的业务场景和定制需求。

### 选型指南

建议根据具体业务场景选择合适的集成方案：

| 使用方式 | 适用场景 | 定制程度 | 开发复杂度 |
|---------|---------|---------|-----------|
| **一体化组件** | 快速集成、标准聊天界面 | 中等 | 低 |
| **组合式开发** | 深度定制、复杂交互逻辑 | 高 | 中等 |


### 用法一：一体化组件集成

直接使用 `ChatBot` 组件，内置完整的UI结构和交互逻辑，适合快速集成标准聊天界面的场景。

- 最简示例

```js
import React from 'react';
import { ChatBot } from '@tdesign-react/chat';
import '@tdesign-react/chat/es/style/index.js'; // 少量公共样式

export default function chatSample() {
  // 聊天服务配置
  const chatServiceConfig = {
    // 对话服务地址
    endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal`,
    // 开启流式对话传输
    stream: true,
    // 自定义流式数据结构解析
    onMessage: (chunk) => chunk.data,
  };

  return (
    <ChatBot chatServiceConfig={chatServiceConfig}></ChatBot>
  );
}
```

就是这么简单！三行配置你已经拥有了一个功能完整的聊天界面，包括：
- 消息发送和接收
- 标准问答聊天界面
- 消息加载状态展示
- 流式消息解析与渲染，内置强大markdown语法解析
- 自动滚动
- 发送控制


## 用法二：组合式开发

使用 `useChat` Hook 和独立的UI组件（`ChatList`、`ChatMessage`、`ChatSender`）进行自由组合，适合需要深度定制UI结构和交互逻辑的场景。

- 基础组合示例

```js
import React from 'react';
import { useChat, ChatList, ChatMessage, ChatSender } from '@tdesign-react/chat';
import '@tdesign-react/chat/es/style/index.js'; // 少量公共样式

export default function CompositeChat() {
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'https://api.example.com/chat',
      stream: true
    }
  });

  const sendMessage = async (params) => {
    await chatEngine.sendUserMessage(params);
  };

  return (
    <>
      <ChatList style={{ flex: 1 }}>
        {messages.map(message => (
          <ChatMessage 
            key={message.id} 
            message={message}
          />
        ))}
      </ChatList>
      
      <ChatSender
        loading={status === 'streaming'}
        onSend={(e) => sendMessage({ prompt: e.detail.value })}
      />
    </>
  );
}
```

### 组合式开发的优势
- **高度灵活**：完全控制UI结构和样式
- **逻辑分离**：业务逻辑与UI渲染分离
- **渐进增强**：可以逐步添加功能
- **复用性强**：组件可在不同场景复用

## 配置后端服务

### SSE流式接口

如果你的后端支持Server-Sent Events流式响应：

```tsx
const chatServiceConfig = {
  endpoint: '/api/chat/stream',
  stream: true, // 开启流式传输
  onMessage: (chunk) => {
    // 解析流式数据
    const { type, content } = chunk.data;
    
    switch (type) {
      case 'text':
        return {
          type: 'markdown',
          data: content
        };
      case 'thinking':
        return {
          type: 'thinking',
          data: {
            title: '思考中...',
            text: content
          }
        };
      default:
        return null;
    }
  }
};
```

## 下一步

恭喜！你已经掌握了TDesign Chat的基本用法。接下来可以：

- 查看完整API文档了解更多配置选项
- 探索更多示例和最佳实践
- 了解高级定制和扩展功能
- 加入社区讨论获取帮助

## 浏览器兼容性

| IE / Edge | Firefox | Chrome | Safari |
|-----------|---------|--------|--------|
| Edge >=84 | Firefox >=83 | Chrome >=84 | Safari >=14.1 |

详情参见[桌面端组件库浏览器兼容性说明](https://github.com/Tencent/tdesign/wiki/%E6%A1%8C%E9%9D%A2%E7%AB%AF%E7%BB%84%E4%BB%B6%E5%BA%93%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7%E8%AF%B4%E6%98%8E)
