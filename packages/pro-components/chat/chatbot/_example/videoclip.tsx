import React, { ReactNode, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  type TdChatMessageConfig,
  ChatList,
  ChatSender,
  ChatMessage,
  ChatActionBar,
  isAIMessage,
} from '@tdesign-react/aigc';
import { getMessageContentForCopy, TdChatActionsName, TdChatSenderParams } from 'tdesign-web-components';
import { Steps, Card, Tag, Progress } from 'tdesign-react';
import {
  PlayCircleIcon,
  VideoIcon,
  CheckCircleFilledIcon,
  CloseCircleFilledIcon,
  TimeFilledIcon,
  LoadingIcon,
  ChevronRightIcon,
  ChartIcon,
} from 'tdesign-icons-react';
import type { ChatMessagesData, ChatRequestParams, AIMessageContent, ToolCall } from '../core/type';
import { ToolCallRenderer, useAgentToolcall, useChat, useStateSubscription } from '../index';
import type { AgentToolcallConfig, ToolcallComponentProps } from '../components/toolcall/types';
import './videoclipAgent.css';

const { StepItem } = Steps;

// 状态映射
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

/**
 * 视频剪辑进度统计组件
 * 演示如何订阅不同的状态数据
 */
export const VideoClipProgressStats: React.FC = () => {
  // 订阅进度统计状态
  const {
    state: progressState,
    setState: setProgressState,
    updating: progressUpdating,
  } = useStateSubscription({
    name: 'videoclip-progress', // 专门用于进度统计的状态
    initialState: { completed: 0, total: 0, timeElapsed: 0 },
  });

  if (!progressState) {
    return (
      <Card className="progress-stats" title="进度统计" bordered>
        <div>等待进度数据...</div>
        {progressUpdating && <div>统计更新中...</div>}
      </Card>
    );
  }

  const { completed, total, timeElapsed } = progressState;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="progress-stats" title="进度统计" bordered>
      <div className="stats-content">
        <div className="stat-item">
          <span className="stat-label">完成进度:</span>
          <Progress percent={progressPercent} theme="success" />
          <span className="stat-value">{completed}/{total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">耗时:</span>
          <span className="stat-value">{Math.floor(timeElapsed / 60)}分{timeElapsed % 60}秒</span>
        </div>
        {progressUpdating && <div className="updating-indicator">数据更新中...</div>}
      </div>
    </Card>
  );
};

/**
 * 视频剪辑资源监控组件
 * 演示订阅资源使用情况状态
 */
export const VideoClipResourceMonitor: React.FC = () => {
  // 订阅资源监控状态
  const {
    state: resourceState,
    setState: setResourceState,
    updating: resourceUpdating,
  } = useStateSubscription({
    name: 'videoclip-resource', // 专门用于资源监控的状态
    initialState: { cpu: 0, memory: 0, gpu: 0, storage: 0 },
  });

  if (!resourceState) {
    return (
      <Card className="resource-monitor" title="资源监控" bordered>
        <div>等待资源数据...</div>
        {resourceUpdating && <div>监控更新中...</div>}
      </Card>
    );
  }

  const { cpu, memory, gpu, storage } = resourceState;

  return (
    <Card className="resource-monitor" title="资源监控" bordered>
      <div className="resource-content">
        <div className="resource-item">
          <span className="resource-label">CPU使用率:</span>
          <Progress percent={cpu} theme={cpu > 80 ? 'danger' : 'primary'} />
          <span className="resource-value">{cpu}%</span>
        </div>
        <div className="resource-item">
          <span className="resource-label">内存使用率:</span>
          <Progress percent={memory} theme={memory > 80 ? 'danger' : 'primary'} />
          <span className="resource-value">{memory}%</span>
        </div>
        <div className="resource-item">
          <span className="resource-label">GPU使用率:</span>
          <Progress percent={gpu} theme={gpu > 80 ? 'danger' : 'primary'} />
          <span className="resource-value">{gpu}%</span>
        </div>
        <div className="resource-item">
          <span className="resource-label">存储使用:</span>
          <Progress percent={storage} theme={storage > 90 ? 'danger' : 'primary'} />
          <span className="resource-value">{storage}%</span>
        </div>
        {resourceUpdating && <div className="updating-indicator">监控更新中...</div>}
      </div>
    </Card>
  );
};

/**
 * 使用状态订阅机制的视频剪辑步骤组件
 * 演示如何通过useStateSubscription订阅AG-UI状态事件
 */
export const VideoClipStepsWithSubscription: React.FC = () => {
  // 使用状态订阅Hook，订阅视频剪辑步骤状态
  const {
    state: clipState,
    setState: setClipState,
    updating,
  } = useStateSubscription({
    name: 'videoclip-steps', // 专门用于视频剪辑步骤的状态
    initialState: null,
  });

  // 本地UI状态
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentStepContent, setCurrentStepContent] = useState<{
    mainContent: string;
    items: any[];
  }>({ mainContent: '', items: [] });

  // 可点击的状态
  const canClickState = ['completed', 'running'];

  // 处理步骤点击
  const handleStepChange = useCallback(
    (stepIndex: number) => {
      if (!clipState) {
        console.warn('handleStepChange: 状态为空');
        return;
      }

      try {
        const stateKey = Object.keys(clipState)[0];
        const stepsData = clipState[stateKey]?.items || [];

        if (!stepsData[stepIndex] || stepsData[stepIndex] === null) {
          console.warn(`handleStepChange: 步骤${stepIndex}不存在或为null`);
          return;
        }

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
    [clipState, canClickState],
  );

  // 自动选择当前步骤
  useEffect(() => {
    if (!clipState) {
      console.log('useEffect: 状态为空，跳过步骤选择');
      return;
    }

    try {
      const stateKey = Object.keys(clipState)[0];
      const stepsData = clipState[stateKey]?.items || [];

      console.log('useEffect: 开始步骤选择', { stateKey, stepsCount: stepsData.length });

      if (stepsData.length > 0) {
        // 优先查找状态为running的步骤
        let targetStepIndex = stepsData.findIndex((item) => item && item.status === 'running');

        // 如果没有running的步骤，查找最后一个completed的步骤
        if (targetStepIndex === -1) {
          for (let i = stepsData.length - 1; i >= 0; i--) {
            if (stepsData[i] && stepsData[i].status === 'completed') {
              targetStepIndex = i;
              break;
            }
          }
        }

        if (targetStepIndex !== -1) {
          console.log(`useEffect: 选择步骤${targetStepIndex}`, stepsData[targetStepIndex]);
          setCurrentStep(targetStepIndex);
          const targetStep = stepsData[targetStepIndex];
          setCurrentStepContent({
            mainContent: targetStep.content || '',
            items: targetStep.items || [],
          });
        } else {
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
  }, [clipState]);

  // 计算步骤数据和进度状态
  const { stepsData, timeRemain, progressStatus, hasRunningSteps } = useMemo(() => {
    if (!clipState) {
      return {
        stepsData: [],
        timeRemain: '',
        progressStatus: '视频剪辑准备中',
        hasRunningSteps: false,
      };
    }

    const key = Object.keys(clipState)[0];
    const steps = clipState[key]?.items || [];

    console.log('===stepsData', key, steps);

    // 估算剩余时间
    const runningItems = steps.filter((item) => item && item.status === 'running');
    let timeRemainText = '';
    if (runningItems.length > 0) {
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
      stepsData: steps,
      timeRemain: timeRemainText,
      progressStatus: progressStatusText,
      hasRunningSteps: runningCount > 0,
    };
  }, [clipState]);

  // 如果没有状态数据，显示等待状态
  if (!clipState) {
    return (
      <Card className="videoclip-transfer-view" title="等待状态数据..." bordered hoverShadow>
        <div className="state-content">
          <p>正在等待AG-UI状态事件...</p>
          {updating && <p>状态更新中...</p>}
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="videoclip-transfer-view"
      title={<MessageHeader loading={hasRunningSteps || updating} content={progressStatus} timeRemain={timeRemain} />}
      bordered
      hoverShadow
    >
      <div className="state-content">
        <div className="main-steps">
          <Steps className="steps-vertical" layout="vertical" current={currentStep} onChange={handleStepChange}>
            {stepsData.map((step, index) => {
              const { status: stepStatus, label } = step;
              const stepStatusConfig = statusMap[stepStatus] || statusMap.pending;
              const canClick = canClickState.includes(stepStatus);

              return (
                <StepItem
                  key={index}
                  title={
                    <div className="step-title">
                      <span>{label || `步骤${index + 1}`}</span>
                      {canClick && <ChevronRightIcon className="step-arrow" />}
                    </div>
                  }
                  status={stepStatusConfig.status}
                  icon={stepStatusConfig.icon}
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

interface ShowProgressArgs {
  taskId: string;
}

interface ShowResourceArgs {
  monitorType: string;
}

interface EdaTransferArgs {
  event_type?: string;
}

// 视频剪辑Agent工具调用配置 - 多状态订阅示例
const videoclipMultiStateActions: AgentToolcallConfig[] = [
  {
    name: 'show_steps',
    description: '显示视频剪辑步骤',
    parameters: [{ name: 'stepId', type: 'string', required: true }],
    component: ({ status, args, error }: ToolcallComponentProps<ShowStepsArgs>) => {
      if (status === 'error') {
        return <div className="videoclip-toolcall error">解析参数失败: {error?.message}</div>;
      }

      // 使用步骤状态订阅组件
      return <VideoClipStepsWithSubscription />;
    },
  },
  {
    name: 'show_progress',
    description: '显示视频剪辑进度统计',
    parameters: [{ name: 'taskId', type: 'string', required: true }],
    component: ({ status, args, error }: ToolcallComponentProps<ShowProgressArgs>) => {
      if (status === 'error') {
        return <div className="videoclip-toolcall error">解析参数失败: {error?.message}</div>;
      }

      // 使用进度统计状态订阅组件
      return <VideoClipProgressStats />;
    },
  },
  {
    name: 'show_resource',
    description: '显示视频剪辑资源监控',
    parameters: [{ name: 'monitorType', type: 'string', required: true }],
    component: ({ status, args, error }: ToolcallComponentProps<ShowResourceArgs>) => {
      if (status === 'error') {
        return <div className="videoclip-toolcall error">解析参数失败: {error?.message}</div>;
      }

      // 使用资源监控状态订阅组件
      return <VideoClipResourceMonitor />;
    },
  },
  {
    name: 'eda_transfer',
    description: '视频剪辑任务事件传输',
    parameters: [],
    component: ({ status, args, error }: ToolcallComponentProps<EdaTransferArgs>) => {
      if (status === 'error') {
        return <div className="videoclip-toolcall error">解析参数失败: {error?.message}</div>;
      }

      return (
        <div className="videoclip-toolcall">
          <h4>视频剪辑任务初始化</h4>
          <p>事件类型: {args?.event_type || '未知'}</p>
        </div>
      );
    },
  },
];

/**
 * 注册所有视频剪辑相关的 Agent Toolcalls
 */
export function useVideoclipMultiStateToolcalls() {
  // 注册所有视频剪辑相关的 actions
  videoclipMultiStateActions.forEach((action) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAgentToolcall(action);
  });

  return {
    actions: videoclipMultiStateActions,
  };
}

interface MessageRendererProps {
  item: AIMessageContent;
  index: number;
  message: ChatMessagesData;
}

/**
 * 多状态订阅的视频剪辑Agent聊天组件
 * 演示如何使用不同的状态订阅name来区分不同的状态数据
 */
export default function VideoClipAgentMultiStateChat() {
  const listRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>('请帮我剪辑一段李雪琴大笑的视频片段');

  // 注册视频剪辑相关的 Agent Toolcalls
  useVideoclipMultiStateToolcalls();

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
    // AG-UI协议消息处理 - 状态事件已由StateManager自动处理
    onMessage: (chunk: { data?: { type: string; [key: string]: any } }, message: any, parsedResult: any) => {
      // 优先使用event-mapper的处理结果
      if (parsedResult) {
        return parsedResult;
      }
      // 状态事件已由StateManager自动处理，这里只需要处理其他类型的事件
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
        <h3>视频剪辑助手 (多状态订阅版本)</h3>
        <p>演示如何使用不同的状态订阅name来区分不同的状态数据</p>
      </div>

      <div className="chat-content">
        {/* 聊天区域 */}
        <ChatList ref={listRef} style={{ width: '100%', height: '400px' }}>
          {messages.map((message, idx) => (
            <ChatMessage key={message.id} {...messageProps[message.role]} message={message as any}>
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
