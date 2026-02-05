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
 * Activity 纯增量模式验证示例
 * 
 * 验证没有 ACTIVITY_SNAPSHOT，只有 ACTIVITY_DELTA 的情况下的处理逻辑
 * 基于 text.txt 中的真实数据进行测试
 */

// ==================== Activity 组件定义 ====================

/**
 * 节点生命周期内容类型
 */
interface NodeLifecycleNode {
  nodeId: string;
  phase: 'start' | 'complete';
}

interface NodeInterrupt {
  nodeId: string;
  key: string;
  prompt: string;
  checkpointId: string;
  lineageId: string;
}

interface NodeLifecycleContent {
  node?: NodeLifecycleNode;
  interrupt?: NodeInterrupt;
}

/**
 * 节点生命周期 Activity 组件
 * 展示节点的执行状态和中断信息
 */
const NodeLifecycleActivity: React.FC<ActivityComponentProps<NodeLifecycleContent>> = ({ content }) => {
  const { node, interrupt } = content;

  // 获取节点状态图标
  const getNodeIcon = (phase: string) => {
    switch (phase) {
      case 'complete':
        return <CheckCircleFilledIcon style={{ color: '#52c41a', fontSize: 18 }} />;
      case 'start':
        return <TimeFilledIcon style={{ color: '#1890ff', fontSize: 18 }} />;
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
  const getStatusTheme = (phase: string) => {
    if (phase === 'complete') return 'success';
    if (phase === 'start') return 'primary';
    return 'default';
  };

  // 获取状态文本
  const getStatusText = (phase: string) => {
    if (phase === 'complete') return '已完成';
    if (phase === 'start') return '执行中';
    return '未知';
  };

  return (
    <Card bordered style={{ marginTop: 8, width: '100%' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 标题 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>节点生命周期</span>
          <Tag theme="primary" variant="light">
            纯增量模式
          </Tag>
        </div>

        {/* 节点信息 */}
        {node && (
          <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              {getNodeIcon(node.phase)}
              <span style={{ fontSize: 14, fontWeight: 500 }}>节点: {node.nodeId}</span>
              <Tag size="small" theme={getStatusTheme(node.phase)}>
                {getStatusText(node.phase)}
              </Tag>
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              阶段: {node.phase}
            </div>
          </div>
        )}

        {/* 中断信息 */}
        {interrupt && (
          <div style={{ padding: '12px', background: '#fff2e8', borderRadius: '6px', border: '1px solid #ffbb96' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <CloseCircleFilledIcon style={{ color: '#fa8c16', fontSize: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>节点中断: {interrupt.nodeId}</span>
              <Tag size="small" theme="warning">
                需要确认
              </Tag>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
              键: {interrupt.key}
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
              检查点ID: {interrupt.checkpointId}
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
              提示: {interrupt.prompt}
            </div>
          </div>
        )}

        {/* 调试信息 */}
        <details style={{ fontSize: 12, color: '#999' }}>
          <summary style={{ cursor: 'pointer', userSelect: 'none' }}>调试信息</summary>
          <pre style={{ marginTop: 8, padding: 8, background: '#f5f5f5', borderRadius: 4, overflow: 'auto' }}>
            {JSON.stringify(content, null, 2)}
          </pre>
        </details>
      </Space>
    </Card>
  );
};

// ==================== 主组件 ====================

const ActivityDeltaTest: React.FC = () => {
  const listRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>('测试纯增量模式');

  // 注册 Activity 组件
  useAgentActivity([
    {
      activityType: 'graph.node.lifecycle',
      component: NodeLifecycleActivity as React.FC<ActivityComponentProps>,
      description: '节点生命周期展示',
    },
    {
      activityType: 'graph.node.interrupt',
      component: NodeLifecycleActivity as React.FC<ActivityComponentProps>,
      description: '节点中断展示',
    },
  ]);

  // 聊天配置 - 使用新的 endpoint
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agui-activity-delta-test',
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
    <Space direction='vertical' style={{ width: '100%' }}>
      <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>纯增量模式验证：</div>
        <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
          验证没有 ACTIVITY_SNAPSHOT，只有 ACTIVITY_DELTA 的情况下，event-mapper 是否能正确处理
        </p>
        <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
          基于 text.txt 中的真实数据，包含节点生命周期和中断事件
        </p>
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
          placeholder="输入任意内容开始测试纯增量模式"
          loading={senderLoading}
          onChange={(e: any) => setInputValue(e.detail)}
          onSend={sendHandler}
          onStop={() => chatEngine.abortChat()}
        />
      </div>
    </Space>
  );
};

export default ActivityDeltaTest;