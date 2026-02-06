import React, { useState, useRef, useMemo } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  isActivityContent,
  useChat,
  useAgentActivity,
  ActivityRenderer,
} from '@tdesign-react/chat';
import { Card, Space, Tag, Progress } from 'tdesign-react';
import { CheckCircleFilledIcon, TimeFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';
import type { ActivityComponentProps } from '@tdesign-react/chat';

/**
 * Activity 示例 - 规划步骤（Plan TodoList）
 *
 * 演示如何使用 Activity 事件展示动态规划步骤，支持：
 * 1. 标准模式：后端先发 ACTIVITY_SNAPSHOT，再发 ACTIVITY_DELTA
 * 2. 纯增量模式：后端只发 ACTIVITY_DELTA，无 SNAPSHOT（前端自动初始化）
 */

// ==================== Activity 组件定义 ====================

/**
 * 规划步骤内容类型
 */
interface PlanStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  description?: string;
}

interface PlanTodoContent {
  title: string;
  description?: string;
  steps: PlanStep[];
  status: 'loading' | 'active' | 'completed';
  currentStep?: number;
}

/**
 * 规划步骤 Activity 组件
 * 展示任务规划的步骤列表，支持实时更新状态
 */
const PlanTodoActivity: React.FC<ActivityComponentProps<PlanTodoContent>> = ({ content }) => {
  const { title, description, steps, status } = content;

  // 计算完成进度
  const completedCount = steps?.filter((s) => s.status === 'completed').length || 0;
  const totalCount = steps?.length || 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 获取步骤图标
  const getStepIcon = (stepStatus: PlanStep['status']) => {
    switch (stepStatus) {
      case 'completed':
        return <CheckCircleFilledIcon style={{ color: '#52c41a', fontSize: 18 }} />;
      case 'running':
        return <TimeFilledIcon style={{ color: '#1890ff', fontSize: 18 }} />;
      case 'failed':
        return <CloseCircleFilledIcon style={{ color: '#ff4d4f', fontSize: 18 }} />;
      default:
        return (
          <span
            style={{
              display: 'inline-block',
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: '2px solid #d9d9d9',
              background: '#fff',
            }}
          />
        );
    }
  };

  // 获取状态标签主题
  const getStatusTheme = () => {
    if (status === 'completed') return 'success';
    if (status === 'loading') return 'warning';
    return 'primary';
  };

  // 获取状态标签文本
  const getStatusText = () => {
    if (status === 'loading') return '规划中';
    if (status === 'completed') return '已完成';
    return '执行中';
  };

  // 获取步骤文字颜色
  const getStepColor = (stepStatus: PlanStep['status']) => {
    if (stepStatus === 'completed') return '#52c41a';
    if (stepStatus === 'failed') return '#ff4d4f';
    return '#333';
  };

  return (
    <Card bordered style={{ marginTop: 8, width: '100%' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 标题和状态 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>{title}</span>
          <Tag theme={getStatusTheme()}>{getStatusText()}</Tag>
        </div>

        {/* 描述 */}
        {description && <div style={{ fontSize: 13, color: '#666' }}>{description}</div>}

        {/* 进度条 */}
        <Progress
          percentage={progress}
          status={status === 'completed' ? 'success' : 'active'}
          label={
            <span style={{ fontSize: 12, color: '#666' }}>
              {completedCount}/{totalCount} 完成
            </span>
          }
        />

        {/* 步骤列表 */}
        <div style={{ marginTop: 8 }}>
          {steps?.map((step, index) => (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '8px 0',
                borderBottom: index < steps.length - 1 ? '1px solid #f0f0f0' : 'none',
                opacity: step.status === 'pending' ? 0.6 : 1,
              }}
            >
              <div style={{ marginRight: 12, marginTop: 2 }}>{getStepIcon(step.status)}</div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: step.status === 'running' ? 600 : 400,
                    color: getStepColor(step.status),
                    textDecoration: step.status === 'completed' ? 'line-through' : 'none',
                  }}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{step.description}</div>
                )}
              </div>
              {step.status === 'running' && (
                <Tag size="small" theme="primary" variant="light">
                  进行中
                </Tag>
              )}
            </div>
          ))}
        </div>
      </Space>
    </Card>
  );
};

// ==================== 第二个 Activity 组件定义 ====================

/**
 * 进度条内容类型
 */
interface TravelProgressContent {
  title: string;
  totalTasks: number;
  completedTasks: number;
  currentTask: string;
  percentage: number;
  status: 'preparing' | 'running' | 'completed';
}

/**
 * 行程规划进度 Activity 组件
 * 展示整体规划进度，与步骤列表组件同时显示
 */
const TravelProgressActivity: React.FC<ActivityComponentProps<TravelProgressContent>> = ({ content }) => {
  const { title, totalTasks, completedTasks, currentTask, percentage, status } = content;

  // 获取状态颜色
  const getStatusColor = () => {
    if (status === 'completed') return '#52c41a';
    if (status === 'running') return '#1890ff';
    return '#faad14';
  };

  // 获取状态文本
  const getStatusText = () => {
    if (status === 'completed') return '已完成';
    if (status === 'running') return '进行中';
    return '准备中';
  };

  // 获取状态标签主题
  const getStatusTheme = () => {
    if (status === 'completed') return 'success';
    if (status === 'running') return 'primary';
    return 'warning';
  };

  // 获取进度条状态
  const getProgressStatus = () => {
    if (status === 'completed') return 'success';
    if (status === 'running') return 'active';
    return 'warning';
  };

  return (
    <Card bordered style={{ marginTop: 8, width: '100%', background: '#fafafa' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 标题和状态 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#666' }}>{title}</span>
          <Tag theme={getStatusTheme()} variant="light">
            {getStatusText()}
          </Tag>
        </div>

        {/* 进度条 */}
        <Progress theme="plump" percentage={percentage} status={getProgressStatus()} color={getStatusColor()} />

        {/* 当前任务和统计 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#999' }}>{currentTask}</span>
          <span style={{ fontSize: 12, color: '#666' }}>
            {completedTasks}/{totalTasks} 任务
          </span>
        </div>
      </Space>
    </Card>
  );
};

// ==================== 主组件 ====================

const ActivityExample: React.FC = () => {
  const listRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>('帮我规划一次北京三日游');

  // 注册 Activity 组件
  useAgentActivity([
    {
      activityType: 'plan-todo',
      component: PlanTodoActivity as React.FC<ActivityComponentProps>,
      description: '规划步骤展示',
    },
    {
      activityType: 'travel-progress',
      component: TravelProgressActivity as React.FC<ActivityComponentProps>,
      description: '行程规划进度',
    },
  ]);

  // 聊天配置 - 根据模式切换 endpoint
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agui-activity',
      protocol: 'agui',
      stream: true,
      onRequest: (params) => ({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt,
          mode: 'standard',
        }),
      }),
    },
  });

  const senderLoading = useMemo(() => status === 'pending' || status === 'streaming', [status]);

  // 消息配置
  const messageProps = {
    user: {
      variant: 'base' as const,
      placement: 'right' as const,
    },
    assistant: {
      placement: 'left' as const,
    },
  };

  // 渲染消息内容
  const renderMessageContent = (item: any, index: number) => {
    if (isActivityContent(item)) {
      return (
        <div slot={`${item.type}-${index}`} key={`activity-${index}`}>
          <ActivityRenderer activity={item.data} />
        </div>
      );
    }

    return null;
  };

  const renderMsgContents = (message: any) => {
    if (Array.isArray(message.content)) {
      return <>{message.content.map((item: any, index: number) => renderMessageContent(item, index))}</>;
    }
    return null;
  };

  const sendHandler = async (e: any) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>示例说明：</div>
        <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
          演示多个不同 activityType 的 Activity 同时流式更新：
        </p>
        <ul style={{ margin: '8px 0', fontSize: '13px', color: '#666', paddingLeft: '20px' }}>
          <li>plan-todo: 规划步骤列表，逐步打钩完成</li>
          <li>travel-progress: 整体进度条，同步更新百分比</li>
        </ul>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
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
          placeholder="输入规划需求，例如：帮我规划一次北京三日游"
          loading={senderLoading}
          onChange={(e: any) => setInputValue(e.detail)}
          onSend={sendHandler}
          onStop={() => chatEngine.abortChat()}
        />
      </div>
    </Space>
  );
};

export default ActivityExample;
