import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Card, Space, Input, Select, Tag } from 'tdesign-react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  ToolCallRenderer,
  useAgentToolcall,
  useAgentActivity,
  useChat,
  isToolCallContent,
  ActivityRenderer,
  isActivityContent,
} from '@tdesign-react/chat';
import { CheckCircleFilledIcon, LoadingIcon, StarFilledIcon, CloudIcon } from 'tdesign-icons-react';
import type {
  ChatMessagesData,
  ChatRequestParams,
  ToolCall,
  ToolcallComponentProps,
  ActivityComponentProps,
  AIMessageContent,
} from '@tdesign-react/chat';

// ==================== 类型定义 ====================

// Toolcall: 天气查询
interface WeatherArgs {
  city: string;
}

interface WeatherResult {
  temperature: number;
  condition: string;
  humidity: number;
}

// Toolcall: 用户偏好收集（Human-in-the-Loop 交互式）
interface UserPreferencesArgs {
  destination: string;
}

interface UserPreferencesResponse {
  budget: number;
  interests: string[];
  accommodation: string;
}

// Activity: 酒店推荐
interface HotelOption {
  id: string;
  name: string;
  price: number;
  rating: number;
  amenities: string[];
}

interface HotelBookingActivityContent {
  currentStep: 'searching' | 'results' | 'booked';
  hotels: HotelOption[];
  selectedHotel?: string;
  confirmation?: {
    hotelName: string;
    roomType: string;
    totalPrice: number;
  };
}

// ==================== 工具组件 ====================

/**
 * 1. 天气查询组件（非交互式 Toolcall）
 *
 * 展示 OpenClaw stream=tool 四阶段（start → args → result → end）
 */
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
    <Card bordered style={{ marginTop: 8, maxWidth: 360 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <CloudIcon style={{ fontSize: 18, color: '#0052d9' }} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          {args?.city || '...'} 天气
        </span>
        {status === 'executing' && (
          <Tag theme="primary" variant="light" size="small">
            <LoadingIcon style={{ fontSize: 12, marginRight: 4 }} />
            查询中
          </Tag>
        )}
        {status === 'complete' && (
          <Tag theme="success" variant="light" size="small">
            <CheckCircleFilledIcon style={{ fontSize: 12, marginRight: 4 }} />
            已完成
          </Tag>
        )}
      </div>

      {status === 'executing' && (
        <div style={{ color: '#888', fontSize: 12 }}>正在获取天气信息...</div>
      )}

      {status === 'complete' && result && (
        <Space direction="vertical" size="small">
          <div style={{ fontSize: 13 }}>🌡️ 温度: {result.temperature}°C</div>
          <div style={{ fontSize: 13 }}>☁️ 天气: {result.condition}</div>
          <div style={{ fontSize: 13 }}>💧 湿度: {result.humidity}%</div>
        </Space>
      )}
    </Card>
  );
};

/**
 * 2. 用户偏好设置组件（交互式 Toolcall / Human-in-the-Loop）
 *
 * 展示 OpenClaw stream=tool + node.invoke 双向交互：
 * - 后端通过 tool stream 推送表单
 * - 用户填写后通过 respond（桥接 node.invoke RPC）回传
 */
const UserPreferencesForm: React.FC<
  ToolcallComponentProps<UserPreferencesArgs, any, UserPreferencesResponse>
> = ({ status, args, respond, result }) => {
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

  // 已完成状态
  if (status === 'complete' && result) {
    return (
      <Card bordered style={{ marginTop: 8, maxWidth: 400 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#00a870' }}>
          ✓ 已收到您的偏好设置
        </div>
        <Space direction="vertical" size="small">
          <div style={{ fontSize: 12, color: '#666' }}>预算：¥{result.budget}</div>
          <div style={{ fontSize: 12, color: '#666' }}>兴趣：{result.interests?.join('、')}</div>
          <div style={{ fontSize: 12, color: '#666' }}>住宿：{result.accommodation}</div>
        </Space>
      </Card>
    );
  }

  return (
    <Card bordered style={{ marginTop: 8, maxWidth: 400 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        请设置 {args?.destination || ''} 旅游偏好
      </div>
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
              { label: '冒险', value: '冒险' },
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

// ==================== Activity 组件 ====================

/**
 * 3. 酒店推荐 Activity 组件
 *
 * 展示 OpenClaw stream=activity 的 snapshot + delta 增量更新：
 * - snapshot：初始搜索状态
 * - delta：逐步添加酒店结果 / 更新状态
 */
const HotelRecommendation: React.FC<ActivityComponentProps<HotelBookingActivityContent>> = ({
  content,
}) => {
  const { currentStep, hotels, confirmation } = content || {};

  // 预订成功
  if (currentStep === 'booked' && confirmation) {
    return (
      <Card bordered style={{ marginTop: 8, maxWidth: 480 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#00a870' }}>
          <CheckCircleFilledIcon style={{ marginRight: 4 }} />
          预订成功！
        </div>
        <Space direction="vertical" size="small">
          <div style={{ fontSize: 13 }}>🏨 酒店：{confirmation.hotelName}</div>
          <div style={{ fontSize: 13 }}>🛏️ 房型：{confirmation.roomType}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#e34d59' }}>
            💰 总价：¥{confirmation.totalPrice}
          </div>
        </Space>
      </Card>
    );
  }

  return (
    <Card bordered style={{ marginTop: 8, maxWidth: 480 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>🏨 为您推荐酒店</span>
        {currentStep === 'searching' && (
          <Tag theme="primary" variant="light" size="small">
            <LoadingIcon style={{ fontSize: 12, marginRight: 4 }} />
            搜索中
          </Tag>
        )}
        {currentStep === 'results' && hotels?.length > 0 && (
          <Tag theme="success" variant="light" size="small">
            找到 {hotels.length} 家
          </Tag>
        )}
      </div>

      {(!hotels || hotels.length === 0) && currentStep === 'searching' && (
        <div style={{ textAlign: 'center', padding: 20, color: '#888' }}>
          <LoadingIcon style={{ fontSize: 20 }} />
          <div style={{ marginTop: 8, fontSize: 12 }}>正在搜索酒店...</div>
        </div>
      )}

      {hotels && hotels.length > 0 && (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {hotels.map((hotel: HotelOption) => (
            <div
              key={hotel.id}
              style={{
                border: '1px solid #e7e7e7',
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{hotel.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 4 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarFilledIcon
                        key={i}
                        style={{
                          fontSize: 12,
                          color: i < hotel.rating ? '#faad14' : '#e7e7e7',
                        }}
                      />
                    ))}
                    <span style={{ fontSize: 11, color: '#666', marginLeft: 4 }}>{hotel.rating}分</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#888' }}>
                    {hotel.amenities?.slice(0, 3).join(' · ')}
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#e34d59' }}>
                  ¥{hotel.price}
                  <span style={{ fontSize: 11, fontWeight: 400, color: '#999' }}>/晚</span>
                </div>
              </div>
            </div>
          ))}
        </Space>
      )}
    </Card>
  );
};

// ==================== 主组件 ====================

/**
 * OpenClaw 协议 - Toolcall + Activity 综合示例
 *
 * 学习目标：
 * - Toolcall：通过 stream=tool 实现工具调用四阶段（start/args/result/end）
 * - Activity：通过 stream=activity 实现 snapshot + delta 增量 UI
 * - 双向 Action：通过 node.invoke RPC 支持 Human-in-the-Loop 交互
 * - 完整演示：文本 + Toolcall + Activity 混合流
 *
 * 关键字触发说明（Mock Server 根据用户消息分发不同流式模式）：
 * - 输入包含 "交互" / "互动" / "偏好"：触发交互式 Toolcall 演示（Human-in-the-Loop）
 *   → 天气查询 + 用户偏好表单 → 用户填写提交 → 服务端接收后继续推送酒店推荐
 * - 输入包含 "tool" / "工具" / "天气"：触发非交互式 Toolcall 演示
 * - 输入包含 "activity" / "酒店"：触发 Activity 演示
 * - 输入包含 "full" / "完整" / "全部"：触发完整演示（文本 + Tool + Activity）
 * - 其他输入：普通文本对话
 *
 * 注意：需要启动 Mock Server：cd mock-server/online2 && node app.js
 */
export default function OpenClawToolcallActivity() {
  const listRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState('帮我做个交互式旅行规划');

  // 注册 Toolcall 组件
  useAgentToolcall([
    {
      name: 'get_weather',
      description: '查询城市天气',
      parameters: [{ name: 'city', type: 'string', required: true }],
      component: WeatherCard as any,
    },
    {
      name: 'collect_preferences',
      description: '收集用户旅游偏好',
      parameters: [{ name: 'destination', type: 'string', required: true }],
      component: UserPreferencesForm as any,
    },
  ]);

  // 注册 Activity 组件
  useAgentActivity([
    {
      activityType: 'hotel-recommendation',
      component: HotelRecommendation,
      description: '酒店推荐列表',
    },
  ]);

  // 聊天配置 - 使用 OpenClaw WebSocket 协议
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'ws://127.0.0.1:18789',
      protocol: 'openclaw',
      stream: true,

      // OpenClaw 专属配置
      openclaw: {
        heartbeatInterval: 30000,
        client: {
          id: 'tdesign-openclaw-demo',
          version: '1.0.0',
          mode: 'webchat',
        },
      },

      // 通过 onRequest 传入业务参数
      onRequest: (params: ChatRequestParams) => ({
        sessionKey: 'demo-toolcall-activity',
        message: params.prompt,
        // 透传 toolCallMessage（交互式 Toolcall 用户回传时携带）
        ...(params.toolCallMessage ? { toolCallMessage: params.toolCallMessage } : {}),
      }),

      // 生命周期回调
      onStart: (chunk) => {
        console.log('[OpenClaw] Stream started:', chunk);
      },
      onComplete: (aborted, params) => {
        console.log('[OpenClaw] Stream completed:', { aborted, params });
      },
      onError: (err) => {
        console.error('[OpenClaw] Error:', err);
      },
    },
  });

  const senderLoading = useMemo(
    () => status === 'pending' || status === 'streaming',
    [status],
  );

  // 消息配置
  const messageProps: Record<string, any> = {
    user: { variant: 'base', placement: 'right' },
    assistant: { placement: 'left' },
  };

  // 处理 Toolcall 响应（Human-in-the-Loop）
  const handleToolCallRespond = useCallback(
    async (toolcall: ToolCall, response: any) => {
      console.log('[OpenClaw] Toolcall respond:', toolcall.toolCallName, response);

      // 对于交互式 toolcall（如 collect_preferences），
      // 将用户响应通过 sendAIMessage 传递给后端
      if (toolcall.toolCallName === 'collect_preferences') {
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
      // 渲染 Toolcall 组件
      if (isToolCallContent(item)) {
        return (
          <div slot={`${item.type}-${index}`} key={`toolcall-${index}`}>
            <ToolCallRenderer toolCall={item.data} onRespond={handleToolCallRespond} />
          </div>
        );
      }

      // 渲染 Activity 组件
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
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* 提示信息 */}
      <div
        style={{
          padding: '8px 12px',
          background: '#f0f5ff',
          borderBottom: '1px solid #d4e3fc',
          fontSize: 12,
          color: '#0052d9',
        }}
      >
        💡 输入提示：<strong>交互/互动/偏好</strong> → 🌟 交互式 Toolcall 演示（Human-in-the-Loop）|{' '}
        <strong>天气/tool</strong> → Toolcall |{' '}
        <strong>酒店/activity</strong> → Activity |{' '}
        <strong>完整/full</strong> → 全部
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <ChatList ref={listRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} {...messageProps[message.role]} message={message}>
              {renderMsgContents(message)}
            </ChatMessage>
          ))}
        </ChatList>

        <ChatSender
          value={inputValue}
          placeholder="请输入内容（需启动 Mock Server: cd mock-server/online2 && node app.js）"
          loading={senderLoading}
          onChange={(e: any) => setInputValue(e.detail)}
          onSend={sendHandler}
          onStop={() => chatEngine.abortChat()}
        />
      </div>
    </div>
  );
}
