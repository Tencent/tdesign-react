import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Space, Tag, Divider, List, MessagePlugin } from 'tdesign-react';
import ChatEngine, { ChatEngineEventType, type SSEChunkData, type AIMessageContent } from '../core';
import type { ChatEngineEventPayloadMap, EventHistoryItem } from '../core/event-bus/types';

/**
 * Headless 事件总线示例
 *
 * 学习目标：
 * - 了解如何在无 UI 场景下使用 ChatEngine 事件总线
 * - 掌握事件订阅、发布、等待的用法
 * - 理解如何将事件分发到外部系统或自定义 UI
 */
export default function HeadlessEventBusExample() {
  // 事件日志
  const [eventLogs, setEventLogs] = useState<Array<{ event: string; time: string; data: string }>>([]);
  // 消息计数
  const [messageCount, setMessageCount] = useState(0);
  // 当前状态
  const [currentStatus, setCurrentStatus] = useState<string>('idle');
  // 引擎实例
  const engineRef = useRef<ChatEngine | null>(null);
  // 是否已初始化
  const [initialized, setInitialized] = useState(false);

  // 添加事件日志
  const addLog = (event: string, data: unknown) => {
    const time = new Date().toLocaleTimeString();
    setEventLogs((prev) => [
      { event, time, data: JSON.stringify(data, null, 2).slice(0, 200) },
      ...prev.slice(0, 19), // 最多保留20条
    ]);
  };

  // 初始化引擎
  const initEngine = () => {
    if (engineRef.current) {
      engineRef.current.destroy();
    }

    // 创建引擎实例，启用调试模式和历史记录
    const engine = new ChatEngine({
      debug: true,
      historySize: 50,
    });

    // 初始化配置
    engine.init({
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
      stream: true,
      onMessage: (chunk: SSEChunkData): AIMessageContent => ({
        type: 'markdown',
        data: chunk.data?.msg || '',
      }),
    });

    // 订阅生命周期事件
    engine.eventBus.on(ChatEngineEventType.ENGINE_INIT, (payload) => {
      addLog('ENGINE_INIT', payload);
      setCurrentStatus('ready');
    });

    engine.eventBus.on(ChatEngineEventType.ENGINE_DESTROY, (payload) => {
      addLog('ENGINE_DESTROY', payload);
      setCurrentStatus('destroyed');
    });

    // 订阅消息事件
    engine.eventBus.on(ChatEngineEventType.MESSAGE_CREATE, (payload) => {
      addLog('MESSAGE_CREATE', { messageId: payload.message.id, role: payload.message.role });
      setMessageCount((prev) => prev + 1);
    });

    engine.eventBus.on(ChatEngineEventType.MESSAGE_UPDATE, (payload) => {
      addLog('MESSAGE_UPDATE', { messageId: payload.messageId });
    });

    engine.eventBus.on(ChatEngineEventType.MESSAGE_STATUS_CHANGE, (payload) => {
      addLog('MESSAGE_STATUS_CHANGE', payload);
      setCurrentStatus(payload.status);
    });

    engine.eventBus.on(ChatEngineEventType.MESSAGE_CLEAR, (payload) => {
      addLog('MESSAGE_CLEAR', payload);
      setMessageCount(0);
    });

    // 订阅请求事件
    engine.eventBus.on(ChatEngineEventType.REQUEST_START, (payload) => {
      addLog('REQUEST_START', { messageId: payload.messageId });
    });

    engine.eventBus.on(ChatEngineEventType.REQUEST_STREAM, (payload) => {
      // 流式数据事件会非常频繁，这里只记录部分
      if (Math.random() < 0.1) {
        addLog('REQUEST_STREAM (sampled)', { messageId: payload.messageId });
      }
    });

    engine.eventBus.on(ChatEngineEventType.REQUEST_COMPLETE, (payload) => {
      addLog('REQUEST_COMPLETE', { messageId: payload.messageId });
      MessagePlugin.success('请求完成');
    });

    engine.eventBus.on(ChatEngineEventType.REQUEST_ERROR, (payload) => {
      addLog('REQUEST_ERROR', { messageId: payload.messageId, error: String(payload.error) });
      MessagePlugin.error('请求出错');
    });

    engine.eventBus.on(ChatEngineEventType.REQUEST_ABORT, (payload) => {
      addLog('REQUEST_ABORT', { messageId: payload.messageId });
      MessagePlugin.warning('请求已中止');
    });

    engineRef.current = engine;
    setInitialized(true);

    // 手动触发初始化事件日志
    addLog('ENGINE_INIT', { timestamp: Date.now() });
  };

  // 发送消息
  const sendMessage = async () => {
    if (!engineRef.current) {
      MessagePlugin.warning('请先初始化引擎');
      return;
    }
    await engineRef.current.sendUserMessage({ prompt: '你好，请介绍一下自己' });
  };

  // 中止请求
  const abortRequest = () => {
    if (!engineRef.current) return;
    engineRef.current.abortChat();
  };

  // 清空消息
  const clearMessages = () => {
    if (!engineRef.current) return;
    engineRef.current.clearMessages();
  };

  // 销毁引擎
  const destroyEngine = () => {
    if (!engineRef.current) return;
    engineRef.current.destroy();
    engineRef.current = null;
    setInitialized(false);
    setCurrentStatus('idle');
  };

  // 等待特定事件（演示 waitFor 用法）
  const waitForComplete = async () => {
    if (!engineRef.current) {
      MessagePlugin.warning('请先初始化引擎');
      return;
    }

    MessagePlugin.info('等待请求完成事件...');

    try {
      const result = await engineRef.current.eventBus.waitFor(ChatEngineEventType.REQUEST_COMPLETE, 60000);
      MessagePlugin.success(`收到完成事件，消息ID: ${result.messageId}`);
    } catch (error) {
      MessagePlugin.error('等待超时');
    }
  };

  // 发布自定义事件
  const emitCustomEvent = () => {
    if (!engineRef.current) {
      MessagePlugin.warning('请先初始化引擎');
      return;
    }

    engineRef.current.eventBus.emitCustom('user:action', {
      action: 'button_click',
      timestamp: Date.now(),
    });

    addLog('CUSTOM:user:action', { action: 'button_click' });
    MessagePlugin.success('自定义事件已发布');
  };

  // 获取事件历史
  const showHistory = () => {
    if (!engineRef.current) {
      MessagePlugin.warning('请先初始化引擎');
      return;
    }

    const history = engineRef.current.eventBus.getHistory();
    console.log('事件历史:', history);
    MessagePlugin.info(`共 ${history.length} 条历史记录，请查看控制台`);
  };

  // 清理
  useEffect(
    () => () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    },
    [],
  );

  return (
    <div style={{ padding: 16 }}>
      <Card title="Headless 事件总线示例" bordered>
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* 状态展示 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span>
              引擎状态:
              <Tag theme={initialized ? 'success' : 'default'} style={{ marginLeft: 8 }}>
                {initialized ? '已初始化' : '未初始化'}
              </Tag>
            </span>
            <span>
              当前状态:
              <Tag theme="primary" style={{ marginLeft: 8 }}>
                {currentStatus}
              </Tag>
            </span>
            <span>
              消息数量:
              <Tag theme="warning" style={{ marginLeft: 8 }}>
                {messageCount}
              </Tag>
            </span>
          </div>

          <Divider />

          {/* 操作按钮 */}
          <Space>
            <Button onClick={initEngine} disabled={initialized}>
              初始化引擎
            </Button>
            <Button onClick={sendMessage} disabled={!initialized} theme="primary">
              发送消息
            </Button>
            <Button onClick={abortRequest} disabled={!initialized} theme="warning">
              中止请求
            </Button>
            <Button onClick={clearMessages} disabled={!initialized}>
              清空消息
            </Button>
            <Button onClick={destroyEngine} disabled={!initialized} theme="danger">
              销毁引擎
            </Button>
          </Space>

          <Space>
            <Button onClick={waitForComplete} disabled={!initialized} variant="outline">
              等待完成事件
            </Button>
            <Button onClick={emitCustomEvent} disabled={!initialized} variant="outline">
              发布自定义事件
            </Button>
            <Button onClick={showHistory} disabled={!initialized} variant="outline">
              查看事件历史
            </Button>
          </Space>

          <Divider />

          {/* 事件日志 */}
          <div>
            <h4>事件日志（最新20条）</h4>
            <List
              style={{ maxHeight: 400, overflow: 'auto', background: '#f5f5f5', borderRadius: 4 }}
              size="small"
              split
            >
              {eventLogs.length === 0 ? (
                <List.ListItem style={{ color: '#999' }}>暂无事件日志，请先初始化引擎</List.ListItem>
              ) : (
                eventLogs.map((log, index) => (
                  <List.ListItem key={index}>
                    <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      <Tag size="small" theme="primary" style={{ marginRight: 8 }}>
                        {log.time}
                      </Tag>
                      <Tag size="small" style={{ marginRight: 8 }}>
                        {log.event}
                      </Tag>
                      <span style={{ color: '#666' }}>{log.data}</span>
                    </div>
                  </List.ListItem>
                ))
              )}
            </List>
          </div>
        </Space>
      </Card>
    </div>
  );
}
