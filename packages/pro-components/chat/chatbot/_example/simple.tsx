
// import type { SSEChunkData, AIMessageContent, ChatServiceConfig } from '@tdesign-react/chat';
// import { ChatBot } from '@tdesign-react/chat';

// export default function chatSample() {
//   // 聊天服务配置
//   const chatServiceConfig: ChatServiceConfig = {
//     // 对话服务地址
//     endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal`,
//     // 开启流式对话传输
//     stream: true,
//     // 自定义流式数据结构解析
//     onMessage: (chunk: SSEChunkData): AIMessageContent => {
//       const { type, ...rest } = chunk.data;
//       return {
//         type: 'markdown',
//         data: rest?.msg || '',
//       };
//     },
//   };

//   return (
//     <div style={{ height: '600px' }}>
//       <ChatBot chatServiceConfig={chatServiceConfig}></ChatBot>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Space } from 'tdesign-react';
import { useChat, ChatList, ChatMessage, ChatSender } from '@tdesign-react/chat';

export default function CompositeChat() {
  const [inputValue, setInputValue] = useState<string>('问个问题吧');
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
      stream: true,
      onMessage: (chunk) => {
        const { type, ...rest } = chunk.data;
        return {
          type: 'markdown',
          data: rest?.msg || '',
        };
      },
      },
  });

  const sendMessage = async (params) => {
    setInputValue('');
    await chatEngine.sendUserMessage(params);
  };

  const stopHandler = () => {
    chatEngine.abortChat();
  };

  return (
    <Space direction="vertical" className="accessible-chat" style={{ height: '600px', width: '100%' }}>
      <ChatList>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </ChatList>
      <ChatSender
        loading={status === 'streaming'}
        value={inputValue}
        onSend={(e) => sendMessage({ prompt: e.detail.value })}
        onStop={stopHandler}
      />
    </Space>
  );
}