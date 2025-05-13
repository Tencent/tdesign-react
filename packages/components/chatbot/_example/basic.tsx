import React, { useRef } from 'react';
import type {
  SSEChunkData,
  TdChatMessageConfig,
  AIMessageContent,
  RequestParams,
  ChatMessagesData,
  ChatServiceConfig,
} from 'tdesign-react';
import { ChatBot, type TdChatbotApi } from 'tdesign-react';

// 默认初始化消息
const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'user',
    status: 'complete',
    content: [
      {
        type: 'text',
        data: '南极的自动提款机叫什么名字？',
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
    },
    assistant: {
      placement: 'left',
      actions: ['replay', 'copy', 'good', 'bad'],
      onActions: {
        good: async ({ message, active }) => {
          // 点赞
          console.log('点赞', message, active);
        },
        bad: async ({ message, active }) => {
          // 点踩
          console.log('点踩', message, active);
        },
        replay: ({ message, active }) => {
          console.log('自定义重新回复', message, active);
          chatRef?.current?.regenerate();
        },
        searchItem: ({ content, event }) => {
          event.preventDefault();
          console.log('点击搜索条目', content);
        },
        suggestion: ({ content }) => {
          console.log('点击建议问题', content);
          // 点建议问题自动填入输入框
          chatRef?.current?.addPrompt(content.prompt);
          // 点建议问题直接发送消息
          // chatRef?.current?.sendUserMessage({ prompt: content.prompt });
        },
      },
      chatContentProps: {
        search: {
          expandable: true,
        },
        thinking: {
          maxHeight: 100,
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
    onMessage: (chunk: SSEChunkData): AIMessageContent => {
      const { type, ...rest } = chunk.data;
      switch (type) {
        case 'search':
          // 搜索
          return {
            type: 'search',
            data: {
              title: rest.title || `搜索到${rest?.docs.length}条内容`,
              references: rest?.docs,
            },
          };
        // 思考
        case 'think':
          return {
            type: 'thinking',
            status: (status) => (/耗时/.test(rest?.title) ? 'complete' : status),
            data: {
              title: rest.title || '深度思考中',
              text: rest.content || '',
            },
          };
        // 正文
        case 'text':
          return {
            type: 'markdown',
            data: rest?.msg || '',
          };
        // 自定义-天气
        case 'weather':
          return {
            ...chunk.data,
            data: { ...JSON.parse(chunk.data.content) },
          };
        // 报错
        case 'error':
          return {
            type: 'text',
            status: 'error',
            data: rest?.content || '系统繁忙',
          };
        default:
          return {
            type: 'text',
            data: chunk?.event === 'complete' ? '' : JSON.stringify(chunk.data),
          };
      }
    },
    // 自定义请求参数
    onRequest: (innerParams: RequestParams) => {
      const { prompt } = innerParams;
      return {
        headers: {
          'Content-Type': 'text/event-stream',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          uid: 'ewrwerwer',
          prompt,
        }),
      };
    },
  };

  return (
    <div style={{ height: '600px' }}>
      <ChatBot ref={chatRef} messages={mockData} messageProps={messageProps} chatServiceConfig={chatServiceConfig}>
        {/* 🌟 自定义输入框左侧区域slot，可以增加模型选项 */}
        <div slot="input-footer-left" />
      </ChatBot>
    </div>
  );
}
