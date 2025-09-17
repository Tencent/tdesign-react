import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { Button } from 'tdesign-react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  TdChatListApi,
  TdChatSenderApi,
  ChatActionBar,
  AGUIAdapter,
  isAIMessage,
  applyJsonPatch,
  getMessageContentForCopy,
} from '@tdesign-react/chat';
import type {
  TdChatMessageConfig,
  TdChatActionsName,
  TdChatSenderParams,
  ChatMessagesData,
  ChatRequestParams,
  ChatBaseContent,
  AIMessageContent,
  AGUIHistoryMessage,
} from '@tdesign-react/chat';
import { LoadingIcon, HistoryIcon } from 'tdesign-icons-react';
import { useChat } from '../hooks/useChat';
import {
  PlanningStatePanel,
  WeatherCard,
  ItineraryCard,
  HotelCard,
  HumanInputResult,
  HumanInputForm,
} from './components';
import type { FormConfig } from './components/HumanInputForm';
import './travel-planner.css';

// 扩展自定义消息体类型
declare module '@tdesign-react/chat' {
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

export default function TravelPlannerChat() {
  const listRef = useRef<TdChatListApi>(null);
  const inputRef = useRef<TdChatSenderApi>(null);
  const [inputValue, setInputValue] = useState<string>('请为我规划一个北京5日游行程');

  // 规划状态管理 - 用于右侧面板展示
  const [planningState, setPlanningState] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  // Human-in-the-Loop 状态管理
  const [userInputFormConfig, setUserInputFormConfig] = useState<FormConfig | null>(null);

  // 加载历史消息
  const [defaultMessages, setDefaultMessages] = useState<ChatMessagesData[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  // 创建聊天服务配置
  const createChatServiceConfig = () => ({
    // 对话服务地址 - 使用 POST 请求
    endpoint: `http://localhost:3000/sse/agui`,
    protocol: 'agui' as const,
    stream: true,
    // 流式对话结束
    onComplete: (isAborted: boolean, params?: RequestInit, parsed?: any) => {
      // 检查是否是等待用户输入的状态
      if (parsed?.result?.status === 'waiting_for_user_input') {
        console.log('检测到等待用户输入状态，保持消息为 streaming');
        // 返回一个空的更新来保持消息状态为 streaming
        return {
          status: 'streaming',
        };
      }
      if (parsed?.result?.status === 'user_aborted') {
        return {
          status: 'stop',
        };
      }
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
    onMessage: (chunk, message, parsedResult): AIMessageContent | undefined => {
      const { type, ...rest } = chunk.data;

      switch (type) {
        // ========== 步骤开始/结束事件处理 ==========
        case 'STEP_STARTED':
          setCurrentStep(rest.stepName);
          break;

        case 'STEP_FINISHED':
          setCurrentStep('');
          break;
        // ========== 工具调用事件处理 ==========
        case 'TOOL_CALL_ARGS':
          // 使用解析后的 ToolCall 数据
          if (parsedResult?.data?.toolCallName === 'get_travel_preferences') {
            const toolCall = parsedResult.data as any;
            if (toolCall.args) {
              try {
                const formConfig = JSON.parse(toolCall.args);
                setUserInputFormConfig(formConfig);
                console.log('成功解析表单配置:', formConfig);
              } catch (error) {
                console.log('JSON 不完整，继续等待...', toolCall.args);
              }
            }
          }
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
            return applyJsonPatch(prevState, rest.delta);
          });

          // 返回更新后的状态组件
          return {
            type: 'planningState',
            data: { state: planningState },
          } as any;
      }
    },
    // 自定义请求参数 - 使用 POST 请求
    onRequest: (innerParams: ChatRequestParams) => {
      const { prompt, toolCallMessage } = innerParams;
      const requestBody: any = {
        uid: 'travel_planner_uid',
        prompt,
        agentType: 'travel-planner',
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

  // 加载历史消息的函数
  const handleLoadHistory = async () => {
    if (hasLoadedHistory) return;

    setIsLoadingHistory(true);
    try {
      const messages = await loadHistoryMessages();
      setDefaultMessages(messages);
      setHasLoadedHistory(true);
    } catch (error) {
      console.error('加载历史消息失败:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const { chatEngine, messages, status } = useChat({
    defaultMessages,
    chatServiceConfig: createChatServiceConfig(),
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

  // 处理用户输入提交
  const handleUserInputSubmit = async (userData: any) => {
    try {
      // 1. 更新状态
      setUserInputFormConfig(null);

      // 2. 构造新的请求参数
      const tools = chatEngine.getToolcallByName('get_travel_preferences') || {};
      const newRequestParams: ChatRequestParams = {
        prompt: inputValue,
        toolCallMessage: {
          ...tools,
          result: JSON.stringify(userData),
        },
      };

      // 3. 直接调用 chatEngine.continueChat(params) 继续请求
      await chatEngine.continueChat(newRequestParams);
      listRef.current?.scrollList({ to: 'bottom' });
    } catch (error) {
      console.error('提交用户输入失败:', error);
      // 可以显示错误提示
    }
  };

  // 处理用户输入取消
  const handleUserInputCancel = async () => {
    await chatEngine.continueChat({
      prompt: inputValue,
      toolCallMessage: {
        ...chatEngine.getToolcallByName('get_travel_preferences'),
        result: 'user_cancel',
      },
    });
    await chatEngine.abortChat();
  };

  const renderMessageContent = ({ item, index }: MessageRendererProps): React.ReactNode => {
    if (item.type === 'toolcall') {
      const { data, type } = item;
      // Human-in-the-Loop 输入请求
      if (data.toolCallName === 'get_travel_preferences') {
        // 区分历史消息和实时交互
        if (data.result) {
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
        } else if (userInputFormConfig) {
          // 实时交互：使用状态中的表单配置
          return (
            <div slot={`${type}-${index}`} key={`human-input-form-${index}`} className="content-card">
              <HumanInputForm
                formConfig={userInputFormConfig}
                onSubmit={handleUserInputSubmit}
                onCancel={handleUserInputCancel}
              />
            </div>
          );
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
      {/* 顶部工具栏 */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e7e7e7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fafafa',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>旅游规划助手</h3>
        <Button
          theme="default"
          variant="outline"
          size="small"
          icon={<HistoryIcon />}
          loading={isLoadingHistory}
          disabled={hasLoadedHistory}
          onClick={handleLoadHistory}
        >
          {hasLoadedHistory ? '已加载历史' : '加载历史消息'}
        </Button>
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
          placeholder="请输入您的旅游需求，例如：请为我规划一个北京5日游行程"
          loading={senderLoading}
          onChange={inputChangeHandler}
          onSend={sendHandler}
          onStop={stopHandler}
        />
      </div>

      {/* 右下角固定规划状态面板 */}
      {planningState && (
        <div className="planning-panel-fixed">
          <PlanningStatePanel state={planningState} currentStep={currentStep} />
        </div>
      )}
    </div>
  );
}
