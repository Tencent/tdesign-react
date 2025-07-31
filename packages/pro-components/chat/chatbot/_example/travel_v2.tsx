import React, { ReactNode, useMemo, useRef, useState } from 'react';
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
import { Card, Timeline, Tag, Divider, Button, Input, Select, Checkbox, Dialog } from 'tdesign-react';
import {
  CheckCircleFilledIcon,
  LocationIcon,
  CalendarIcon,
  CloudIcon,
  HomeIcon,
  InfoCircleIcon,
  LoadingIcon,
  TimeIcon,
  UserIcon,
} from 'tdesign-icons-react';

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

// 用户输入表单组件
const HumanInputForm = ({
  request,
  onSubmit,
  onCancel,
}: {
  request: any;
  onSubmit: (response: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 清除错误
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    request.fields.forEach((field: any) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label}是必填项`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="human-input-form" size="small">
      <div className="form-header">
        <UserIcon size="medium" />
        <span className="form-title">{request.title}</span>
      </div>
      <div className="form-description">{request.description}</div>

      <div className="form-fields">
        {request.fields.map((field: any) => (
          <div key={field.name} className="form-field">
            <label className="field-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>

            {field.type === 'number' && (
              <Input
                type="number"
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(value) => handleInputChange(field.name, value)}
                min={field.min}
                max={field.max}
                status={errors[field.name] ? 'error' : undefined}
                tips={errors[field.name]}
              />
            )}

            {field.type === 'select' && (
              <Select
                placeholder={`请选择${field.label}`}
                value={formData[field.name] || ''}
                onChange={(value) => handleInputChange(field.name, value)}
                status={errors[field.name] ? 'error' : undefined}
              >
                {field.options.map((option: any) => (
                  <Select.Option key={option.value} value={option.value} label={option.label} />
                ))}
              </Select>
            )}

            {field.type === 'multiselect' && (
              <div className="checkbox-group">
                {field.options.map((option: any) => (
                  <Checkbox
                    key={option.value}
                    value={option.value}
                    checked={formData[field.name]?.includes(option.value) || false}
                    onChange={(checked) => {
                      const currentValues = formData[field.name] || [];
                      const newValues = checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v: string) => v !== option.value);
                      handleInputChange(field.name, newValues);
                    }}
                  >
                    {option.label}
                  </Checkbox>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <Button theme="default" onClick={onCancel}>
          取消
        </Button>
        <Button theme="primary" onClick={handleSubmit}>
          确认
        </Button>
      </div>
    </Card>
  );
};

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
    { name: '收集偏好', key: 'preferences', completed: !!state.userPreferences },
    { name: '天气查询', key: 'weather', completed: !!itinerary?.weather },
    { name: '行程规划', key: 'plan', completed: !!itinerary?.plan },
    { name: '酒店推荐', key: 'hotels', completed: !!itinerary?.hotels },
  ];

  // 获取步骤状态
  const getStepStatus = (step: any) => {
    if (step.completed) return 'completed';
    if (
      currentStep === step.name ||
      (status === 'collecting_preferences' && step.key === 'preferences') ||
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

  const getStatusText = () => {
    if (status === 'finished') return '已完成';
    if (status === 'collecting_preferences') return '收集信息中';
    if (status === 'weather_querying') return '查询天气中';
    if (status === 'planning') return '规划中';
    if (status === 'hotel_recommending') return '推荐酒店中';
    return '准备中';
  };

  const getStatusTheme = () => {
    if (status === 'finished') return 'success';
    if (['collecting_preferences', 'weather_querying', 'planning', 'hotel_recommending'].includes(status))
      return 'primary';
    return 'default';
  };

  return (
    <Card className="planning-state-panel" size="small">
      <div className="panel-header">
        <LocationIcon size="medium" />
        <span className="panel-title">规划进度</span>
        <Tag theme={getStatusTheme()} size="small">
          {getStatusText()}
        </Tag>
      </div>
      <Divider />
      <div className="progress-steps">
        <Timeline mode="same" theme="dot">
          {allSteps.map((step) => (
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
            {state.userPreferences && (
              <div>
                • 出行信息: {state.userPreferences.travelers_count}人, {state.userPreferences.budget_range}预算
              </div>
            )}
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

  // Human-in-the-Loop 状态管理
  const [humanInputRequest, setHumanInputRequest] = useState<any>(null);
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [pendingToolCallId, setPendingToolCallId] = useState<string>('');

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    // 聊天服务配置
    chatServiceConfig: {
      // 对话服务地址 - 使用现有的服务
      endpoint: `http://localhost:3000/sse/agui`,
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

          // ========== 工具调用事件处理 ==========
          case 'TOOL_CALL_START':
            console.log('工具调用开始:', rest);
            if (rest.toolCallName === 'get_travel_preferences') {
              setPendingToolCallId(rest.toolCallId);
            }
            break;

          case 'TOOL_CALL_ARGS':
            console.log('工具调用参数:', rest);
            if (pendingToolCallId === rest.toolCallId) {
              // 累积工具调用参数，构建完整的请求对象
              try {
                // 这里需要累积所有的TOOL_CALL_ARGS事件来构建完整的请求
                // 简化处理：直接使用模拟数据
                const mockRequest = {
                  title: '出行信息收集',
                  description: '为了更好地为您规划行程，请提供以下信息：',
                  fields: [
                    {
                      name: 'travelers_count',
                      label: '出行人数',
                      type: 'number',
                      required: true,
                      placeholder: '请输入出行人数',
                      min: 1,
                      max: 20,
                    },
                    {
                      name: 'budget_range',
                      label: '预算范围',
                      type: 'select',
                      required: true,
                      options: [
                        { value: '经济', label: '经济型 (人均¥300-500/天)' },
                        { value: '中等', label: '中等 (人均¥500-1000/天)' },
                        { value: '豪华', label: '豪华型 (人均¥1000+/天)' },
                      ],
                    },
                    {
                      name: 'preferred_activities',
                      label: '偏好活动',
                      type: 'multiselect',
                      required: false,
                      options: [
                        { value: '文化景点', label: '文化景点' },
                        { value: '美食体验', label: '美食体验' },
                        { value: '购物娱乐', label: '购物娱乐' },
                        { value: '自然风光', label: '自然风光' },
                        { value: '历史古迹', label: '历史古迹' },
                      ],
                    },
                  ],
                };
                setHumanInputRequest(mockRequest);
                setShowInputDialog(true);
              } catch (error) {
                console.error('解析工具调用参数失败:', error);
              }
            }
            break;

          case 'TOOL_CALL_END':
            console.log('工具调用结束:', rest);
            break;

          case 'TOOL_CALL_RESULT':
            console.log('工具调用结果:', rest);
            if (rest.toolCallName === 'get_travel_preferences') {
              setShowInputDialog(false);
              setHumanInputRequest(null);
              setPendingToolCallId('');
            }
            break;

          // ========== 状态管理事件处理 ==========
          case 'STATE_SNAPSHOT':
            setPlanningState(rest.snapshot);
            return {
              type: 'planningState',
              data: { state: rest.snapshot },
            };

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
                  } else if (path === '/humanInputRequired') {
                    newState.humanInputRequired = value;
                  }
                } else if (op === 'add') {
                  // 简单的路径添加逻辑
                  if (path.startsWith('/itinerary/')) {
                    if (!newState.itinerary) newState.itinerary = {};
                    const key = path.split('/').pop();
                    newState.itinerary[key] = value;
                  } else if (path === '/userPreferences') {
                    newState.userPreferences = value;
                  }
                }
              });
              return newState;
            });

            // 返回更新后的状态组件
            return {
              type: 'planningState',
              data: { state: planningState },
            };
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
    },
  });

  const senderLoading = useMemo(() => status === 'pending' || status === 'streaming', [status]);

  // 处理用户输入提交
  const handleHumanInputSubmit = async (response: any) => {
    try {
      // 发送用户输入响应到服务器
      const result = await fetch('http://localhost:3000/api/human-input/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolCallId: pendingToolCallId,
          response,
        }),
      });

      if (result.ok) {
        console.log('用户输入已提交');
        setShowInputDialog(false);
        setHumanInputRequest(null);
        setPendingToolCallId('');
      }
    } catch (error) {
      console.error('提交用户输入失败:', error);
    }
  };

  // 处理用户输入取消
  const handleHumanInputCancel = () => {
    setShowInputDialog(false);
    setHumanInputRequest(null);
    setPendingToolCallId('');
  };

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

  console.log('messages', messages);
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
      {message.content?.map((item, index) => {
        if (item.type === 'toolcall') {
          const { data, type } = item;

          // Human-in-the-Loop 输入请求
          if (data.toolCallName === 'get_travel_preferences') {
            return (
              <div slot={`${type}-${index}`} key={`human-input-${index}`} className="content-card">
                <HumanInputForm
                  request={humanInputRequest}
                  onSubmit={handleHumanInputSubmit}
                  onCancel={handleHumanInputCancel}
                />
              </div>
            );
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

      {/* Human-in-the-Loop 输入对话框 */}
      <Dialog
        visible={showInputDialog}
        onClose={handleHumanInputCancel}
        header="出行信息收集"
        width="500px"
        confirmBtn="确认"
        cancelBtn="取消"
        onConfirm={() => {
          // 这里可以添加确认逻辑
        }}
      >
        {humanInputRequest && (
          <HumanInputForm
            request={humanInputRequest}
            onSubmit={handleHumanInputSubmit}
            onCancel={handleHumanInputCancel}
          />
        )}
      </Dialog>
    </div>
  );
}
