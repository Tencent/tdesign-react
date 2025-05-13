import React, { useRef, useState } from 'react';
import { InternetIcon } from 'tdesign-icons-react';
import type {
  SSEChunkData,
  TdChatMessageConfig,
  AIMessageContent,
  RequestParams,
  ChatMessagesData,
  ChatServiceConfig,
} from 'tdesign-react';
import { Button, ChatBot, Space, type TdChatbotApi } from 'tdesign-react';

// 默认初始化消息
const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'assistant',
    status: 'complete',
    content: [
      {
        type: 'text',
        status: 'complete',
        data: '你可以这样问我：',
      },
      {
        type: 'suggestion',
        status: 'complete',
        data: [
          {
            title: '南极的自动提款机叫什么名字',
            prompt: '南极的自动提款机叫什么名字？',
          },
          {
            title: '南极自动提款机在哪里',
            prompt: '南极自动提款机在哪里',
          },
        ],
      },
    ],
  },
];

export default function chatSample() {
  const chatRef = useRef<HTMLElement & TdChatbotApi>(null);
  const [activeR1, setR1Active] = useState(false);
  const [activeSearch, setSearchActive] = useState(false);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
    },
    assistant: {
      placement: 'left',
      actions: ['replay', 'copy', 'good', 'bad'],
      handleActions: {
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
        thinking: {
          maxHeight: 100,
        },
      },
    },
  };

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = (getParams) => ({
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
      const params = getParams();
      console.log('===params', params);
      return {
        headers: {
          'Content-Type': 'text/event-stream',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          uid: 'tdesign-chat',
          prompt,
          ...getParams(),
        }),
      };
    },
  });

  return (
    <div style={{ height: '600px' }}>
      <ChatBot
        ref={chatRef}
        messages={mockData}
        messageProps={messageProps}
        chatServiceConfig={chatServiceConfig(() => ({
          think: activeR1,
          search: activeSearch,
        }))}
      >
        {/* 自定义输入框底部区域slot，可以增加模型选项 */}
        <div slot="sender-footer-left">
          <Space align="center" size={'small'}>
            <Button
              variant="outline"
              shape="round"
              theme={activeR1 ? 'primary' : 'default'}
              size="small"
              onClick={() => setR1Active(!activeR1)}
            >
              R1.深度思考
            </Button>
            <Button
              variant="outline"
              theme={activeSearch ? 'primary' : 'default'}
              icon={<InternetIcon />}
              size="small"
              shape="round"
              onClick={() => setSearchActive(!activeSearch)}
            >
              联网查询
            </Button>
          </Space>
        </div>
      </ChatBot>
    </div>
  );
}
