import React, { useRef, useEffect, useState } from 'react';
import type {
  SSEChunkData,
  ChatServiceConfig,
  ChatBaseContent,
  ChatMessagesData,
  AIMessageContent,
} from '@tdesign-react/chat';
import { ChatBot } from '@tdesign-react/chat';
import { Progress } from 'tdesign-react';

/**
 * 自定义合并策略示例
 * 
 * 本示例展示流式数据的两种合并方式：
 * 
 * 1. **strategy 配置**：使用内置的合并策略
 *    - 'merge'（默认）：查找相同 type 的最后一个内容块并合并
 *    - 'append'：始终追加为新的独立内容块
 * 
 * 2. **registerMergeStrategy**：注册自定义合并策略
 *    - 适用于复杂的合并逻辑（如状态机、累积计算等）
 *    - 完全控制数据的合并方式
 * 
 * 使用场景：
 * - 简单场景：使用 strategy 配置即可（文本累积、多段落等）
 * - 复杂场景：使用 registerMergeStrategy（进度条、任务步骤、嵌套结构等）
 * 
 * 学习目标：
 * - 理解 strategy 的两种取值及其区别
 * - 掌握 registerMergeStrategy 的使用方法
 * - 学会根据场景选择合适的合并方式
 */

// 1. 扩展自定义内容类型：进度条
declare global {
  interface AIContentTypeOverrides {
    progress: ChatBaseContent<
      'progress',
      {
        current: number;
        total: number;
        label: string;
        completed?: boolean; // 是否已完成
      }
    >;
  }
}

// 自定义进度条组件
const ProgressDemo = ({ data }) => {
  // 计算百分比并保留两位小数
  const percentage = Math.round((data.current / data.total) * 10000) / 100;
  const isCompleted = data.completed || percentage === 100;
  
  return (
    <div style={{ padding: '16px 0' }}>
      {/* 根据完成状态显示不同的文案 */}
      <>
        <div style={{ marginBottom: '8px', color: 'var(--td-text-color-secondary)' }}>{data.label}</div>
        <Progress percentage={percentage} />
        <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--td-text-color-placeholder)' }}>
          {data.current} / {data.total} ({percentage}%)
        </div>
      </>
    </div>
  );
};

export default function CustomMerge() {
  const chatRef = useRef<HTMLElement & typeof ChatBot>(null);
  const [messages, setMessages] = useState<ChatMessagesData[]>([]);
  const [isProgressCompleted, setIsProgressCompleted] = useState(false);

  useEffect(() => {
    if (!chatRef.current?.isChatEngineReady) {
      return;
    }

    // 注册自定义合并策略
    // 当内置的 strategy 无法满足需求时，可以注册自定义合并策略
    chatRef.current.registerMergeStrategy<any>('progress', (newChunk, existingChunk) => {
      if (!existingChunk) {
        // 首次接收，直接返回新数据
        return newChunk;
      }

      // 自定义合并逻辑：更新进度和状态
      return {
        ...existingChunk,
        data: {
          ...existingChunk.data,
          current: newChunk.data.current, // 更新当前进度
          label: newChunk.data.label, // 更新标签
          completed: newChunk.data.completed, // 更新完成状态
        },
      };
    });
  }, []);

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/progress',
    stream: true,

    // 3. 在 onMessage 中返回不同类型的数据
    onMessage: (chunk: SSEChunkData, message): AIMessageContent | AIMessageContent[] | null => {
      const { type, ...rest } = chunk.data;

      switch (type) {
        // 处理文本消息
        case 'text':
          return {
            type: 'markdown',
            data: rest?.msg || '',
          };

        // 处理进度条消息，progress的合并逻辑通过 registerMergeStrategy 注册
        case 'progress':
          return {
            type: 'progress',
            data: {
              current: rest.current || 0,
              total: rest.total || 100,
              label: rest.label || '处理中',
              completed: rest.completed || false,
            },
            
          } as any;

        default:
          return null;
      }
    },

    onRequest: (innerParams) => ({
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        uid: 'test',
        prompt: innerParams.prompt,
        progress: true,
      }),
    }),
  };

  return (
    <div style={{ height: '400px' }}>
      <ChatBot
        ref={chatRef}
        chatServiceConfig={chatServiceConfig}
        senderProps={{
          defaultValue: '请分析这份数据报告',
        }}
        onMessageChange={(e) => {
          setMessages(e.detail);
        }}
      >
        {/* 渲染自定义进度条 */}
        {messages
          ?.map((msg) =>
            msg.content?.map((item, index) => {
              if (item.type === 'progress') {
                return (
                  <div slot={`${msg.id}-${item.type}-${index}`} key={`${msg.id}-progress-${index}`}>
                    <ProgressDemo data={item.data} />
                  </div>
                );
              }
              return null;
            }),
          )
          .flat()}
      </ChatBot>
    </div>
  );
}
