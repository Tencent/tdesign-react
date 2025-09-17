import React, { useEffect, useRef } from 'react';
import type {
  TdChatMessageConfig,
  AIMessageContent,
  ChatRequestParams,
  ChatServiceConfig,
  ChatBaseContent,
  ChatMessagesData,
  SSEChunkData,
} from '@tdesign-react/chat';
import { Timeline } from 'tdesign-react';

import { CheckCircleFilledIcon } from 'tdesign-icons-react';

import { ChatBot } from '@tdesign-react/chat';

import './index.css';

const AgentTimeline = ({ steps }) => (
  <div style={{ paddingLeft: 10, marginTop: 14 }}>
    <Timeline mode="same" theme="dot">
      {steps.map((step) => (
        <Timeline.Item
          key={step.agent_id}
          label=""
          dot={<CheckCircleFilledIcon size="medium" color={step?.status === 'finish' ? 'green' : '#ccc'} />}
        >
          <div className={'step'}>
            <div className={'title'}>{step.step}</div>
            {step?.tasks?.map((task, taskIndex) => (
              <div key={`${step.agent_id}_task_${taskIndex}`}>
                <div className={task.type}>{task.text}</div>
              </div>
            ))}
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  </div>
);

// 扩展自定义消息体类型
type AgentContent = ChatBaseContent<
  'agent',
  {
    id: string;
    state: 'pending' | 'command' | 'result' | 'finish';
    content: {
      steps?: {
        step: string;
        agent_id: string;
        status: string;
        tasks?: {
          type: 'command' | 'result';
          text: string;
        }[];
      }[];
      text?: string;
    };
  }
>;

// 默认初始化消息
const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'assistant',
    status: 'complete',
    content: [
      {
        type: 'text',
        data: '欢迎使用TDesign Agent家庭活动策划助手，请给我布置任务吧～',
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
    },
  };

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    // 对话服务地址
    endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agent`,
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
        case 'agent':
          return {
            type: 'agent',
            ...rest,
          };
        default:
          return {
            ...chunk.data,
            data: { ...chunk.data.content },
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
          uid: 'agent_uid',
          prompt,
        }),
      };
    },
  };

  useEffect(() => {
    if (!chatRef.current) {
      return;
    }
    // 此处增加自定义消息内容合并策略逻辑
    // 该示例agent类型结构比较复杂，根据任务步骤的state有不同的策略，组件内onMessage这里提供了的strategy无法满足，可以通过注册合并策略自行实现
    chatRef.current.registerMergeStrategy<AgentContent>('agent', (newChunk, existing) => {
      console.log('newChunk, existing', newChunk, existing);
      // 创建新对象避免直接修改原状态
      const updated = {
        ...existing,
        content: {
          ...existing.content,
          steps: [...existing.content.steps],
        },
      };

      const stepIndex = updated.content.steps.findIndex((step) => step.agent_id === newChunk.content.agent_id);

      if (stepIndex === -1) return updated;

      // 更新步骤信息
      const step = {
        ...updated.content.steps[stepIndex],
        tasks: [...(updated.content.steps[stepIndex].tasks || [])],
        status: newChunk.state === 'finish' ? 'finish' : 'pending',
      };

      // 处理不同类型的新数据
      if (newChunk.state === 'command') {
        // 新增每个步骤执行的命令
        step.tasks.push({
          type: 'command',
          text: newChunk.content.text,
        });
      } else if (newChunk.state === 'result') {
        // 新增每个步骤执行的结论是流式输出，需要分情况处理
        const resultTaskIndex = step.tasks.findIndex((task) => task.type === 'result');
        if (resultTaskIndex >= 0) {
          // 合并到已有结果
          step.tasks = step.tasks.map((task, index) =>
            index === resultTaskIndex ? { ...task, text: task.text + newChunk.content.text } : task,
          );
        } else {
          // 添加新结果
          step.tasks.push({
            type: 'result',
            text: newChunk.content.text,
          });
        }
      }

      updated.content.steps[stepIndex] = step;
      return updated;
    });
  }, []);

  return (
    <div style={{ height: '600px' }}>
      <ChatBot
        ref={chatRef}
        style={{ height: '100%' }}
        defaultMessages={mockData}
        messageProps={messageProps}
        senderProps={{
          defaultValue: '请帮我做一个5岁儿童生日聚会的规划',
        }}
        chatServiceConfig={chatServiceConfig}
        onMessageChange={(e) => {
          setMockMessage(e.detail);
        }}
      >
        {mockMessage
          ?.map((msg) =>
            msg?.content?.map((item, index) => {
              if (item.type === 'agent') {
                return (
                  <div slot={`${msg.id}-${item.type}-${index}`} key={`${msg.id}-${item.state}-${item.id}`}>
                    <AgentTimeline steps={item.content.steps} />
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
