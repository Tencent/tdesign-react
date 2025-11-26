import React, { ReactNode, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  type TdChatMessageConfig,
  ChatList,
  ChatSender,
  ChatMessage,
  ChatActionBar,
  isAIMessage,
  getMessageContentForCopy,
  TdChatSenderParams,
  ChatLoading,
  TdChatActionsName,
  ToolCallRenderer,
  useAgentState,
  useChat,
  useAgentToolcall,
  isUserMessage,
  ChatMessagesData,
  ChatRequestParams,
  AIMessageContent,
  ToolCall,
} from '@tdesign-react/chat';
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

// 自定义Hook：状态跟踪
function useStepsStatusTracker(stepsData: any[]) {
  const [prevStepsStatus, setPrevStepsStatus] = useState<string[]>([]);

  // 获取当前步骤状态
  const currentStepsStatus = useMemo(() => stepsData.map((item) => item?.status || 'unknown'), [stepsData]);

  // 检查状态是否有变化
  const hasStatusChanged = useMemo(
    () => JSON.stringify(currentStepsStatus) !== JSON.stringify(prevStepsStatus),
    [currentStepsStatus, prevStepsStatus],
  );

  // 更新状态记录
  useEffect(() => {
    if (hasStatusChanged) {
      setPrevStepsStatus(currentStepsStatus);
    }
  }, [hasStatusChanged, currentStepsStatus]);

  return { hasStatusChanged, currentStepsStatus, prevStepsStatus };
}

// 步骤选择逻辑
function findTargetStepIndex(stepsData: any[]): number {
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

  return targetStepIndex;
}

// 进度状态计算
function calculateProgressStatus(stepsData: any[]) {
  if (!stepsData || stepsData.length === 0) {
    return {
      timeRemain: '',
      progressStatus: '视频剪辑准备中',
      hasRunningSteps: false,
    };
  }

  // 估算剩余时间
  const runningItems = stepsData.filter((item) => item && item.status === 'running');
  let timeRemainText = '';
  if (runningItems.length > 0) {
    const timeMatch = runningItems[0].content?.match(/预估全部完成还需要(\d+)分钟/);
    if (timeMatch && timeMatch[1]) {
      timeRemainText = `预计剩余时间: ${timeMatch[1]}分钟`;
    }
  }

  // 获取当前进度状态
  const completedCount = stepsData.filter((item) => item && item.status === 'completed').length;
  const totalCount = stepsData.length;
  const runningCount = runningItems.length;

  let progressStatusText = '视频剪辑准备中';
  if (completedCount === totalCount) {
    progressStatusText = '视频剪辑已完成';
  } else if (runningCount > 0) {
    progressStatusText = `视频剪辑进行中 (${completedCount}/${totalCount})`;
  }

  return {
    timeRemain: timeRemainText,
    progressStatus: progressStatusText,
    hasRunningSteps: runningCount > 0,
  };
}

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

// 子任务卡片组件
interface SubTaskCardProps {
  item: any;
  idx: number;
}

const SubTaskCard: React.FC<SubTaskCardProps> = ({ item, idx }) => {
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
};

const CustomUserMessage = ({ message }) => (
  <>
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
  </>
);

// 视频剪辑Agent工具调用类型定义
interface ShowStepsArgs {
  stepId: string;
}

interface VideoClipStepsProps {
  /**
   * 绑定到特定的状态key，如果指定则只显示该状态key的状态
   * 这样可以确保多轮对话时，每个消息的步骤显示都是独立的
   * 对于videoclip业务，这个stateKey通常就是runId
   */
  boundStateKey?: string;
  /**
   * 状态订阅模式
   * latest: 订阅最新状态，适用于状态覆盖场景
   * bound: 订阅特定stateKey，适用于状态隔离场景
   */
  mode?: 'latest' | 'bound';
}

/**
 * 使用状态订阅机制的视频剪辑步骤组件
 * 演示如何通过useAgentState订阅AG-UI状态事件
 */
export const VideoClipSteps: React.FC<VideoClipStepsProps> = ({ boundStateKey }) => {
  // 订阅AG-UI状态事件
  const { stateMap, currentStateKey } = useAgentState({
    subscribeKey: boundStateKey,
  });

  // 本地UI状态
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentStepContent, setCurrentStepContent] = useState<{
    mainContent: string;
    items: any[];
  }>({ mainContent: '', items: [] });
  const [isManualSelection, setIsManualSelection] = useState<boolean>(false);

  // 可点击的状态
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const canClickState = ['completed', 'running'];

  // 提取当前组件关心的状态数据
  const stepsData = useMemo(() => {
    const targetStateKey = boundStateKey || currentStateKey;
    if (!stateMap || !targetStateKey || !stateMap[targetStateKey]) {
      return [];
    }
    return stateMap[targetStateKey].items || [];
  }, [stateMap, boundStateKey, currentStateKey]);

  // 使用状态跟踪Hook
  const { hasStatusChanged } = useStepsStatusTracker(stepsData);

  // 处理步骤点击
  const handleStepChange = useCallback(
    (stepIndex: number) => {
      try {
        if (!stepsData[stepIndex] || stepsData[stepIndex] === null) {
          console.warn(`handleStepChange: 步骤${stepIndex}不存在或为null`);
          return;
        }

        const stepStatus = stepsData[stepIndex].status;
        if (!canClickState.includes(stepStatus)) {
          return;
        }

        setIsManualSelection(true);
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
    [canClickState, stepsData],
  );

  // 自动选择当前步骤
  useEffect(() => {
    if (stepsData.length === 0) {
      setCurrentStep(0);
      setCurrentStepContent({ mainContent: '', items: [] });
      setIsManualSelection(false);
      return;
    }

    // 如果用户手动选择了步骤，不执行自动选择逻辑
    if (isManualSelection) {
      return;
    }

    // 如果有新的running步骤，重置手动选择标记
    const hasRunningStep = stepsData.some((item) => item && item.status === 'running');
    if (hasRunningStep && isManualSelection) {
      setIsManualSelection(false);
      return; // 让下次useEffect执行自动选择
    }

    try {
      const targetStepIndex = findTargetStepIndex(stepsData);

      // 只有在目标步骤不同或状态有变化时才更新
      if ((targetStepIndex !== -1 && targetStepIndex !== currentStep) || hasStatusChanged) {
        if (targetStepIndex !== -1) {
          setCurrentStep(targetStepIndex);
          const targetStep = stepsData[targetStepIndex];
          setCurrentStepContent({
            mainContent: targetStep.content || '',
            items: targetStep.items || [],
          });
        } else {
          const firstValidIndex = stepsData.findIndex((item) => item !== null);
          if (firstValidIndex !== -1) {
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
      }
    } catch (error) {
      console.error('useEffect步骤选择出错:', error);
    }
  }, [stepsData, currentStep, hasStatusChanged, isManualSelection]);

  // 计算进度状态和其他UI信息
  const { timeRemain, progressStatus, hasRunningSteps } = useMemo(
    () => calculateProgressStatus(stepsData),
    [stepsData],
  );

  console.log('render: ', boundStateKey);

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
              {currentStepContent.items.map((item, idx) => (
                <SubTaskCard key={idx} item={item} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// 视频剪辑Agent工具调用配置
const videoclipActions: AgentToolcallConfig[] = [
  {
    name: 'show_steps',
    description: '显示视频剪辑步骤',
    parameters: [{ name: 'stepId', type: 'string', required: true }],
    component: ({ status, args, error }: ToolcallComponentProps<ShowStepsArgs>) => {
      if (status === 'error') {
        return <div className="videoclip-toolcall error">解析参数失败: {error?.message}</div>;
      }
      // 使用绑定stateKey的VideoClipSteps组件，这样每个消息的步骤显示都是独立的
      // 对于videoclip业务，stepId实际上就是runId，我们将其作为stateKey使用
      const stateKey = args?.stepId;
      return <VideoClipSteps boundStateKey={stateKey} />;
    },
  },
];

interface MessageRendererProps {
  item: AIMessageContent;
  index: number;
  message: ChatMessagesData;
  isLast: boolean;
}

/**
 * 使用状态订阅机制的视频剪辑Agent聊天组件
 * 演示如何结合状态订阅和工具调用功能
 */
export default function VideoClipAgentChatWithSubscription() {
  const listRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>('请帮我剪辑一段李雪琴大笑的视频片段');

  // 注册视频剪辑相关的 Agent Toolcalls
  useAgentToolcall(videoclipActions);

  // 创建聊天服务配置
  const createChatServiceConfig = () => ({
    // 对话服务地址 - 使用 POST 请求
    endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/videoclip`,
    protocol: 'agui' as const,
    stream: true,
    defaultMessages: [],
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
      await chatEngine.sendAIMessage({
        params: newRequestParams,
        sendRequest: true,
      });
      listRef.current?.scrollList({ to: 'bottom' });
    } catch (error) {
      console.error('提交工具调用响应失败:', error);
    }
  };

  const renderMessageContent = ({ item, index, isLast }: MessageRendererProps): React.ReactNode => {
    const { data, type } = item;
    if (item.type === 'suggestion' && !isLast) {
      // 只有最后一条消息才需要展示suggestion，其他消息将slot内容置空
      return <div slot={`${type}-${index}`} key={`suggestion-${index}`} className="content-card"></div>;
    }
    if (item.type === 'toolcall') {
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
      {message.content?.map((item, index) => renderMessageContent({ item, index, message, isLast }))}

      {isAIMessage(message) && message.status === 'complete' ? (
        <ChatActionBar
          slot="actionbar"
          actionBar={getChatActionBar(isLast) as TdChatActionsName[]}
          handleAction={actionHandler}
          copyText={getMessageContentForCopy(message)}
          comment={message.role === 'assistant' ? message.comment : undefined}
        />
      ) : (
        isLast &&
        message.status !== 'stop' && (
          <div slot="actionbar">
            <ChatLoading animation="dot"></ChatLoading>
          </div>
        )
      )}
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
      <div className="chat-content">
        {/* 聊天区域 */}
        <ChatList ref={listRef} style={{ width: '100%', height: '400px' }}>
          {messages.map((message, idx) => (
            <ChatMessage key={message.id} {...messageProps[message.role]} message={message as any}>
              {isUserMessage(message) && (
                <div slot="content">
                  <CustomUserMessage message={message} />
                </div>
              )}
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
