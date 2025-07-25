import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  type TdChatMessageConfig,
  type ChatRequestParams,
  type ChatMessagesData,
  type AIMessageContent,
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
import { Card, Timeline, Tag, Divider } from 'tdesign-react';
import {
  CheckCircleFilledIcon,
  LocationIcon,
  CalendarIcon,
  CloudIcon,
  HomeIcon,
  InfoCircleIcon,
  LoadingIcon,
  TimeIcon,
} from 'tdesign-icons-react';

import './travel-planner.css';

// 扩展自定义消息体类型
declare module '@tdesign-react/aigc' {
  interface AIContentTypeOverrides {
    weather: ChatBaseContent<'weather', { weather: any[] }>;
    itinerary: ChatBaseContent<'itinerary', { plan: any[] }>;
    hotel: ChatBaseContent<'hotel', { hotels: any[] }>;
    planning_state: ChatBaseContent<'planning_state', { state: any }>;
  }
}

// 天气组件
const WeatherCard = ({ weather }: { weather: any[] }) => (
  <Card className="weather-card" size="small">
    <div className="weather-header">
      <CloudIcon size="medium" />
      <span className="weather-title">未来5天天气预报</span>
    </div>
    <div className="weather-list">
      {weather.map((day, index) => (
        <div key={index} className="weather-item">
          <span className="day">第{day.day}天</span>
          <span className="condition">{day.condition}</span>
          <span className="temp">
            {day.high}°/{day.low}°
          </span>
        </div>
      ))}
    </div>
  </Card>
);

// 行程规划组件
const ItineraryCard = ({ plan }: { plan: any[] }) => (
  <Card className="itinerary-card" size="small">
    <div className="itinerary-header">
      <CalendarIcon size="medium" />
      <span className="itinerary-title">行程安排</span>
    </div>
    <Timeline mode="same" theme="dot">
      {plan.map((dayPlan, index) => (
        <Timeline.Item
          key={index}
          label={`第${dayPlan.day}天`}
          dot={<CheckCircleFilledIcon size="small" color="#0052d9" />}
        >
          <div className="day-activities">
            {dayPlan.activities.map((activity: string, actIndex: number) => (
              <Tag key={actIndex} variant="light" className="activity-tag">
                {activity}
              </Tag>
            ))}
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  </Card>
);

// 酒店推荐组件
const HotelCard = ({ hotels }: { hotels: any[] }) => (
  <Card className="hotel-card" size="small">
    <div className="hotel-header">
      <HomeIcon size="medium" />
      <span className="hotel-title">酒店推荐</span>
    </div>
    <div className="hotel-list">
      {hotels.map((hotel, index) => (
        <div key={index} className="hotel-item">
          <div className="hotel-info">
            <span className="hotel-name">{hotel.name}</span>
            <div className="hotel-details">
              <Tag theme="success" variant="light">
                评分 {hotel.rating}
              </Tag>
              <span className="hotel-price">¥{hotel.price}/晚</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// 规划状态面板组件
const PlanningStatePanel = ({ state, currentStep }: { state: any; currentStep?: string }) => {
  if (!state) return null;

  const { itinerary, status } = state;

  // 定义步骤顺序和状态
  const allSteps = [
    { name: '天气查询', key: 'weather', completed: !!itinerary?.weather },
    { name: '行程规划', key: 'plan', completed: !!itinerary?.plan },
    { name: '酒店推荐', key: 'hotels', completed: !!itinerary?.hotels },
  ];

  // 获取步骤状态
  const getStepStatus = (step: any) => {
    if (step.completed) return 'completed';
    if (
      currentStep === step.name ||
      (status === 'weather_querying' && step.key === 'weather') ||
      (status === 'planning' && step.key === 'plan') ||
      (status === 'hotel_recommending' && step.key === 'hotels')
    ) {
      return 'running';
    }
    return 'pending';
  };

  // 获取步骤图标
  const getStepIcon = (step: any) => {
    const stepStatus = getStepStatus(step);

    switch (stepStatus) {
      case 'completed':
        return <CheckCircleFilledIcon size="medium" color="#00a870" />;
      case 'running':
        return <LoadingIcon size="medium" color="#0052d9" className="loading-spin" />;
      default:
        return <TimeIcon size="medium" color="#dcdcdc" />;
    }
  };

  // 获取步骤标签
  const getStepTag = (step: any) => {
    const stepStatus = getStepStatus(step);

    switch (stepStatus) {
      case 'completed':
        return (
          <Tag theme="success" size="small">
            已完成
          </Tag>
        );
      case 'running':
        return (
          <Tag theme="primary" size="small">
            进行中
          </Tag>
        );
      default:
        return (
          <Tag theme="default" size="small">
            等待中
          </Tag>
        );
    }
  };

  return (
    <Card className="planning-state-panel" size="small">
      <div className="panel-header">
        <LocationIcon size="medium" />
        <span className="panel-title">规划进度</span>
        <Tag theme={status === 'finished' ? 'success' : status === 'planning' ? 'primary' : 'default'} size="small">
          {status === 'finished' ? '已完成' : status === 'planning' ? '规划中' : '准备中'}
        </Tag>
      </div>
      <Divider />
      <div className="progress-steps">
        <Timeline mode="same" theme="dot">
          {allSteps.map((step, index) => (
            <Timeline.Item key={step.name} label="" dot={getStepIcon(step)}>
              <div className="step-item">
                <div className="step-title">{step.name}</div>
                {getStepTag(step)}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      {/* 显示最终结果摘要 */}
      {status === 'finished' && itinerary && (
        <div className="final-summary">
          <Divider />
          <div className="summary-header">
            <InfoCircleIcon size="small" />
            <span>规划摘要</span>
          </div>
          <div className="summary-content">
            {itinerary.weather && <div>• 天气信息: {itinerary.weather.length}天预报</div>}
            {itinerary.plan && <div>• 行程安排: {itinerary.plan.length}天计划</div>}
            {itinerary.hotels && <div>• 酒店推荐: {itinerary.hotels.length}个选择</div>}
          </div>
        </div>
      )}
    </Card>
  );
};

export default function TravelPlannerChat() {
  const listRef = useRef<TdChatListApi>(null);
  const inputRef = useRef<TdChatSenderApi>(null);
  const [inputValue, setInputValue] = useState<string>('请为我规划一个北京5日游行程');

  // 规划状态管理 - 用于右侧面板展示
  const [planningState, setPlanningState] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<string>('');

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    // 聊天服务配置
    chatServiceConfig: {
      // 对话服务地址 - 使用现有的服务
      endpoint: `http://127.0.0.1:3000/sse/agui`,
      protocol: 'agui',
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
      onMessage: (chunk): AIMessageContent => {
        const { type, ...rest } = chunk.data;

        console.log(`AG-UI事件: ${type}`, rest);

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

          // ========== 工具调用结果处理 ==========
          case 'TOOL_CALL_RESULT':
            // 根据工具类型返回不同的展示组件
            if (rest.toolCallName === 'get_weather_forecast') {
              try {
                const weatherData = JSON.parse(rest.content);
                return {
                  type: 'weather',
                  data: { weather: weatherData },
                };
              } catch (e) {
                console.error('解析天气数据失败:', e);
              }
            }

            if (rest.toolCallName === 'plan_itinerary') {
              try {
                const planData = JSON.parse(rest.content);
                return {
                  type: 'itinerary',
                  data: { plan: planData },
                };
              } catch (e) {
                console.error('解析行程数据失败:', e);
              }
            }

            if (rest.toolCallName === 'get_hotel_details') {
              try {
                const hotelData = JSON.parse(rest.content);
                return {
                  type: 'hotel',
                  data: { hotels: hotelData },
                };
              } catch (e) {
                console.error('解析酒店数据失败:', e);
              }
            }
            break;

          // ========== 状态管理事件处理 ==========
          case 'STATE_SNAPSHOT':
            console.log('状态快照:', rest.snapshot);
            setPlanningState(rest.snapshot);
            return {
              type: 'planning_state',
              data: { state: rest.snapshot },
            };

          case 'STATE_DELTA':
            console.log('状态变更:', rest.delta);
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
              type: 'planning_state',
              data: { state: planningState },
            };

          // 其他事件类型让内置处理器处理
          default:
            return null; // 返回null让内置处理器处理
        }

        return null;
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
    },
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

  /** 渲染消息内容体 */
  const renderMsgContents = (message: ChatMessagesData, isLast: boolean): ReactNode => (
    <>
      {message.content.map((item, index) => {
        // 天气卡片
        if (item.type === 'weather') {
          return (
            <div key={`weather-${index}`} className="content-card">
              <WeatherCard weather={item.data.weather} />
            </div>
          );
        }

        // 行程规划卡片
        if (item.type === 'itinerary') {
          return (
            <div key={`itinerary-${index}`} className="content-card">
              <ItineraryCard plan={item.data.plan} />
            </div>
          );
        }

        // 酒店推荐卡片
        if (item.type === 'hotel') {
          return (
            <div key={`hotel-${index}`} className="content-card">
              <HotelCard hotels={item.data.hotels} />
            </div>
          );
        }

        // 规划状态面板 - 不在消息中显示，只用于更新右侧面板
        if (item.type === 'planning_state') {
          return null;
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
