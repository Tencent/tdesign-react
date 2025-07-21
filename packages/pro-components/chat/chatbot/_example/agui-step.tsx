import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  type SSEChunkData,
  type TdChatMessageConfig,
  type AIMessageContent,
  type ChatRequestParams,
  type ChatMessagesData,
  type ChatBaseContent,
  ChatList,
  ChatSender,
  ChatMessage,
  TdChatListApi,
  TdChatSenderApi,
  ChatActionBar,
  isAIMessage,
  useChat,
} from '@tdesign-react/aigc';
import { getMessageContentForCopy, TdChatActionsName, TdChatSenderParams } from 'tdesign-web-components';
import { Timeline } from 'tdesign-react';
import { CheckCircleFilledIcon } from 'tdesign-icons-react';
import mockData from './mock/data';

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
declare module '@tdesign-react/aigc' {
  interface AIContentTypeOverrides {
    agent: ChatBaseContent<
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
  }
}

export default function ComponentsBuild() {
  const listRef = useRef<TdChatListApi>(null);
  const inputRef = useRef<TdChatSenderApi>(null);
  const [inputValue, setInputValue] = useState<string>('南极的自动提款机叫什么名字');
  const { chatEngine, messages, status } = useChat({
    defaultMessages: mockData.normal,
    // 聊天服务配置
    chatServiceConfig: {
      // 对话服务地址
      endpoint: `http://127.0.0.1:3000/sse/agui`,
      // endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agent`,
      protocol: 'agui',
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
    },
  });

  const senderLoading = useMemo(() => {
    if (status === 'pending' || status === 'streaming') {
      return true;
    }
    return false;
  }, [status]);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
    },
    assistant: {
      placement: 'left',
      // 内置的消息渲染配置
      chatContentProps: {
        thinking: {
          maxHeight: 100,
        },
      },
    },
  };

  const getChatActionBar = (isLast: boolean) => {
    let filterActions = ['replay', 'good', 'bad', 'copy'];
    if (!isLast) {
      // 只有最后一条AI消息才能重新生成
      filterActions = filterActions.filter((item) => item !== 'replay');
    }
    return filterActions;
  };

  const actionHandler = (name: string, data?: any) => {
    switch (name) {
      case 'replay': {
        console.log('自定义重新回复');
        chatEngine.regenerateAIMessage();
        return;
      }
      default:
        console.log('触发action', name, 'data', data);
    }
  };

  /** 渲染消息内容体 */
  const renderMsgContents = (message: ChatMessagesData, isLast: boolean): ReactNode => (
    <>
      {message.content.map((item, index) => {
        if (item.type === 'agent') {
          return (
            <div slot={`${item.type}-${index}`} key={`${item.state}-${item.id}`}>
              <AgentTimeline steps={item.content.steps} />
            </div>
          );
        }
        return null;
      })}
      {isAIMessage(message) && message.status === 'complete' ? (
        <ChatActionBar
          slot="actionbar"
          actionBar={getChatActionBar(isLast) as TdChatActionsName[]}
          handleAction={actionHandler}
          copyText={getMessageContentForCopy(message)}
          comment={message.role === 'assistant' ? message.comment : undefined}
        />
      ) : null}
    </>
  );

  const sendUserMessage = async (requestParams: ChatRequestParams) => {
    await chatEngine.sendUserMessage(requestParams);
    listRef.current?.scrollList({ to: 'bottom' });
  };

  const inputChangeHandler = (e: CustomEvent) => {
    setInputValue(e.detail);
  };

  const sendHandler = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    const params = {
      prompt: value,
    };
    await sendUserMessage(params);
    setInputValue('');
  };

  const stopHandler = () => {
    chatEngine.abortChat();
  };

  useEffect(() => {
    if (!chatEngine) {
      return;
    }
    // 此处增加自定义消息内容合并策略逻辑
    // 该示例agent类型结构比较复杂，根据任务步骤的state有不同的策略，组件内onMessage这里提供了的strategy无法满足，可以通过注册合并策略自行实现
    chatEngine.registerMergeStrategy('agent', (newChunk, existing) => {
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
  }, [chatEngine]);

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <ChatList ref={listRef} style={{ width: '100%' }}>
        {messages.map((message, idx) => (
          <ChatMessage key={message.id} {...messageProps[message.role]} message={message}>
            {renderMsgContents(message, idx === messages.length - 1)}
          </ChatMessage>
        ))}
      </ChatList>
      <ChatSender
        ref={inputRef}
        value={inputValue}
        placeholder="请输入内容"
        loading={senderLoading}
        onChange={inputChangeHandler}
        onSend={sendHandler}
        onStop={stopHandler}
      ></ChatSender>
    </div>
  );
}
