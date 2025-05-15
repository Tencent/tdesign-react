import React, { useEffect, useRef, useState } from 'react';
import { InternetIcon } from 'tdesign-icons-react';
import type {
  SSEChunkData,
  TdChatMessageConfig,
  AIMessageContent,
  RequestParams,
  ChatServiceConfig,
} from 'tdesign-react';
import { ChatBot, ChatMessagesData, type TdChatbotApi } from 'tdesign-react';

// 默认初始化消息
const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'assistant',
    content: [
      {
        type: 'text',
        status: 'complete',
        data: '欢迎使用TDesign Chatbot智能代码助手，请输入你的问题',
      },
    ],
  },
];

export default function chatSample() {
  const chatRef = useRef<HTMLElement & TdChatbotApi>(null);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    assistant: {
      // 内置的消息渲染配置
      chatContentProps: {
        markdown: {
          options: {
            html: true,
            breaks: true,
            typographer: true,
          },
          pluginConfig: [
            // 按需加载，开启插件
            {
              preset: 'code', // 代码块
              enabled: true,
            },
            {
              preset: 'katex', // 公式
              enabled: true,
            },
          ],
        },
      },
    },
  };

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    // 对话服务地址
    endpoint: 'http://localhost:3000/sse/normal',
    stream: true,
    // 流式对话结束（aborted为true时，表示用户主动结束对话，params为请求参数）
    onComplete: (aborted: boolean, params: RequestInit) => {
      console.log('onComplete', aborted, params);
    },
    // 流式对话过程中出错业务自定义行为
    onError: (err: Error | Response) => {
      console.error('Chatservice Error:', err);
    },
    // 流式对话过程中用户主动结束对话业务自定义行为
    onAbort: async () => {},
    // 自定义流式数据结构解析
    onMessage: (chunk: SSEChunkData): AIMessageContent => {
      const { type, ...rest } = chunk.data;
      switch (type) {
        // 正文
        case 'text':
          return {
            type: 'markdown',
            data: rest?.msg || '',
          };
      }
    },
    // 自定义请求参数
    onRequest: (innerParams: RequestParams) => {
      const { prompt } = innerParams;
      return {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          uid: 'tdesign-chat',
          prompt,
          code: true,
        }),
      };
    },
  };

  return (
    <div style={{ height: '600px' }}>
      <ChatBot
        ref={chatRef}
        messages={mockData}
        messageProps={messageProps}
        senderProps={{
          defaultValue: '使用tdesign组件库实现一个登录表单的例子',
          placeholder: '有问题，尽管问～ Enter 发送，Shift+Enter 换行',
        }}
        chatServiceConfig={chatServiceConfig}
      ></ChatBot>
    </div>
  );
}
