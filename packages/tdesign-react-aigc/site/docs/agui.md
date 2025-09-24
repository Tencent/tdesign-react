## AG-UI 协议集成

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
