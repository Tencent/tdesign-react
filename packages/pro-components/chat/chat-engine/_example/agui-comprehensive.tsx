import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Card, Progress, Tag, Space, Input, Select } from 'tdesign-react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  ToolCallRenderer,
  useAgentToolcall,
  useAgentActivity,
  useChat,
  useAgentState,
  isToolCallContent,
  ActivityRenderer,
  isActivityContent,
} from '@tdesign-react/chat';
import {
  CheckCircleFilledIcon,
  TimeFilledIcon,
  ErrorCircleFilledIcon,
  LoadingIcon,
  StarFilledIcon,
} from 'tdesign-icons-react';
import type {
  ChatMessagesData,
  ChatRequestParams,
  ToolCall,
  ToolcallComponentProps,
  ActivityComponentProps,
  AIMessageContent,
} from '@tdesign-react/chat';

// ==================== 类型定义 ====================
interface WeatherArgs {
  city: string;
}

interface WeatherResult {
  temperature: string;
  condition: string;
  humidity: string;
}

interface PlanningArgs {
  destination: string;
  days: number;
  taskId: string;
}

interface UserPreferencesArgs {
  destination: string;
}

interface UserPreferencesResponse {
  budget: number;
  interests: string[];
  accommodation: string;
}

// Activity 相关类型
interface HotelOption {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
}

interface BookingConfirmation {
  hotelId: string;
  roomType: string;
  totalPrice: number;
}

// ==================== 工具组件 ====================

// 1. 天气查询组件（展示 TOOL_CALL 基础用法）
const WeatherCard: React.FC<ToolcallComponentProps<WeatherArgs, WeatherResult>> = ({ status, args, result, error }) => {
  if (error) {
    return (
      <Card bordered style={{ marginTop: 8 }}>
        <div style={{ color: '#e34d59' }}>查询天气失败: {error.message}</div>
      </Card>
    );
  }

  return (
    <Card bordered style={{ marginTop: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{args?.city} 天气信息</div>
      {status === 'executing' && <div style={{ color: '#0052d9' }}>正在查询天气...</div>}
      {status === 'complete' && result && (
        <Space direction="vertical" size="small">
          <div>🌡️ 温度: {result.temperature}</div>
          <div>☁️ 天气: {result.condition}</div>
          <div>💧 湿度: {result.humidity}</div>
        </Space>
      )}
    </Card>
  );
};

// 2. 规划步骤组件（展示 STATE 订阅 + agentState 注入）
const PlanningSteps: React.FC<ToolcallComponentProps<PlanningArgs>> = ({ status, args, respond, agentState }) => {
  // 因为配置了 subscribeKey，agentState 已经是 taskId 对应的状态对象
  const planningState = agentState || {};

  const isComplete = status === 'complete';

  React.useEffect(() => {
    if (isComplete) {
      respond?.({ success: true });
    }
  }, [isComplete, respond]);

  return (
    <Card bordered style={{ marginTop: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        正在为您规划 {args?.destination} {args?.days}日游
      </div>

      {/* 只保留进度条 */}
      {planningState?.progress !== undefined && (
        <div>
          <Progress percentage={planningState.progress} />
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{planningState.message || '规划中...'}</div>
        </div>
      )}
    </Card>
  );
};

// 3. 用户偏好设置组件（展示 Human-in-the-Loop 交互）
const UserPreferencesForm: React.FC<ToolcallComponentProps<UserPreferencesArgs, any, UserPreferencesResponse>> = ({
  status,
  respond,
  result,
}) => {
  const [budget, setBudget] = useState(5000);
  const [interests, setInterests] = useState<string[]>(['美食', '文化']);
  const [accommodation, setAccommodation] = useState('经济型');

  const handleSubmit = () => {
    respond?.({
      budget,
      interests,
      accommodation,
    });
  };

  if (status === 'complete' && result) {
    return (
      <Card bordered style={{ marginTop: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#00a870' }}>✓ 已收到您的偏好设置</div>
        <Space direction="vertical" size="small">
          <div style={{ fontSize: 12, color: '#666' }}>预算：¥{result.budget}</div>
          <div style={{ fontSize: 12, color: '#666' }}>兴趣：{result.interests.join('、')}</div>
          <div style={{ fontSize: 12, color: '#666' }}>住宿：{result.accommodation}</div>
        </Space>
      </Card>
    );
  }

  return (
    <Card bordered style={{ marginTop: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>请设置您的旅游偏好</div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <div style={{ marginBottom: 4, fontSize: 12 }}>预算（元）</div>
          <Input
            type="number"
            value={String(budget)}
            onChange={(value: string | number) => setBudget(Number(value))}
            placeholder="请输入预算"
          />
        </div>
        <div>
          <div style={{ marginBottom: 4, fontSize: 12 }}>兴趣爱好</div>
          <Select
            multiple
            value={interests}
            onChange={(value: string | string[]) => setInterests(value as string[])}
            options={[
              { label: '美食', value: '美食' },
              { label: '文化', value: '文化' },
              { label: '自然', value: '自然' },
              { label: '购物', value: '购物' },
            ]}
          />
        </div>
        <div>
          <div style={{ marginBottom: 4, fontSize: 12 }}>住宿类型</div>
          <Select
            value={accommodation}
            onChange={(value: string | string[]) => setAccommodation(value as string)}
            options={[
              { label: '经济型', value: '经济型' },
              { label: '舒适型', value: '舒适型' },
              { label: '豪华型', value: '豪华型' },
            ]}
          />
        </div>
        <Button theme="primary" block onClick={handleSubmit}>
          确认提交
        </Button>
      </Space>
    </Card>
  );
};

// 4. 酒店预订 Activity 组件（展示 Activity 多步骤交互流程）
interface HotelBookingActivityContent {
  currentStep: 'search' | 'select_room' | 'confirm';
  hotels: HotelOption[];
  confirmation?: BookingConfirmation;
}

interface HotelBookingActivityProps extends ActivityComponentProps<HotelBookingActivityContent> {
  onAction?: (action: { type: string; data: any }) => void;
}

const HotelBookingActivity: React.FC<HotelBookingActivityProps> = ({ content }) => {
  // 从 content 获取当前步骤和数据
  const { currentStep, hotels, confirmation } = content;

  // 渲染酒店卡片（纯展示，无交互）
  const renderHotelCard = (hotel: HotelOption) => (
    <div
      key={hotel.id}
      style={{
        marginBottom: 12,
        border: '1px solid #e7e7e7',
        borderRadius: 8,
        padding: 12,
      }}
    >
      <div style={{ display: 'flex', gap: 12 }}>
        <img
          src={hotel.image}
          alt={hotel.name}
          style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 4 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{hotel.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <StarFilledIcon
                key={i}
                style={{
                  fontSize: 12,
                  color: i < hotel.rating ? '#faad14' : '#e7e7e7',
                }}
              />
            ))}
            <span style={{ fontSize: 12, color: '#666', marginLeft: 4 }}>{hotel.rating}分</span>
          </div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{hotel.amenities.slice(0, 3).join(' • ')}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#e34d59' }}>¥{hotel.price}/晚</div>
        </div>
      </div>
    </div>
  );

  if (currentStep === 'confirm' && confirmation) {
    return (
      <Card bordered style={{ marginTop: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#00a870' }}>✓ 预订成功！</div>
        <Space direction="vertical" size="small">
          <div style={{ fontSize: 12, color: '#666' }}>房型：{confirmation.roomType}</div>
          <div style={{ fontSize: 12, color: '#666' }}>总价：¥{confirmation.totalPrice}</div>
        </Space>
      </Card>
    );
  }

  return (
    <Card bordered style={{ marginTop: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🏨 为您推荐酒店</div>

      {currentStep === 'search' && (
        <div>
          {hotels.length > 0 ? (
            <div>{hotels.map((hotel: HotelOption) => renderHotelCard(hotel))}</div>
          ) : (
            <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>
              <LoadingIcon style={{ fontSize: 16, marginRight: 8 }} />
              正在搜索酒店...
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

// ==================== 外部进度面板组件 ====================

/**
 * 右侧进度面板组件
 * 演示如何在对话组件外部使用 useAgentState 获取状态
 *
 * 💡 使用场景：展示规划行程的详细子步骤（从后端 STATE_DELTA 事件推送）
 *
 * 实现方式：
 * 1. 使用 useAgentState 订阅状态更新
 * 2. 从 stateMap 中获取规划步骤的详细进度
 */
const ProgressPanel: React.FC = () => {
  // 使用 useAgentState 订阅状态更新
  const { stateMap, currentStateKey } = useAgentState();

  // 获取规划状态
  const planningState = useMemo(() => {
    if (!currentStateKey || !stateMap[currentStateKey]) {
      return null;
    }
    return stateMap[currentStateKey];
  }, [stateMap, currentStateKey]);

  // 如果没有规划状态，不显示面板
  if (!planningState || !planningState.items || planningState.items.length === 0) {
    return null;
  }

  const items = planningState.items || [];
  const completedCount = items.filter((item: any) => item.status === 'completed').length;
  const totalCount = items.length;

  // 如果所有步骤都完成了，隐藏面板
  if (completedCount === totalCount && totalCount > 0) {
    return null;
  }

  const getStatusIcon = (itemStatus: string) => {
    switch (itemStatus) {
      case 'completed':
        return <CheckCircleFilledIcon style={{ color: '#00a870', fontSize: '14px' }} />;
      case 'running':
        return <LoadingIcon style={{ color: '#0052d9', fontSize: '14px' }} />;
      case 'failed':
        return <ErrorCircleFilledIcon style={{ color: '#e34d59', fontSize: '14px' }} />;
      default:
        return <TimeFilledIcon style={{ color: '#bbbbbb', fontSize: '14px' }} />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '200px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '200px',
        background: '#fff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e7e7e7',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid #e7e7e7',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#000', marginBottom: '4px' }}>规划进度</div>
        <Tag theme="primary" variant="light" size="small">
          {completedCount}/{totalCount}
        </Tag>
      </div>

      {/* 步骤列表 */}
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {items.map((item: any, index: number) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {getStatusIcon(item.status)}
            <span
              style={{
                flex: 1,
                fontSize: '12px',
                // eslint-disable-next-line no-nested-ternary
                color: item.status === 'completed' ? '#00a870' : item.status === 'running' ? '#0052d9' : '#666',
                fontWeight: item.status === 'running' ? 600 : 400,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </Space>
    </div>
  );
};

// ==================== 主组件 ====================
const TravelPlannerContent: React.FC = () => {
  const listRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>('请为我规划一个北京3日游行程');

  // 注册工具配置
  useAgentToolcall([
    {
      name: 'query_weather',
      description: '查询目的地天气',
      parameters: [{ name: 'city', type: 'string', required: true }],
      component: WeatherCard as any,
    },
    {
      name: 'collect_user_preferences',
      description: '收集用户偏好',
      parameters: [{ name: 'destination', type: 'string', required: true }],
      component: UserPreferencesForm as any,
    },
    {
      name: 'show_planning_steps',
      description: '展示规划步骤',
      parameters: [
        { name: 'destination', type: 'string', required: true },
        { name: 'days', type: 'number', required: true },
        { name: 'taskId', type: 'string', required: true },
      ],
      component: PlanningSteps as any,
      // 配置 subscribeKey，让组件订阅对应 taskId 的状态
      subscribeKey: (props: any) => props.args?.taskId,
    },
  ]);

  // 注册 Activity 组件
  useAgentActivity([
    {
      activityType: 'hotel-booking',
      component: HotelBookingActivity,
      description: '酒店预订流程',
    },
  ]);

  // 聊天配置
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/travel-planner',
      protocol: 'agui',
      stream: true,
      onRequest: (params: ChatRequestParams) => ({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt,
          toolCallMessage: params.toolCallMessage,
        }),
      }),
    },
  });

  const senderLoading = useMemo(() => status === 'pending' || status === 'streaming', [status]);

  // 消息配置
  const messageProps: any = {
    user: {
      variant: 'base',
      placement: 'right',
    },
    assistant: {
      placement: 'left',
    },
  };

  // 处理工具调用响应
  const handleToolCallRespond = useCallback(
    async (toolcall: ToolCall, response: any) => {
      // 判断如果是手机用户偏好的响应，则使用 toolcall 中的信息来构建新的请求
      if (toolcall.toolCallName === 'collect_user_preferences') {
        await chatEngine.sendAIMessage({
          params: {
            toolCallMessage: {
              toolCallId: toolcall.toolCallId,
              toolCallName: toolcall.toolCallName,
              result: JSON.stringify(response),
            },
          },
          sendRequest: true,
        });
        listRef.current?.scrollList({ to: 'bottom' });
      }
    },
    [chatEngine],
  );

  // 渲染消息内容
  const renderMessageContent = useCallback(
    (item: AIMessageContent, index: number) => {
      // 处理工具调用
      if (isToolCallContent(item)) {
        return (
          <div slot={`${item.type}-${index}`} key={`toolcall-${index}`}>
            <ToolCallRenderer toolCall={item.data} onRespond={handleToolCallRespond} />
          </div>
        );
      }

      // 处理 Activity
      if (isActivityContent(item)) {
        return (
          <div slot={`${item.type}-${index}`} key={`activity-${index}`}>
            <ActivityRenderer activity={item.data} />
          </div>
        );
      }

      return null;
    },
    [handleToolCallRespond],
  );

  const renderMsgContents = (message: ChatMessagesData) => (
    <>{message.content?.map((item: any, index: number) => renderMessageContent(item, index))}</>
  );

  const sendHandler = async (e: any) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* 右侧进度面板：使用 useAgentState 订阅状态 */}
      <ProgressPanel />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatList ref={listRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} {...messageProps[message.role]} message={message}>
              {renderMsgContents(message)}
            </ChatMessage>
          ))}
        </ChatList>
        <ChatSender
          ref={inputRef}
          value={inputValue}
          placeholder="请输入您的旅游需求，例如：请为我规划一个北京3日游行程"
          loading={senderLoading}
          onChange={(e: any) => setInputValue(e.detail)}
          onSend={sendHandler}
          onStop={() => chatEngine.abortChat()}
        />
      </div>
    </div>
  );
};

// 导出主组件（不需要 Provider，因为 useAgentState 内部已处理）
export default TravelPlannerContent;
