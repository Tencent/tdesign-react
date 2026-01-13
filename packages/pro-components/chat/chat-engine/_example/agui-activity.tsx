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
import { Card, Space, Tag } from 'tdesign-react';
import { CheckCircleFilledIcon, TimeFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';
import type { ActivityComponentProps } from '@tdesign-react/chat';

/**
 * Activity 示例 - 规划步骤（Plan TodoList）
 * 
 * 演示如何使用 Activity 事件展示动态规划步骤：
 * 1. 后端通过 ACTIVITY_SNAPSHOT 初始化规划步骤列表
 * 2. 通过 ACTIVITY_DELTA 逐步更新每个步骤的完成状态
 * 3. 前端实时展示步骤进度，逐个打钩完成
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
  const completedCount = steps?.filter(s => s.status === 'completed').length || 0;
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
          <Tag theme={getStatusTheme()}>
            {getStatusText()}
          </Tag>
        </div>

        {/* 描述 */}
        {description && (
          <div style={{ fontSize: 13, color: '#666' }}>{description}</div>
        )}

        {/* 进度条 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3 }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: status === 'completed' ? '#52c41a' : '#1890ff',
                borderRadius: 3,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <span style={{ fontSize: 12, color: '#666', minWidth: 60 }}>
            {completedCount}/{totalCount} 完成
          </span>
        </div>

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
              <div style={{ marginRight: 12, marginTop: 2 }}>
                {getStepIcon(step.status)}
              </div>
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
                  <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                    {step.description}
                  </div>
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
  ]);

  // 历史消息（包含已完成的规划 Activity）
  const defaultMessages = useMemo(
    () =>
      [
        {
          id: 'history-1',
          role: 'user' as const,
          content: '帮我规划一次周末读书计划',
          timestamp: Date.now() - 300000,
        },
        {
          id: 'history-2',
          role: 'assistant' as const,
          content: '好的，我来帮您规划周末读书计划：',
          timestamp: Date.now() - 290000,
        },
        {
          id: 'history-3',
          role: 'assistant' as const,
          content: [
            {
              type: 'activity' as const,
              data: {
                activityType: 'plan-todo',
                messageId: 'history_plan_1',
                content: {
                  title: '周末读书计划',
                  description: '两天完成一本书的阅读',
                  status: 'completed',
                  steps: [
                    { id: '1', label: '选择要阅读的书籍', status: 'completed', description: '根据兴趣选择一本书' },
                    { id: '2', label: '准备阅读环境', status: 'completed', description: '找一个安静舒适的地方' },
                    { id: '3', label: '阅读前半部分', status: 'completed', description: '周六完成1-5章' },
                    { id: '4', label: '阅读后半部分', status: 'completed', description: '周日完成6-10章' },
                    { id: '5', label: '整理读书笔记', status: 'completed', description: '记录关键观点和感想' },
                  ],
                },
              },
            },
          ],
          timestamp: Date.now() - 280000,
        },
      ] as any[],
    [],
  );

  // 聊天配置
  const { chatEngine, messages, status } = useChat({
    defaultMessages,
    chatServiceConfig: {
      endpoint: 'http://localhost:9000/sse/agui-activity',
      protocol: 'agui',
      stream: true,
      onRequest: (params) => ({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt,
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>示例说明：</div>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#666' }}>
          演示 Activity 事件的流式更新：先列出规划步骤，然后逐步打钩完成
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatList ref={listRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} {...messageProps[message.role]} message={message}>
              {renderMsgContents(message)}
            </ChatMessage>
          ))}
        </ChatList>

        <div style={{ padding: '16px', borderTop: '1px solid #e8e8e8' }}>
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
      </div>
    </div>
  );
};

export default ActivityExample;
