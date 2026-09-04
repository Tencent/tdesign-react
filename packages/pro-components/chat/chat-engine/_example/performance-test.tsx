import React, { useRef } from 'react';
import { ChatList, ChatMessage, isActivityContent, useChat, useAgentActivity, ActivityRenderer } from '@tdesign-react/chat';
import { Button, Card, Space, Tag, Progress } from 'tdesign-react';
import type { ActivityComponentProps } from '@tdesign-react/chat';

/**
 * 性能测试 Demo
 *
 * 验证核心优化效果：
 * - 场景 1：并发 + 隔离性验证
 *   - A/B/C 持续更新
 *   - D 更新几次后停止
 *   - E 仅初始化，不接收任何 delta（完全隔离）
 * - 场景 2：微任务批量合并验证
 *
 * 使用方法：
 * 1. 启动 mock server: cd mock-server/online2 && node app.js
 * 2. 打开 React DevTools Profiler
 * 3. 点击 Start Recording
 * 4. 点击测试按钮
 * 5. 停止 Recording 查看结果
 */

const MOCK_SERVER_BASE = 'http://localhost:9001';

// ==================== Activity 组件 ====================

interface ComponentContent {
  id: string;
  label: string;
  value: number;
}

// 组件 A - 蓝色进度条（持续更新）
const ComponentA: React.FC<ActivityComponentProps<ComponentContent>> = ({ content }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <Card bordered size="small" style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Tag theme="primary">{content.label}</Tag>
        <Progress style={{ flex: 1 }} percentage={Math.min(content.value, 100)} size="small" />
        <Tag size="small" variant="outline">
          render: {renderCount.current}
        </Tag>
      </div>
    </Card>
  );
};

// 组件 B - 橙色进度条（持续更新）
const ComponentB: React.FC<ActivityComponentProps<ComponentContent>> = ({ content }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <Card bordered size="small" style={{ marginTop: 8, background: '#fff7e6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Tag theme="warning">{content.label}</Tag>
        <Progress style={{ flex: 1 }} percentage={Math.min(content.value, 100)} size="small" status="warning" />
        <Tag size="small" variant="outline">
          render: {renderCount.current}
        </Tag>
      </div>
    </Card>
  );
};

// 组件 C - 红色进度条（持续更新）
const ComponentC: React.FC<ActivityComponentProps<ComponentContent>> = ({ content }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <Card bordered size="small" style={{ marginTop: 8, background: '#fff1f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Tag theme="danger">{content.label}</Tag>
        <Progress style={{ flex: 1 }} percentage={Math.min(content.value, 100)} size="small" status="error" />
        <Tag size="small" variant="outline">
          render: {renderCount.current}
        </Tag>
      </div>
    </Card>
  );
};

// 组件 D - 绿色计数器（更新几次后停止）
const ComponentD: React.FC<ActivityComponentProps<ComponentContent>> = ({ content }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <Card bordered size="small" style={{ marginTop: 8, background: '#f6ffed' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Tag theme="success">{content.label}</Tag>
        <Progress style={{ flex: 1 }} percentage={Math.min(content.value, 100)} size="small" status="success" />
        <span style={{ fontSize: 12, color: '#999' }}>（更新后停止）</span>
        <Tag size="small" variant="outline">
          render: {renderCount.current}
        </Tag>
      </div>
    </Card>
  );
};

// 组件 E - 粉色计数器（完全隔离，仅初始化）
const ComponentE: React.FC<ActivityComponentProps<ComponentContent>> = ({ content }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <Card bordered size="small" style={{ marginTop: 8, background: '#fff0f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Tag style={{ background: '#eb2f96', color: '#fff' }}>{content.label}</Tag>
        <span style={{ fontSize: 20, fontWeight: 600, color: '#eb2f96' }}>{content.value}</span>
        <span style={{ fontSize: 12, color: '#999' }}>（完全隔离，预期 render=1）</span>
        <Tag size="small" theme={renderCount.current > 1 ? 'danger' : 'success'}>
          render: {renderCount.current}
        </Tag>
      </div>
    </Card>
  );
};

// 场景 2：批量合并测试组件
interface BatchMergeContent {
  id: string;
  label: string;
  count: number;
  batch: number;
}

const BatchMergeActivity: React.FC<ActivityComponentProps<BatchMergeContent>> = ({ content }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <Card bordered size="small" style={{ marginTop: 8, background: '#f6ffed' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Tag theme="success">{content.label}</Tag>
        <div>
          <span style={{ fontSize: 14 }}>
            Delta: <strong>{content.count}</strong>
          </span>
          <span style={{ marginLeft: 16, fontSize: 14 }}>
            Batch: <strong>{content.batch}</strong>
          </span>
        </div>
        <Tag size="small" variant="outline" theme="primary">
          render: {renderCount.current}
        </Tag>
      </div>
    </Card>
  );
};

// ==================== 主组件 ====================

const PerformanceTest: React.FC = () => {
  // 注册所有 Activity 组件
  useAgentActivity([
    // 场景 1：并发 + 隔离性测试 - 5 个组件
    { activityType: 'comp-a', component: ComponentA as React.FC<ActivityComponentProps> },
    { activityType: 'comp-b', component: ComponentB as React.FC<ActivityComponentProps> },
    { activityType: 'comp-c', component: ComponentC as React.FC<ActivityComponentProps> },
    { activityType: 'comp-d', component: ComponentD as React.FC<ActivityComponentProps> },
    { activityType: 'comp-e', component: ComponentE as React.FC<ActivityComponentProps> },
    // 场景 2：批量合并测试
    { activityType: 'batch-merge', component: BatchMergeActivity as React.FC<ActivityComponentProps> },
  ]);

  // 场景 1：并发 + 隔离性验证
  const { chatEngine: concurrentEngine, messages: concurrentMessages, status: concurrentStatus } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: `${MOCK_SERVER_BASE}/sse/concurrent-isolation-test`,
      protocol: 'agui',
      stream: true,
      onRequest: () => ({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }),
    },
  });

  // 场景 2：微任务批量合并验证
  const { chatEngine: batchEngine, messages: batchMessages, status: batchStatus } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: `${MOCK_SERVER_BASE}/sse/batch-merge-test`,
      protocol: 'agui',
      stream: true,
      onRequest: () => ({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }),
    },
  });

  const renderMsgContents = (message: any) => {
    if (Array.isArray(message.content)) {
      return (
        <>
          {message.content.map((item: any, index: number) => {
            if (isActivityContent(item)) {
              return (
                <div slot={`${item.type}-${index}`} key={`activity-${index}`}>
                  <ActivityRenderer activity={item.data} />
                </div>
              );
            }
            return null;
          })}
        </>
      );
    }
    return null;
  };

  const isLoading = concurrentStatus === 'streaming' || batchStatus === 'streaming';

  return (
    <Space direction="vertical" style={{ width: '100%', padding: 16 }}>
      {/* 测试按钮 */}
      <Card bordered title="🔬 性能优化验证（配合 React DevTools Profiler）">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Button
              theme="primary"
              loading={concurrentStatus === 'streaming'}
              disabled={isLoading}
              onClick={() => concurrentEngine.sendUserMessage({ prompt: '并发 + 隔离性验证' })}
            >
              场景 1：并发 + 隔离性（A/B/C 更新，D/E 不更新）
            </Button>
            <Button
              theme="success"
              loading={batchStatus === 'streaming'}
              disabled={isLoading}
              onClick={() => batchEngine.sendUserMessage({ prompt: '批量合并（5 批 × 20 delta）' })}
            >
              场景 2：批量合并（5 批 × 20 delta）
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 场景 1 结果 */}
      {concurrentMessages.length > 0 && (
        <Card bordered>
          <ChatList>
            {concurrentMessages.map((message) => (
              <ChatMessage key={message.id} message={message}>
                {renderMsgContents(message)}
              </ChatMessage>
            ))}
          </ChatList>
        </Card>
      )}

      {/* 场景 2 结果 */}
      {batchMessages.length > 0 && (
        <Card bordered>
          <ChatList>
            {batchMessages.map((message) => (
              <ChatMessage key={message.id} message={message}>
                {renderMsgContents(message)}
              </ChatMessage>
            ))}
          </ChatList>
        </Card>
      )}
    </Space>
  );
};

export default PerformanceTest;
