<p align="center">
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png" />
  </a>
</p>

<p align="center">
   <a href="https://www.npmjs.com/package/@tdesign-react/chat">
    <img src="https://img.shields.io/npm/l/@tdesign-react/chat.svg?sanitize=true" alt="License" />
  </a>
  <a href="https://app.codecov.io/gh/Tencent/@tdesign-react/chat">
    <img src="https://img.shields.io/codecov/c/github/Tencent/@tdesign-react/chat/develop.svg?style=flat-square" alt="codecov">
  </a>
  <a href="https://www.npmjs.com/package/@tdesign-react/chat">
    <img src="https://img.shields.io/npm/v/@tdesign-react/chat.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@tdesign-react/chat">
    <img src="https://img.shields.io/npm/dm/@tdesign-react/chat.svg?sanitize=true" alt="Downloads" />
  </a>
</p>

TDesign AIGC Components for React Framework

# 📦 Installation

```bash
# npm
npm install @tdesign-react/chat

# yarn
yarn add @tdesign-react/chat

# pnpm
pnpm add @tdesign-react/chat
```

**依赖要求**: React >= 18.0.0

# 🔨 Quick Start

## 一体化组件集成

直接使用 `ChatBot` 组件，内置完整的 UI 结构和交互逻辑，适合快速集成标准聊天界面。

```tsx
import React from 'react';
import { ChatBot } from '@tdesign-react/chat';
import '@tdesign-react/chat/es/style/index.js';

export default function App() {
  return (
    <ChatBot
      chatServiceConfig={{
        endpoint: 'https://your-api-endpoint.com/chat',
        stream: true,
      }}
    />
  );
}
```

## 组合式开发

通过 `useChat` Hook 自由组合 UI 组件，适合需要深度定制 UI 结构和交互逻辑的场景。

```tsx
import React from 'react';
import { useChat, ChatList, ChatMessage, ChatSender } from '@tdesign-react/chat';
import '@tdesign-react/chat/es/style/index.js';

export default function CompositeChat() {
  const { chatEngine, messages, status } = useChat({
    chatServiceConfig: {
      endpoint: 'https://your-api-endpoint.com/chat',
      stream: true,
    },
  });

  return (
    <>
      <ChatList>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </ChatList>
      <ChatSender
        loading={status === 'streaming'}
        onSend={(e) => chatEngine.sendUserMessage({ prompt: e.detail.value })}
        onStop={() => chatEngine.abortChat()}
      />
    </>
  );
}
```

## 协议配置

支持**自定义协议**和**AG-UI 标准协议**两种模式：

| 场景               | 推荐协议   |
| ------------------ | ---------- |
| 快速集成到现有服务 | 自定义协议 |
| 构建复杂 AI 应用   | AG-UI 协议 |
| 多工具调用场景     | AG-UI 协议 |

```javascript
// 通过 onMessage 解析数据
const customConfig = {
  endpoint: '/api/chat',
  protocol: 'agui', // 开启 AG-UI 协议，自动解析标准事件
  onMessage: (chunk) => chunk.data,
};

```

📖 [体验示例和完整文档](https://tdesign.tencent.com/react-chat/overview)

# Browser Support

| IE / Edge | Firefox      | Chrome      | Safari        |
| --------- | ------------ | ----------- | ------------- |
| Edge >=84 | Firefox >=83 | Chrome >=84 | Safari >=14.1 |

# Contributing

Contributing is welcome. Read [guidelines for contributing](https://github.com/Tencent/tdesign-react/blob/develop/CONTRIBUTING.md) before submitting your [Pull Request](https://github.com/Tencent/tdesign-react/pulls).

# Feedback

Create your [Github issues](https://github.com/Tencent/tdesign-react/issues) or scan the QR code below to join our user groups

<img src="https://raw.githubusercontent.com/Tencent/tdesign/main/packages/components/src/images/groups/react-group.png" width="200" />

# License

The MIT License. Please see [the license file](./LICENSE) for more information.
