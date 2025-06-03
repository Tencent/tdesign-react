import React, { useRef } from 'react';
import { CopyIcon, EditIcon, SoundIcon } from 'tdesign-icons-react';
import type {
  SSEChunkData,
  TdChatMessageConfig,
  AIContentChunkUpdate,
  ChatRequestParams,
  ChatServiceConfig,
  ChatBaseContent,
  ChatMessagesData,
} from '@tdesign-react/aigc';
import { Button, Space } from 'tdesign-react';
import { ChatBot } from '@tdesign-react/aigc';
import TvisionTcharts from 'tvision-charts-react';

// 1、扩展自定义消息体类型
declare module '@tdesign-react/aigc' {
  interface AIContentTypeOverrides {
    chart: ChatBaseContent<
      'chart',
      {
        chartType: string;
        options: any;
        theme: string;
      }
    >;
  }
}

// 2、自定义渲染图表的组件
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

const initMessage: ChatMessagesData[] = [
  {
    id: '123',
    role: 'assistant',
    content: [
      {
        type: 'text',
        status: 'complete',
        data: '欢迎使用TDesign智能图表分析助手，请输入你的问题',
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
      // customRenderConfig,
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
    endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal`,
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
    // 流式消息输出时的回调
    onMessage: (chunk: SSEChunkData): AIContentChunkUpdate => {
      const { type, ...rest } = chunk.data;
      switch (type) {
        // 正文
        case 'text':
          return {
            type: 'markdown',
            data: rest?.msg || '',
            // 根据后端返回的paragraph字段来决定是否需要另起一段展示markdown
            strategy: rest?.paragraph === 'next' ? 'append' : 'merge',
          };
        // 3、自定义渲染图表所需的数据结构
        case 'chart':
          return {
            type: 'chart',
            data: {
              id: Date.now(),
              ...chunk.data.content,
            },
            // 图表每次出现都是追加创建新的内容块
            strategy: 'append',
          };
      }
    },
    // 自定义请求参数
    onRequest: (innerParams: ChatRequestParams) => {
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

  return (
    <div style={{ height: '600px' }}>
      <ChatBot
        ref={chatRef}
        style={{ height: '100%' }}
        defaultMessages={initMessage}
        messageProps={messageProps}
        senderProps={{
          defaultValue: '北京今天早晚高峰交通情况如何，需要分别给出曲线图表示每个时段',
        }}
        chatServiceConfig={chatServiceConfig}
        onMessageChange={(e) => {
          setMockMessage(e.detail);
        }}
      >
        {/* 4、植入自定义消息体渲染插槽 */}
        {mockMessage
          ?.map((msg) =>
            msg.content.map((item, index) => {
              switch (item.type) {
                // 示例：图表消息体
                case 'chart':
                  return (
                    // slot名这里必须保证在message队列中的唯一性，默认插槽命名规则`${msg.id}-${content.type}-${index}`, 也可以在onMessage中自行返回slotName，
                    <div slot={`${msg.id}-${item.type}-${index}`} key={`${msg.id}-${item.data.id}`}>
                      <ChartDemo data={item.data} />
                    </div>
                  );
              }
              return null;
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
