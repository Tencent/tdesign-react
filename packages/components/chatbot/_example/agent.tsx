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
import { ChatBot, Timeline } from 'tdesign-react';

import { CheckCircleFilledIcon } from 'tdesign-icons-react';

import './index.css';

// 自定义渲染-注册插槽规则
const customRenderConfig: TdChatCustomRenderConfig = {
  agent: (content) => ({
    slotName: `${content.state}-${content.id}`,
  }),
};

const RenderAgent = ({ steps }) => {
  return (
    <div style={{ paddingLeft: 10 }}>
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
};

// 扩展自定义消息体类型
declare module 'tdesign-react' {
  interface AIContentTypeOverrides {
    agent: BaseContent<
      'agent',
      {
        steps: any[];
      }
    >;
  }
}

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
    endpoint: 'http://localhost:3000/sse/agent',
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
            ...chunk.data,
          };
        default:
          return {
            ...chunk.data,
            data: { ...chunk.data.content },
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
    const chat = chatRef.current;
    chat.registerMergeStrategy('agent', (newchunk, existing) => {
      const newExisting = { ...existing };
      newExisting.content = { ...existing.content };
      newExisting.content.steps = [...existing.content.steps];

      const stepIndex = newExisting.content.steps.findIndex((step) => step.agent_id === newchunk.content.agent_id);

      if (stepIndex >= 0) {
        const step = { ...newExisting.content.steps[stepIndex] };

        if (['agent_update', 'agent_result'].includes(newchunk.state)) {
          step.tasks = [...(step.tasks || [])];
          step.tasks.push({
            type: newchunk.state === 'agent_update' ? 'command' : 'result',
            text: newchunk.content.text,
          });
        }

        // 设置step状态
        step.status = newchunk.state === 'agent_finish' ? 'finish' : 'pending';
        newExisting.content.steps[stepIndex] = step;
      }

      return newExisting;
    });

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
        defaultMessages={mockData}
        messageProps={messageProps}
        senderProps={{
          defaultValue: '请帮我做一个家庭聚会任务规划',
        }}
        chatServiceConfig={chatServiceConfig}
      >
        {mockMessage
          ?.map((data) =>
            data.content.map((item) => {
              switch (item.state) {
                // 示例：智能体初始化
                case 'agent_init':
                  return (
                    <div slot={`${data.id}-${item.state}-${item.id}`} key={`${data.id}-${item.state}-${item.id}`}>
                      <RenderAgent steps={item.content.steps} />
                    </div>
                  );
                // 处理智能体更新状态
                case 'agent_update':
                  return (
                    <div slot={`${item.content.agent_id}`} key={`${data.id}-${item.state}-${item.id}`}>
                      <div style={{ paddingLeft: 10, marginTop: 4 }}>{item.content.text}</div>
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
