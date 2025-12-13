import React, { useState } from 'react';
import { CopyIcon, EditIcon, SoundIcon } from 'tdesign-icons-react';
import type {
  SSEChunkData,
  ChatServiceConfig,
  ChatBaseContent,
  ChatMessagesData,
  AIMessageContent,
} from '@tdesign-react/chat';
import { ChatBot } from '@tdesign-react/chat';
import { Button, Space, MessagePlugin } from 'tdesign-react';
import TvisionTcharts from 'tvision-charts-react';

/**
 * 自定义插槽示例
 * 
 * 本示例展示如何使用插槽机制实现自定义渲染，包括：
 * 1. 自定义内容渲染：扩展自定义内容类型（如图表）
 * 2. 自定义操作栏：为消息添加自定义操作按钮
 * 
 * 插槽类型：
 * - 内容插槽：`${msg.id}-${content.type}-${index}` - 用于渲染自定义内容
 * - 操作栏插槽：`${msg.id}-actionbar` - 用于渲染自定义操作栏
 * 
 * 实现步骤：
 * 1. 扩展类型：通过 TypeScript 模块扩展声明自定义内容类型
 * 2. 解析数据：在 onMessage 中返回自定义类型的数据结构
 * 3. 植入插槽：使用 slot 属性渲染自定义组件
 * 
 * 学习目标：
 * - 掌握插槽机制的使用方法
 * - 理解插槽命名规则和渲染时机
 * - 学会扩展自定义内容类型和操作栏
 */

// 1. 扩展自定义消息体类型
declare global {
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

// 2. 自定义渲染图表的组件
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

export default function CustomContent() {
  const [messages, setMessages] = useState<ChatMessagesData[]>([]);

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
    stream: true,

    // 3. 在 onMessage 中解析并返回自定义类型数据
    onMessage: (chunk: SSEChunkData): AIMessageContent | null => {
      const { type, ...rest } = chunk.data;

      switch (type) {
        // 文本内容
        case 'text':
          return {
            type: 'markdown',
            data: rest?.msg || '',
            // 根据后端返回的paragraph字段来决定是否需要另起一段展示markdown
            strategy: rest?.paragraph === 'next' ? 'append' : 'merge',
          };

        // 自定义图表内容
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

        default:
          return null;
      }
    },

    // 自定义请求参数（告诉后端需要返回图表）
    onRequest: (innerParams) => ({
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        uid: 'test',
        prompt: innerParams.prompt,
        chart: true, // 请求图表数据
      }),
    }),
  };

  // 操作按钮回调
  const handlePlayAudio = () => {
    MessagePlugin.info('播放语音');
  };

  const handleEdit = () => {
    MessagePlugin.info('编辑消息');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    MessagePlugin.success('已复制到剪贴板');
  };

  return (
    <div style={{ height: '600px' }}>
      <ChatBot
        chatServiceConfig={chatServiceConfig}
        senderProps={{
          defaultValue: '北京今天早晚高峰交通情况如何，需要分别给出曲线图表示每个时段',
        }}
        onMessageChange={(e) => {
          setMessages(e.detail);
        }}
      >
        {/* 4. 植入自定义内容渲染插槽 */}
        {messages
          ?.map((msg) =>
            msg.content?.map((item, index) => {
              if (item.type === 'chart') {
                // 内容插槽命名规则：`${msg.id}-${content.type}-${index}`
                // slot 名必须保证在 message 队列中的唯一性
                return (
                  <div slot={`${msg.id}-${item.type}-${index}`} key={`${msg.id}-${item.data.id}`}>
                    <ChartDemo data={item.data} />
                  </div>
                );
              }
              return null;
            }),
          )
          .flat()}

        {/* 5. 植入自定义操作栏插槽 */}
        {messages?.map((msg) => {
          // 只为 AI 消息且已完成的消息添加操作栏
          if (msg.role === 'assistant' && msg.status === 'complete') {
            // 提取消息文本内容用于复制
            const textContent = msg.content
              ?.filter((item) => item.type === 'text' || item.type === 'markdown')
              .map((item) => item.data)
              .join('\n') || '';

            return (
              // 操作栏插槽命名规则：`${msg.id}-actionbar`
              <div slot={`${msg.id}-actionbar`} key={`${msg.id}-actions`}>
                <Space size="small" style={{ marginTop: 6 }}>
                  <Button
                    shape="square"
                    variant="text"
                    size="small"
                    onClick={handlePlayAudio}
                    title="播放语音"
                  >
                    <SoundIcon />
                  </Button>
                  <Button
                    shape="square"
                    variant="text"
                    size="small"
                    onClick={handleEdit}
                    title="编辑"
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    shape="square"
                    variant="text"
                    size="small"
                    onClick={() => handleCopy(textContent)}
                    title="复制"
                  >
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
