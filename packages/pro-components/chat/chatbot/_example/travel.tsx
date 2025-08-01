import React, { ReactNode, useMemo, useRef, useState } from 'react';
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
import { LoadingIcon } from 'tdesign-icons-react';
import { useChat } from '../useChat';
import type { ChatMessagesData, ChatRequestParams, ChatBaseContent, AIMessageContent } from '../core/type';
import { AGUIAdapter, type AGUIHistoryMessage } from '../core/adapters/agui';
import { PlanningStatePanel, WeatherCard, ItineraryCard, HotelCard, HumanInputResult } from './components';
import './travel-planner.css';

// 扩展自定义消息体类型
declare module '@tdesign-react/aigc' {
  interface AIContentTypeOverrides {
    weather: ChatBaseContent<'weather', { weather: any[] }>;
    itinerary: ChatBaseContent<'itinerary', { plan: any[] }>;
    hotel: ChatBaseContent<'hotel', { hotels: any[] }>;
    planningState: ChatBaseContent<'planningState', { state: any }>;
  }
}

interface MessageRendererProps {
  item: AIMessageContent;
  index: number;
  message: ChatMessagesData;
}

// 加载历史消息的函数
const loadHistoryMessages = async (): Promise<ChatMessagesData[]> => {
  try {
    const response = await fetch('http://localhost:3000/api/conversation/history');
    if (response.ok) {
      const result = await response.json();
      const historyMessages: AGUIHistoryMessage[] = result.data;

      // 使用AGUIAdapter的静态方法进行转换
      return AGUIAdapter.convertHistoryMessages(historyMessages);
    }
  } catch (error) {
    console.error('加载历史消息失败:', error);
  }
  return [];
};

// 创建聊天服务配置
const createChatServiceConfig = ({
  setPlanningState,
  setCurrentStep,
  planningState,
}: {
  setPlanningState: (state: any) => void;
  setCurrentStep: (step: string) => void;
  planningState: any;
}) => ({
  // 对话服务地址 - 使用现有的服务
  endpoint: `http://localhost:3000/sse/agui`,
  protocol: 'agui' as const,
  stream: true,
  // 流式对话结束
  onComplete: (aborted: boolean, params?: RequestInit) => {
    console.log('旅游规划完成', aborted, params);
    return null;
  },
  // 流式对话过程中出错
  onError: (err: Error | Response) => {
    console.error('旅游规划服务错误:', err);
  },
  // 流式对话过程中用户主动结束对话
  onAbort: async () => {
    console.log('用户取消旅游规划');
  },
  // AG-UI协议消息处理 - 优先级高于内置处理
  onMessage: (chunk): AIMessageContent | undefined => {
    const { type, ...rest } = chunk.data;
    switch (type) {
      // ========== 步骤开始/结束事件处理 ==========
      case 'STEP_STARTED':
        console.log('步骤开始:', rest.stepName);
        setCurrentStep(rest.stepName);
        break;

      case 'STEP_FINISHED':
        console.log('步骤完成:', rest.stepName);
        setCurrentStep('');
        break;
      // ========== 状态管理事件处理 ==========
      case 'STATE_SNAPSHOT':
        setPlanningState(rest.snapshot);
        return {
          type: 'planningState',
          data: { state: rest.snapshot },
        } as any;

      case 'STATE_DELTA':
        // 应用状态变更到当前状态
        setPlanningState((prevState: any) => {
          if (!prevState) return prevState;

          const newState = { ...prevState };
          rest.delta.forEach((change: any) => {
            const { op, path, value } = change;
            if (op === 'replace') {
              // 简单的路径替换逻辑
              if (path === '/status') {
                newState.status = value;
              }
            } else if (op === 'add') {
              // 简单的路径添加逻辑
              if (path.startsWith('/itinerary/')) {
                if (!newState.itinerary) newState.itinerary = {};
                const key = path.split('/').pop();
                newState.itinerary[key] = value;
              }
            }
          });
          return newState;
        });

        // 返回更新后的状态组件
        return {
          type: 'planningState',
          data: { state: planningState },
        } as any;
    }
  },
  // 自定义请求参数
  onRequest: (innerParams: ChatRequestParams) => {
    const { prompt } = innerParams;
    return {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: 'travel_planner_uid',
        prompt,
        agentType: 'travel-planner',
      }),
    };
  },
});

export default function TravelPlannerChat() {
  const listRef = useRef<TdChatListApi>(null);
  const inputRef = useRef<TdChatSenderApi>(null);
  const [inputValue, setInputValue] = useState<string>('请为我规划一个北京5日游行程');

  // 规划状态管理 - 用于右侧面板展示
  const [planningState, setPlanningState] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  // 加载历史消息
  const [defaultMessages, setDefaultMessages] = useState<ChatMessagesData[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // 在组件挂载时加载历史消息
  React.useEffect(() => {
    const loadHistory = async () => {
      setIsLoadingHistory(true);
      const messages = await loadHistoryMessages();
      console.log('messages', messages);
      setDefaultMessages(messages);
      setIsLoadingHistory(false);
    };
    loadHistory();
  }, []);

  const { chatEngine, messages, status } = useChat({
    defaultMessages,
    // 聊天服务配置
    chatServiceConfig: createChatServiceConfig({
      setPlanningState,
      setCurrentStep,
      planningState,
    }),
  });

  const senderLoading = useMemo(() => status === 'pending' || status === 'streaming', [status]);

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
    let filterActions = ['replay', 'good', 'bad', 'copy'];
    if (!isLast) {
      filterActions = filterActions.filter((item) => item !== 'replay');
    }
    return filterActions;
  };

  const actionHandler = (name: string, data?: any) => {
    switch (name) {
      case 'replay': {
        console.log('重新规划旅游行程');
        chatEngine.regenerateAIMessage();
        return;
      }
      case 'good':
        console.log('用户满意此次规划');
        break;
      case 'bad':
        console.log('用户不满意此次规划');
        break;
      default:
        console.log('触发操作', name, 'data', data);
    }
  };

  const renderMessageContent = ({ item, index, message }: MessageRendererProps): React.ReactNode => {
    if (item.type === 'toolcall') {
      const { data, type } = item;

      // Human-in-the-Loop 输入请求
      if (data.toolCallName === 'get_travel_preferences') {
        // 区分历史消息和实时交互
        const isHistoricalMessage = message.status === 'complete';

        if (isHistoricalMessage && data.result) {
          // 历史消息：静态展示用户已输入的数据
          try {
            const userInput = JSON.parse(data.result);
            return (
              <div slot={`${type}-${index}`} key={`human-input-result-${index}`} className="content-card">
                <HumanInputResult userInput={userInput} />
              </div>
            );
          } catch (e) {
            console.error('解析用户输入数据失败:', e);
          }
        }
      }

      // 天气卡片
      if (data.toolCallName === 'get_weather_forecast' && data?.result) {
        return (
          <div slot={`${type}-${index}`} key={`weather-${index}`} className="content-card">
            <WeatherCard weather={JSON.parse(data.result)} />
          </div>
        );
      }

      // 行程规划卡片
      if (data.toolCallName === 'plan_itinerary' && data.result) {
        return (
          <div slot={`${type}-${index}`} key={`itinerary-${index}`} className="content-card">
            <ItineraryCard plan={JSON.parse(data.result)} />
          </div>
        );
      }

      // 酒店推荐卡片
      if (data.toolCallName === 'get_hotel_details' && data.result) {
        return (
          <div slot={`${type}-${index}`} key={`hotel-${index}`} className="content-card">
            <HotelCard hotels={JSON.parse(data.result)} />
          </div>
        );
      }
    }

    // 规划状态面板 - 不在消息中显示，只用于更新右侧面板
    if (item.type === 'planningState') {
      return null;
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
    // 重置规划状态
    setPlanningState(null);

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
    console.log('停止旅游规划');
    chatEngine.abortChat();
  };

  if (isLoadingHistory) {
    return (
      <div className="travel-planner-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <LoadingIcon size="large" />
          <span style={{ marginLeft: '8px' }}>加载历史消息中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="travel-planner-container">
      <div className="chat-content">
        <div className="chat-main">
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
            placeholder="请输入您的旅游需求，例如：请为我规划一个北京5日游行程"
            loading={senderLoading}
            onChange={inputChangeHandler}
            onSend={sendHandler}
            onStop={stopHandler}
          />
        </div>

        {/* 右侧规划状态面板 */}
        <div className="planning-sidebar">
          <PlanningStatePanel state={planningState} currentStep={currentStep} />
        </div>
      </div>
    </div>
  );
}
