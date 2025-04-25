import React, { useEffect, useRef, useState } from 'react';
import type {
  SSEChunkData,
  TdChatMessageConfig,
  AIMessageContent,
  RequestParams,
  ChatServiceConfig,
  BaseContent,
  ChatMessagesData,
  TdChatCustomRenderConfig,
} from 'tdesign-react';
import { ChatBot } from 'tdesign-react';

// 自定义渲染-注册插槽规则
const customRenderConfig: TdChatCustomRenderConfig = {
  weather: (content) => ({
    slotName: `${content.type}-${content.id}`,
  }),
};

const CustomWeather = ({ city, conditions }) => {
  return (
    <div>
      今天{city}天气{conditions}
    </div>
  );
};

// 扩展自定义消息体类型
declare module 'tdesign-react' {
  interface AIContentTypeOverrides {
    weather: BaseContent<
      'weather',
      {
        temp: number;
        city: string;
        conditions: string;
      }
    >;
  }
}

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
  {
    id: '456',
    status: 'error',
    role: 'assistant',
    content: [
      {
        type: 'text',
        data: '出错了',
      },
    ],
  },
];

export default function ChatBotReact() {
  const chatRef = useRef<HTMLElement & typeof ChatBot>(null);
  const [mockMessage, setMockMessage] = React.useState<ChatMessagesData[]>(mockData);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
    },
    assistant: {
      placement: 'left',
      customRenderConfig,
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

  useEffect(() => {
    if (!chatRef.current) {
      return;
    }
    const chat = chatRef.current;
    const update = (e: CustomEvent) => {
      setMockMessage(e.detail);
    };
    chat.addEventListener('message_change', update);
    return () => {
      chat.removeEventListener('message_change', update);
    };
  }, []);
  return (
    <ChatBot
      ref={chatRef}
      style={{ height: '100%' }}
      messages={mockData}
      messageProps={messageProps}
      chatServiceConfig={chatServiceConfig}
    >
      {/* 🌟 自定义输入框左侧区域slot，可以增加模型选项 */}
      <div slot="input-footer-left" />
      {/* 自定义消息体渲染-植入插槽 */}
      {mockMessage
        ?.map((data) =>
          data.content.map((item) => {
            switch (item.type) {
              // 示例：天气消息体
              case 'weather':
                return (
                  <div slot={`${data.id}-${item.type}-${item.id}`} key={`${data.id}-${item.type}-${item.id}`}>
                    <CustomWeather city={item.data.city} conditions={item.data.conditions} />
                  </div>
                );
            }
            return null;
          }),
        )
        .flat()}
      {/* 自定义消息操作区 */}
      {mockMessage?.map((data) => {
        // 示例：给用户消息配置操作区
        if (data.role === 'user') {
          return (
            <div slot={`${data.id}-actions`} key={`${data.id}-actions`}>
              操作区
            </div>
          );
        }
        return null;
      })}
    </ChatBot>
  );
}
