import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Card, Progress, Tag, Space, Input, Select } from 'tdesign-react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  TdChatListApi,
  TdChatSenderApi,
  ToolCallRenderer,
  useAgentToolcall,
  useChat,
  AgentStateProvider,
} from '@tdesign-react/chat';
import { CheckCircleFilledIcon, TimeFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-react';
import type {
  TdChatMessageConfig,
  TdChatSenderParams,
  ChatMessagesData,
  ChatRequestParams,
  ToolCall,
  ToolcallComponentProps,
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

// ==================== 工具组件 ====================

// 1. 天气查询组件（展示 TOOL_CALL 基础用法）
const WeatherCard: React.FC<ToolcallComponentProps<WeatherArgs, WeatherResult>> = ({
  status,
  args,
  result,
  error,
}) => {
  if (error) {
    return (
      <Card bordered style={{ marginTop: 8 }}>
        <div style={{ color: '#e34d59' }}>查询天气失败: {error.message}</div>
      </Card>
    );
  }

  return (
    <Card bordered style={{ marginTop: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        {args?.city} 天气信息
      </div>
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
const PlanningSteps: React.FC<ToolcallComponentProps<PlanningArgs>> = ({
  status,
  args,
  respond,
  agentState,
}) => {
  // 直接使用注入的 agentState，无需额外 Hook
  const planningState = agentState?.[args?.taskId] || {};
  const items = planningState?.items || [];

  const isComplete = status === 'complete';

  React.useEffect(() => {
    if (isComplete) {
      respond?.({ success: true });
    }
  }, [isComplete, respond]);

  const getStatusIcon = (itemStatus: string) => {
    switch (itemStatus) {
      case 'completed':
        return <CheckCircleFilledIcon style={{ color: '#00a870' }} />;
      case 'running':
        return <TimeFilledIcon style={{ color: '#0052d9' }} />;
      case 'failed':
        return <ErrorCircleFilledIcon style={{ color: '#e34d59' }} />;
      default:
        return <TimeFilledIcon style={{ color: '#bbbbbb' }} />;
    }
  };

  return (
    <Card bordered style={{ marginTop: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        正在为您规划 {args?.destination} {args?.days}日游
      </div>
      
      {/* 进度条 */}
      {planningState?.progress !== undefined && (
        <div style={{ marginBottom: 16 }}>
          <Progress percentage={planningState.progress} />
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            {planningState.message || '规划中...'}
          </div>
        </div>
      )}

      {/* 步骤列表 */}
      {items.length > 0 && (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {items.map((item: any, index: number) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {getStatusIcon(item.status)}
              <span style={{ flex: 1 }}>{item.label}</span>
              <Tag theme={item.status === 'completed' ? 'success' : 'default'} size="small">
                {item.status}
              </Tag>
            </div>
          ))}
        </Space>
      )}
    </Card>
  );
};

// 3. 用户偏好设置组件（展示 Human-in-the-Loop 交互）
const UserPreferencesForm: React.FC<ToolcallComponentProps<UserPreferencesArgs, any, UserPreferencesResponse>> = ({
  status,
  respond,
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

  if (status === 'complete') {
    return (
      <Card bordered style={{ marginTop: 8 }}>
        <div style={{ color: '#00a870' }}>✓ 已收到您的偏好设置</div>
      </Card>
    );
  }

  return (
    <Card bordered style={{ marginTop: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        请设置您的旅游偏好
      </div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <div style={{ marginBottom: 4, fontSize: 12 }}>预算（元）</div>
          <Input
            type="number"
            value={budget}
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

// ==================== 主组件 ====================
const TravelPlannerContent: React.FC = () => {
  const listRef = useRef<TdChatListApi>(null);
  const inputRef = useRef<TdChatSenderApi>(null);
  const [inputValue, setInputValue] = useState<string>('请为我规划一个北京3日游行程');

  // 注册工具配置（利用 agentState 注入）
  useAgentToolcall([
    {
      name: 'query_weather',
      description: '查询目的地天气',
      parameters: [{ name: 'city', type: 'string', required: true }],
      component: WeatherCard,
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
    },
    {
      name: 'collect_user_preferences',
      description: '收集用户偏好',
      parameters: [{ name: 'destination', type: 'string', required: true }],
      component: UserPreferencesForm as any,
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
  const messageProps: TdChatMessageConfig = {
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
      const tools = chatEngine.getToolcallByName(toolcall.toolCallName) || {};
      await chatEngine.sendAIMessage({
        params: {
          toolCallMessage: {
            ...tools,
            result: JSON.stringify(response),
          },
        },
        sendRequest: true,
      });
      listRef.current?.scrollList({ to: 'bottom' });
    },
    [chatEngine],
  );

  // 渲染消息内容
  const renderMessageContent = useCallback(
    (item: any, index: number) => {
      if (item.type === 'toolcall') {
        return (
          <div slot={`toolcall-${index}`} key={`toolcall-${index}`}>
            <ToolCallRenderer toolCall={item.data} onRespond={handleToolCallRespond} />
          </div>
        );
      }
      return null;
    },
    [handleToolCallRespond],
  );

  // 操作栏
  const actionHandler = (name: string) => {
    switch (name) {
      case 'replay':
        chatEngine.regenerateAIMessage();
        break;
      default:
        console.log('触发操作', name);
    }
  };

  const renderMsgContents = (message: ChatMessagesData) => (
    <>
      {message.content?.map((item: any, index: number) => renderMessageContent(item, index))}
    </>
  );

  const sendHandler = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  return (
    <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatList ref={listRef}>
          {messages.map((message, idx) => (
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
          onChange={(e: CustomEvent) => setInputValue(e.detail)}
          onSend={sendHandler}
          onStop={() => chatEngine.abortChat()}
        />
      </div>
    </div>
  );
};

// 使用 Provider 包裹
export default function TravelPlannerChat() {
  return (
    <AgentStateProvider initialState={{}}>
      <TravelPlannerContent />
    </AgentStateProvider>
  );
}
