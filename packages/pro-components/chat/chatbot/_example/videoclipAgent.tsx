import React, { ReactNode, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  type TdChatMessageConfig,
  ChatList,
  ChatSender,
  ChatMessage,
  TdChatListApi,
  TdChatSenderApi,
  ChatActionBar,
  isAIMessage,
} from '@tdesign-react/aigc';
import { getMessageContentForCopy, TdChatActionsName, TdChatSenderParams } from 'tdesign-web-components';
import { Steps, Card, Tag } from 'tdesign-react';
import {
  PlayCircleIcon,
  VideoIcon,
  CheckCircleFilledIcon,
  CloseCircleFilledIcon,
  TimeFilledIcon,
  LoadingIcon,
  ChevronRightIcon,
} from 'tdesign-icons-react';
import type { ChatMessagesData, ChatRequestParams, ChatBaseContent, AIMessageContent, ToolCall } from '../core/type';
import { ToolCallRenderer, useAgentToolcall, useChat } from '../index';
import type { AgentToolcallConfig, ToolcallComponentProps } from '../components/toolcall/types';
import { applyJsonPatch } from '../core';
import './videoclipAgent.css';

const { StepItem } = Steps;

// 扩展自定义消息体类型
declare module '@tdesign-react/aigc' {
  interface AIContentTypeOverrides {
    videoclipState: ChatBaseContent<'videoclipState', { state: any }>;
  }
}

interface MessageRendererProps {
  item: AIMessageContent;
  index: number;
  message: ChatMessagesData;
}

// 视频剪辑步骤组件
interface VideoClipStepsProps {
  state: Record<
    string,
    {
      items: Array<{
        status: string;
        label: string;
        name: string;
        content: string;
        items?: Array<{
          label: string;
          name: string;
          status: string;
          content: string;
        }>;
      }>;
    }
  >;
}

// 视频剪辑步骤状态映射
const statusMap: Record<string, any> = {
  pending: { theme: 'default', status: 'default', icon: <TimeFilledIcon className="status-icon pending" /> },
  running: { theme: 'primary', status: 'process', icon: <LoadingIcon className="status-icon running" /> },
  completed: { theme: 'success', status: 'finish', icon: <CheckCircleFilledIcon className="status-icon success" /> },
  failed: { theme: 'danger', status: 'error', icon: <CloseCircleFilledIcon className="status-icon failed" /> },
};

// 消息头部组件
interface MessageHeaderProps {
  loading: boolean;
  content: string;
  timeRemain: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ loading, content, timeRemain }) => (
  <div className="message-header">
    <div className="header-loading">{loading ? <LoadingIcon /> : null}</div>
    <div className="header-content">{content}</div>
    <div className="header-time">{timeRemain}</div>
  </div>
);

// 视频剪辑步骤组件
const VideoClipSteps: React.FC<VideoClipStepsProps> = ({ state }) => {
  // 状态管理
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentStepContent, setCurrentStepContent] = useState<{
    mainContent: string;
    items: any[];
  }>({ mainContent: '', items: [] });

  // 可点击的状态
  const canClickState = ['completed', 'running'];

  // 处理步骤点击 - 使用useCallback优化性能
  const handleStepChange = useCallback(
    (stepIndex: number) => {
      if (!state) {
        console.warn('handleStepChange: 状态为空');
        return;
      }

      try {
        const stateKey = Object.keys(state)[0];
        const stepsData = state[stateKey]?.items || [];

        // 检查步骤是否存在且不为null
        if (!stepsData[stepIndex] || stepsData[stepIndex] === null) {
          console.warn(`handleStepChange: 步骤${stepIndex}不存在或为null`);
          return;
        }

        // 只有 running 和 completed 状态的步骤可以点击
        const stepStatus = stepsData[stepIndex].status;
        if (!canClickState.includes(stepStatus)) {
          console.log(`handleStepChange: 步骤${stepIndex}状态为${stepStatus}，不可点击`);
          return;
        }

        console.log(`handleStepChange: 切换到步骤${stepIndex}`, stepsData[stepIndex]);
        setCurrentStep(stepIndex);
        const targetStep = stepsData[stepIndex];
        setCurrentStepContent({
          mainContent: targetStep.content || '',
          items: targetStep.items || [],
        });
      } catch (error) {
        console.error('handleStepChange出错:', error);
      }
    },
    [state, canClickState],
  );

  // 查找正在进行中的步骤
  useEffect(() => {
    if (!state) {
      console.log('useEffect: 状态为空，跳过步骤选择');
      return;
    }

    try {
      const stateKey = Object.keys(state)[0];
      const stepsData = state[stateKey]?.items || [];

      console.log('useEffect: 开始步骤选择', { stateKey, stepsCount: stepsData.length });

      if (stepsData.length > 0) {
        // 优先查找状态为running的步骤
        let targetStepIndex = stepsData.findIndex((item) => item && item.status === 'running');

        // 如果没有running的步骤，查找最后一个completed的步骤
        if (targetStepIndex === -1) {
          // 从后往前查找第一个completed的步骤
          for (let i = stepsData.length - 1; i >= 0; i--) {
            if (stepsData[i] && stepsData[i].status === 'completed') {
              targetStepIndex = i;
              break;
            }
          }
        }

        // 如果找到了合适的步骤，直接设置currentStep，不需要调用handleStepChange
        if (targetStepIndex !== -1) {
          console.log(`useEffect: 选择步骤${targetStepIndex}`, stepsData[targetStepIndex]);
          setCurrentStep(targetStepIndex);
          const targetStep = stepsData[targetStepIndex];
          setCurrentStepContent({
            mainContent: targetStep.content || '',
            items: targetStep.items || [],
          });
        } else {
          // 查找第一个非null的步骤
          const firstValidIndex = stepsData.findIndex((item) => item !== null);
          if (firstValidIndex !== -1) {
            console.log(`useEffect: 选择第一个有效步骤${firstValidIndex}`, stepsData[firstValidIndex]);
            setCurrentStep(firstValidIndex);
            const targetStep = stepsData[firstValidIndex];
            setCurrentStepContent({
              mainContent: targetStep.content || '',
              items: targetStep.items || [],
            });
          } else {
            console.warn('useEffect: 未找到任何有效步骤');
            // 如果没有有效步骤，设置为第一个步骤
            setCurrentStep(0);
            setCurrentStepContent({ mainContent: '', items: [] });
          }
        }
      } else {
        console.log('useEffect: 步骤数据为空');
        setCurrentStep(0);
        setCurrentStepContent({ mainContent: '', items: [] });
      }
    } catch (error) {
      console.error('useEffect步骤选择出错:', error);
    }
  }, [state]);

  // 使用useMemo优化步骤数据计算
  const { stateKey, stepsData, timeRemain, progressStatus, hasRunningSteps } = useMemo(() => {
    if (!state) {
      return {
        stateKey: '',
        stepsData: [],
        timeRemain: '',
        progressStatus: '视频剪辑准备中',
        hasRunningSteps: false,
      };
    }

    const key = Object.keys(state)[0];
    const steps = state[key]?.items || [];

    console.log('===stepsData', key, steps);

    // 估算剩余时间
    const runningItems = steps.filter((item) => item && item.status === 'running');
    let timeRemainText = '';
    if (runningItems.length > 0) {
      // 从内容中提取预估时间
      const timeMatch = runningItems[0].content.match(/预估全部完成还需要(\d+)分钟/);
      if (timeMatch && timeMatch[1]) {
        timeRemainText = `预计剩余时间: ${timeMatch[1]}分钟`;
      }
    }

    // 获取当前进度状态
    const completedCount = steps.filter((item) => item && item.status === 'completed').length;
    const totalCount = steps.length;
    const runningCount = runningItems.length;

    let progressStatusText = '视频剪辑准备中';
    if (completedCount === totalCount) {
      progressStatusText = '视频剪辑已完成';
    } else if (runningCount > 0) {
      progressStatusText = `视频剪辑进行中 (${completedCount}/${totalCount})`;
    }

    return {
      stateKey: key,
      stepsData: steps,
      timeRemain: timeRemainText,
      progressStatus: progressStatusText,
      hasRunningSteps: runningCount > 0,
    };
  }, [state]);

  if (!state) return null;

  return (
    <Card
      className="videoclip-transfer-view"
      title={<MessageHeader loading={hasRunningSteps} content={progressStatus} timeRemain={timeRemain} />}
      bordered
      hoverShadow
    >
      <div className="state-content">
        <div className="main-steps">
          <Steps className="steps-vertical" layout="vertical" current={currentStep} onChange={handleStepChange}>
            {stepsData.map((step, index) => {
              // // 现在不应该有null元素了，但为了安全起见保留检查
              // if (!step) {
              //   console.warn(`步骤${index}为null，这不应该发生`);
              //   return null;
              // }

              const { status, label } = step;
              const stepStatus = statusMap[status] || statusMap.pending;
              const canClick = canClickState.includes(status);

              return (
                <StepItem
                  key={index}
                  title={
                    <div className="step-title">
                      <span>{label || `步骤${index + 1}`}</span>
                      {canClick && <ChevronRightIcon className="step-arrow" />}
                    </div>
                  }
                  status={stepStatus.status}
                  icon={stepStatus.icon}
                />
              );
            })}
          </Steps>
        </div>

        <div className="step-detail">
          <pre className="main-content">{currentStepContent.mainContent}</pre>

          {currentStepContent.items && currentStepContent.items.length > 0 && (
            <div className="sub-steps-container">
              <h4 className="sub-steps-title">子任务进度</h4>
              {currentStepContent.items.map((item, idx) => {
                const itemStatus = statusMap[item.status] || statusMap.pending;
                // 简化状态主题映射
                const getTheme = () => {
                  switch (itemStatus.status) {
                    case 'finish':
                      return 'success';
                    case 'process':
                      return 'primary';
                    case 'error':
                      return 'danger';
                    default:
                      return 'default';
                  }
                };

                return (
                  <Card
                    key={idx}
                    className="sub-step-card"
                    title={
                      <div className="sub-step-header">
                        <span>{item.label}</span>
                        <Tag theme={getTheme()} shape="round">
                          {item.status}
                        </Tag>
                      </div>
                    }
                    bordered
                    hoverShadow
                  >
                    <div className="sub-step-content">
                      <pre>{item.content}</pre>
                      {item.status === 'completed' && (
                        <div className="item-actions">
                          <a href="#" className="action-link">
                            <PlayCircleIcon /> 预览
                          </a>
                          <a href="#" className="action-link">
                            <VideoIcon /> 下载
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// 视频剪辑Agent工具调用类型定义
interface ShowStepsArgs {
  stepId: string;
}

interface EdaTransferArgs {
  event_type: string;
}

// 视频剪辑Agent工具调用
const videoclipActions: AgentToolcallConfig[] = [
  {
    name: 'show_steps',
    description: '显示视频剪辑步骤',
    parameters: [{ name: 'stepId', type: 'string', required: true }],
    component: ({ status, args, error }: ToolcallComponentProps<ShowStepsArgs>) => {
      if (status === 'error') {
        return <div className="videoclip-toolcall error">解析参数失败: {error?.message}</div>;
      }

      return (
        <div className="videoclip-toolcall">
          <h4>视频剪辑进度</h4>
          <p>任务ID: {args.stepId}</p>
        </div>
      );
    },
  },
  {
    name: 'eda_transfer',
    description: '视频剪辑任务事件传输',
    parameters: [{ name: 'event_type', type: 'string', required: true }],
    component: ({ status, args, error }: ToolcallComponentProps<EdaTransferArgs>) => {
      if (status === 'error') {
        return <div className="videoclip-toolcall error">解析参数失败: {error?.message}</div>;
      }

      return (
        <div className="videoclip-toolcall">
          <h4>视频剪辑任务初始化</h4>
          <p>事件类型: {args.event_type}</p>
        </div>
      );
    },
  },
];

/**
 * 注册所有视频剪辑相关的 Agent Toolcalls
 */
export function useVideoclipToolcalls() {
  // 注册所有视频剪辑相关的 actions
  videoclipActions.forEach((action) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAgentToolcall(action);
  });

  return {
    actions: videoclipActions,
  };
}

export default function VideoClipAgentChat() {
  const listRef = useRef<TdChatListApi>(null);
  const inputRef = useRef<TdChatSenderApi>(null);
  const [inputValue, setInputValue] = useState<string>('请帮我剪辑一段李雪琴大笑的视频片段');

  // 注册视频剪辑相关的 Agent Toolcalls
  useVideoclipToolcalls();

  // 视频剪辑状态管理
  const [clipState, setClipState] = useState<VideoClipStepsProps['state'] | null>(null);
  const clipStateRef = useRef<VideoClipStepsProps['state'] | null>(null);

  // 同步 state 和 ref
  useEffect(() => {
    clipStateRef.current = clipState;
  }, [clipState]);

  // 创建聊天服务配置
  const createChatServiceConfig = () => ({
    // 对话服务地址 - 使用 POST 请求
    endpoint: `http://localhost:3000/sse/videoclip`,
    protocol: 'agui' as const,
    stream: true,
    // 流式对话结束
    onComplete: (isAborted: boolean, params?: RequestInit, parsed?: any) => {
      if (parsed?.result?.status === 'user_aborted') {
        return {
          status: 'stop',
        };
      }
    },
    // 流式对话过程中出错
    onError: (err: Error | Response) => {
      console.error('视频剪辑服务错误:', err);
    },
    // 流式对话过程中用户主动结束对话
    onAbort: async () => {
      console.log('用户取消视频剪辑');
    },
    // AG-UI协议消息处理 - 优先级高于内置处理
    onMessage: (chunk: { data?: { type: string; [key: string]: any } }) => {
      if (!chunk.data) return null;

      const { type, ...rest } = chunk.data;

      switch (type) {
        case 'STATE_SNAPSHOT':
          setClipState(rest.snapshot);
          return [
            {
              type: 'videoclipState',
              data: { state: rest.snapshot },
            },
          ];

        case 'STATE_DELTA': {
          try {
            // 使用 ref 获取最新状态
            const currentState = clipStateRef.current;

            if (!currentState) {
              console.warn('STATE_DELTA处理跳过: 没有初始状态，需要先接收STATE_SNAPSHOT事件');
              return null;
            }

            // 应用状态变更到当前状态
            const updatedState = applyJsonPatch(currentState, rest.delta);
            console.log('应用JSON Patch成功:', updatedState);

            // 更新状态
            setClipState(updatedState);

            // 立即返回更新后的状态组件
            return [
              {
                type: 'videoclipState',
                data: { state: updatedState },
              },
            ];
          } catch (error) {
            console.error('STATE_DELTA处理出错:', error);
            return null;
          }
        }
      }

      return null;
    },
    // 自定义请求参数 - 使用 POST 请求
    onRequest: (innerParams: ChatRequestParams) => {
      const { prompt, toolCallMessage } = innerParams;
      const requestBody: any = {
        uid: 'videoclip_agent_uid',
        prompt,
        agentType: 'videoclip-agent',
      };

      // 如果有用户输入数据，添加到请求中
      if (toolCallMessage) {
        requestBody.toolCallMessage = toolCallMessage;
      }

      return {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      };
    },
  });

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: createChatServiceConfig(),
  });

  const senderLoading = React.useMemo(() => status === 'pending' || status === 'streaming', [status]);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
    },
    assistant: {
      placement: 'left',
      chatContentProps: {
        thinking: {
          maxHeight: 120,
        },
      },
    },
  };

  const getChatActionBar = (isLast: boolean) => {
    let filterToolcalls = ['replay', 'good', 'bad', 'copy'];
    if (!isLast) {
      filterToolcalls = filterToolcalls.filter((item) => item !== 'replay');
    }
    return filterToolcalls;
  };

  const actionHandler = (name: string, data?: any) => {
    switch (name) {
      case 'replay': {
        console.log('重新开始视频剪辑');
        chatEngine.regenerateAIMessage();
        return;
      }
      case 'good':
        console.log('用户满意此次视频剪辑');
        break;
      case 'bad':
        console.log('用户不满意此次视频剪辑');
        break;
      default:
        console.log('触发操作', name, 'data', data);
    }
  };

  // 处理工具调用响应
  const handleToolCallRespond = async <T extends object = any>(toolcall: ToolCall, response: T) => {
    try {
      // 构造新的请求参数
      const tools = chatEngine.getToolcallByName(toolcall.toolCallName) || {};
      const newRequestParams: ChatRequestParams = {
        prompt: inputValue,
        toolCallMessage: {
          ...tools,
          result: JSON.stringify(response),
        },
      };

      // 继续对话
      await chatEngine.continueChat(newRequestParams);
      listRef.current?.scrollList({ to: 'bottom' });
    } catch (error) {
      console.error('提交工具调用响应失败:', error);
    }
  };

  const renderMessageContent = ({ item, index }: MessageRendererProps): React.ReactNode => {
    if (item.type === 'toolcall') {
      const { data, type } = item;

      // 使用统一的 ToolCallRenderer 处理所有工具调用
      return (
        <div slot={`${type}-${index}`} key={`toolcall-${index}`} className="content-card">
          <ToolCallRenderer toolCall={data} onRespond={handleToolCallRespond} />
        </div>
      );
    }

    // 处理自定义的 videoclipState 类型
    if (item.type === 'videoclipState' && 'data' in item) {
      const videoclipStateItem = item as {
        type: 'videoclipState';
        data: {
          state: VideoClipStepsProps['state'];
        };
      };

      return (
        <div slot={`${item.type}-${index}`} key={`videoclipState-${index}`} className="content-card">
          <VideoClipSteps state={videoclipStateItem.data.state} />
        </div>
      );
    }

    return null;
  };

  /** 渲染消息内容体 */
  const renderMsgContents = (message: ChatMessagesData, isLast: boolean): ReactNode => (
    <>
      {message.content?.map((item, index) => renderMessageContent({ item, index, message }))}

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
    // 重置视频剪辑状态
    setClipState(null);
    await chatEngine.sendUserMessage(requestParams);
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
    console.log('停止视频剪辑');
    chatEngine.abortChat();
  };

  return (
    <div className="videoclip-agent-container">
      {/* 顶部工具栏 */}
      <div className="videoclip-header">
        <h3>视频剪辑助手</h3>
      </div>

      <div className="chat-content">
        <ChatList ref={listRef} style={{ width: '100%', height: '500px' }}>
          {messages.map((message, idx) => (
            <ChatMessage key={message.id} {...messageProps[message.role]} message={message}>
              {renderMsgContents(message, idx === messages.length - 1)}
            </ChatMessage>
          ))}
        </ChatList>
        <ChatSender
          ref={inputRef}
          value={inputValue}
          placeholder="请输入您的视频剪辑需求，例如：请帮我剪辑一段李雪琴大笑的视频片段"
          loading={senderLoading}
          onChange={inputChangeHandler}
          onSend={sendHandler as any}
          onStop={stopHandler}
        />
      </div>
    </div>
  );
}
