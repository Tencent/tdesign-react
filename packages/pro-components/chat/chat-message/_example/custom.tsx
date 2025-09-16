import React from 'react';
import TvisionTcharts from 'tvision-charts-react';
import { Avatar, Space } from 'tdesign-react';

import { ChatBaseContent, ChatMessage } from '@tdesign-react/aigc';

// 扩展自定义消息体类型
declare module 'tdesign-react' {
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

const aiMessage: any = {
  id: '123123',
  role: 'assistant',
  content: [
    {
      type: 'text',
      data: '昨日上午北京道路车辆通行状况，9:00的峰值（1330）可能显示早高峰拥堵最严重时段，10:00后缓慢回落，可以得出如下折线图：',
    },
    {
      type: 'chart',
      data: {
        id: '13123',
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
};

const userMessage: any = {
  id: '456456',
  role: 'user',
  content: [
    {
      type: 'text',
      data: '请帮我分析一下昨天北京的交通状况',
    },
  ],
};

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

// 自定义用户消息组件
const CustomUserMessage = ({ message }) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      position: 'relative',
      marginLeft: 'auto',
    }}
  >
    {message.content.map((content, index) => (
      <div
        key={index}
        style={{
          fontSize: '15px',
          lineHeight: '1.6',
          wordBreak: 'break-word',
        }}
      >
        {content.data}
      </div>
    ))}
    {/* 气泡尾巴 */}
    <div
      style={{
        position: 'absolute',
        right: '-8px',
        top: '20px',
        width: 0,
        height: 0,
        borderLeft: '8px solid #764ba2',
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
      }}
    />
  </div>
);

export default function ChatMessageExample() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* 用户消息 - 使用自定义渲染 */}
      <ChatMessage
        variant="text"
        placement="right"
        avatar="https://tdesign.gtimg.com/site/avatar.jpg"
        role={userMessage.role}
        content={userMessage.content}
      >
        <div slot="content">
          <CustomUserMessage message={userMessage} />
        </div>
      </ChatMessage>

      {/* AI消息 - 使用自定义图表渲染 */}
      <ChatMessage
        variant="text"
        avatar={<Avatar image="https://tdesign.gtimg.com/site/chat-avatar.png" />}
        name="TDesignAI"
        role={aiMessage.role}
        content={aiMessage.content}
      >
        {aiMessage.content.map(({ type, data }, index) => {
          switch (type) {
            /* 自定义渲染chart类型的消息内容--植入插槽 */
            case 'chart':
              return (
                <div slot={`${type}-${index}`} key={data.id}>
                  <ChartDemo data={data} />
                </div>
              );
          }
          return null;
        })}
      </ChatMessage>
    </Space>
  );
}
