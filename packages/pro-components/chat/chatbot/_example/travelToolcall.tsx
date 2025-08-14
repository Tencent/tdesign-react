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
import { TdChatActionsName, TdChatSenderParams } from '@tencent/tdesign-webc-test';
import { LoadingIcon, HistoryIcon } from 'tdesign-icons-react';
import { Button } from 'tdesign-react';
import type { ChatMessagesData, ChatRequestParams, ChatBaseContent, AIMessageContent, ToolCall } from '../core/type';
import { AGUIAdapter, type AGUIHistoryMessage } from '../core/adapters/agui';
import { ToolCallRenderer, useAgentToolcall, useChat, useAgentState } from '../index';
import { PlanningStatePanel } from './components';
import './travel_v1.css';
import { getMessageContentForCopy } from '../core';
import { travelActions } from './travel-actions';

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

export default function TravelPlannerChat() {
  const listRef = useRef<TdChatListApi>(null);
  const inputRef = useRef<TdChatSenderApi>(null);
  const [inputValue, setInputValue] = useState<string>('请为我规划一个北京5日游行程');

  // 注册旅游相关的 Agent Toolcalls
  useAgentToolcall(travelActions);

  // 规划状态管理 - 用于右侧面板展示
  // 使用 useAgentState Hook 管理状态
  const { state: stateMap } = useAgentState();

  // 从状态映射中获取当前的规划状态
  const planningState = useMemo(() => {
    if (!stateMap || Object.keys(stateMap).length === 0) return null;
    // 获取最新的状态（通常是最后一个key对应的状态）
    const stateKeys = Object.keys(stateMap);
    const latestStateKey = stateKeys[stateKeys.length - 1];
    return stateMap[latestStateKey];
  }, [stateMap]);

  const [currentStep, setCurrentStep] = useState<string>('');

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
    onMessage: (chunk): AIMessageContent | undefined => {
      const { type, ...rest } = chunk.data;

      switch (type) {
        // ========== 步骤开始/结束事件处理 ==========
        case 'STEP_STARTED':
          setCurrentStep(rest.stepName);
          break;

        case 'STEP_FINISHED':
          setCurrentStep('');
          break;
        // ========== 状态管理事件处理 ==========
        case 'STATE_SNAPSHOT':
        case 'STATE_DELTA':
          // 状态管理现在由 useAgentState Hook 自动处理
          // 返回规划状态组件用于UI展示
          return {
            type: 'planningState',
            data: { state: planningState },
          } as any;
      }

      return undefined;
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
      console.log('加载历史消息:', messages);
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
    let filterToolcalls = ['replay', 'good', 'bad', 'copy'];
    if (!isLast) {
      filterToolcalls = filterToolcalls.filter((item) => item !== 'replay');
    }
    return filterToolcalls;
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

  // 处理工具调用响应
  const handleToolCallRespond = async (toolcall: ToolCall, response: any) => {
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
    // 重置规划状态
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
