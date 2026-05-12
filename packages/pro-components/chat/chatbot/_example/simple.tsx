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
        const { ...rest } = chunk.data;
        return {
          type: 'markdown',
          data: rest?.msg || '',
        };
      },
    },
  });

  const sendMessage = async (params: any) => {
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
