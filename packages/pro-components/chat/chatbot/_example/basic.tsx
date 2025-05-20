import React, { useEffect, useRef, useState } from 'react';
import { InternetIcon } from 'tdesign-icons-react';
import {
  SSEChunkData,
  AIMessageContent,
  TdChatMessageConfigItem,
  RequestParams,
  ChatMessagesData,
  ChatServiceConfig,
  ChatBot,
  type TdChatbotApi,
} from '@tdesign-react/aigc';
import { Button, Space } from 'tdesign-react';

// 默认初始化消息
const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'assistant',
    content: [
      {
        type: 'text',
        status: 'complete',
        data: '欢迎使用TDesign Chatbot智能助手，你可以这样问我：',
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
  const reqParamsRef = useRef<{ think: boolean; search: boolean }>({ think: false, search: false });

  // 消息属性配置
  const messageProps = (msg: ChatMessagesData): TdChatMessageConfigItem => {
    const { role, content } = msg;
    // 假设只有单条thinking
    const thinking = content.find((item) => item.type === 'thinking');
    if (role === 'user') {
      return {
        variant: 'base',
        placement: 'right',
        avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      };
    }
    if (role === 'assistant') {
      return {
        placement: 'left',
        actions: ['replay', 'copy', 'good', 'bad'],
        handleActions: {
          // 处理消息操作回调
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
            // 也可以点建议问题直接发送消息
            // chatRef?.current?.sendUserMessage({ prompt: content.prompt });
          },
        },
        // 内置的消息渲染配置
        chatContentProps: {
          thinking: {
            maxHeight: 100, // 思考框最大高度，超过会自动滚动
            layout: 'border', // 思考内容样式，border|block
            collapsed: thinking?.status === 'complete', // 是否折叠，这里设置内容输出完成后折叠
          },
        },
      };
    }
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
        case 'search':
          // 搜索
          return {
            type: 'search',
            data: {
              title: rest.title || `搜索到${rest?.docs.length}条内容`,
              references: rest?.content,
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
          ...reqParamsRef.current,
        }),
      };
    },
  };

  useEffect(() => {
    reqParamsRef.current = {
      think: activeR1,
      search: activeSearch,
    };
  }, [activeR1, activeSearch]);

  return (
    <div style={{ height: '600px' }}>
      <ChatBot
        ref={chatRef}
        defaultMessages={mockData}
        messageProps={messageProps}
        senderProps={{
          placeholder: '有问题，尽管问～ Enter 发送，Shift+Enter 换行',
        }}
        chatServiceConfig={chatServiceConfig}
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
