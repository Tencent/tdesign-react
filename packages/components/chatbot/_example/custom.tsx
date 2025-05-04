import React, { useEffect, useRef } from 'react';
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
import TvisionTcharts from 'tvision-charts-react';

// 自定义渲染-注册插槽规则
const customRenderConfig: TdChatCustomRenderConfig = {
  weather: (content) => ({
    slotName: `${content.type}-${content.id}`,
  }),
  chart: (content) => ({
    slotName: `${content.type}-${content.data.id}`,
  }),
};

const CustomWeather = ({ city, conditions }) => {
  return (
    <div style={{ background: 'orange', color: 'white', padding: '16px', borderRadius: '8px' }}>
      今天{city}天气{conditions}
    </div>
  );
};

const ChartDemo = ({ data }) => (
  <div
    style={{
      width: '600px',
      height: '400px',
    }}
  >
    <p style={{ margin: 0 }}>{data.description}</p>
    <TvisionTcharts chartType={data.chartType} options={data.options} theme={data.theme} />
  </div>
);

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

const initMessage = [
  {
    id: '123',
    role: 'assistant',
    status: 'complete',
    content: [
      {
        type: 'chart',
        data: {
          id: 'c1',
          description:
            '昨日上午北京道路车辆通行状况，9:00的峰值（1330）可能显示早高峰拥堵最严重时段，10:00后缓慢回落，可以得出如下折线图：',
          chartType: 'line',
          options: {
            xAxis: {
              type: 'category',
              data: [
                '0:00',
                '1:00',
                '2:00',
                '3:00',
                '4:00',
                '5:00',
                '6:00',
                '7:00',
                '8:00',
                '9:00',
                '10:00',
                '11:00',
                '12:00',
              ],
            },
            yAxis: {
              axisLabel: { inside: false },
            },
            series: [
              {
                data: [820, 932, 901, 934, 600, 500, 700, 900, 1330, 1320, 1200, 1300, 1100],
                type: 'line',
              },
            ],
          },
        },
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
    <div style={{ height: '600px' }}>
      <ChatBot
        ref={chatRef}
        style={{ height: '100%' }}
        messages={mockMessage}
        messageProps={messageProps}
        chatServiceConfig={chatServiceConfig}
      >
        {/* 🌟 自定义输入框左侧区域slot，可以增加模型选项 */}
        <div slot="sender-footer-left" />
        {/* 自定义消息体渲染-植入插槽 */}
        {mockMessage
          ?.map((data) =>
            data.content.map((item) => {
              switch (item.type) {
                // 示例：天气消息体
                case 'weather':
                  return (
                    <div slot={`${data.id}-${item.type}-${item.id}`} key={`${item.id}`}>
                      <CustomWeather city={item.data.city} conditions={item.data.conditions} />
                    </div>
                  );
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
          // 示例：给用户消息配置操作区
          if (data.role === 'user') {
            return (
              <div slot={`${data.id}-actionbar`} key={`${data.id}-actions`}>
                操作区
              </div>
            );
          }
          return null;
        })}
      </ChatBot>
    </div>
  );
}
