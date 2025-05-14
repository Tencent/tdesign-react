import React, { useEffect, useRef } from 'react';
import { CopyIcon, EditIcon, SoundIcon } from 'tdesign-icons-react';
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
import { Button, ChatBot, Space } from 'tdesign-react';
import TvisionTcharts from 'tvision-charts-react';

// 1、扩展自定义消息体类型
declare module 'tdesign-react' {
  interface AIContentTypeOverrides {
    chart: BaseContent<
      'chart',
      {
        chartType: string;
        options: any;
        theme: string;
      }
    >;
  }
}

// 2、自定义渲染-注册插槽规则
const customRenderConfig: TdChatCustomRenderConfig = {
  chart: (content) => ({
    slotName: `${content.type}-${content.data.id}`,
  }),
};

// 3、自定义渲染图表的组件
const ChartDemo = ({ data }) => (
  <div
    style={{
      width: '600px',
      height: '400px',
    }}
  >
    <TvisionTcharts chartType={data.chartType} options={data.options} theme={data.theme} />
  </div>
);

const initMessage = [
  {
    id: '123',
    role: 'user',
    content: [
      {
        type: 'text',
        data: '北京今天晚高峰交通情况如何，需要给出曲线图表示每个时段',
      },
    ],
  },
];

export default function ChatBotReact() {
  const chatRef = useRef<HTMLElement & typeof ChatBot>(null);
  const [mockMessage, setMockMessage] = React.useState<ChatMessagesData[]>(initMessage);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
    },
    assistant: {
      placement: 'left',
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      customRenderConfig,
      chatContentProps: {
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
        // 正文
        case 'text':
          return {
            type: 'markdown',
            data: rest?.msg || '',
          };
        // 自定义-图表
        case 'chart':
          return {
            type: 'chart',
            data: {
              id: Date.now(),
              ...chunk.data.content,
            },
          };
      }
    },
    // 自定义请求参数
    onRequest: (innerParams: RequestParams) => {
      const { prompt } = innerParams;
      return {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          uid: 'test',
          prompt,
          chart: true,
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
    <div style={{ height: '600px' }}>
      <ChatBot
        ref={chatRef}
        style={{ height: '100%' }}
        messages={mockMessage}
        messageProps={messageProps}
        chatServiceConfig={chatServiceConfig}
      >
        {/* 自定义消息体渲染-植入插槽 */}
        {mockMessage
          ?.map((data) =>
            data.content.map((item) => {
              switch (item.type) {
                // 示例：图表消息体
                case 'chart':
                  return (
                    <div slot={`${data.id}-${item.type}-${item.data.id}`} key={`${item.data.id}`}>
                      <ChartDemo data={item.data} />
                    </div>
                  );
              }
            }),
          )
          .flat()}
        {/* 自定义消息操作区 */}
        {mockMessage?.map((data) => {
          // 示例：给ai消息配置操作区
          if (data.role === 'assistant' && data.status === 'complete') {
            return (
              <div slot={`${data.id}-actionbar`} key={`${data.id}-actions`}>
                <Space size="small" style={{ marginTop: 6 }}>
                  <Button shape="square" variant="text" size="small">
                    <SoundIcon />
                  </Button>
                  <Button shape="square" variant="text" size="small">
                    <EditIcon />
                  </Button>
                  <Button shape="square" variant="text" size="small">
                    <CopyIcon />
                  </Button>
                </Space>
              </div>
            );
          }
          return null;
        })}
      </ChatBot>
    </div>
  );
}
