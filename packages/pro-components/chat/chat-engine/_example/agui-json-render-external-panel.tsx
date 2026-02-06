/**
 * AG-UI + json-render 旁路 UI 渲染示例
 *
 * 演示内容：
 * ⭐ 通过 eventBus.on('AGUI_ACTIVITY') 监听消息变化，在对话框外部独立渲染生成式 UI
 *
 * 使用场景：
 * - 需要将生成的 UI 渲染到页面的其他区域，如弹窗、侧边栏等，进行额外的控制和管理
 */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { type ChatRequestParams, ActivityRenderer, ChatEngineEventType } from '@tdesign-react/chat';
import { useChat, useAgentActivity } from '@tdesign-react/chat';
import { MessagePlugin, Button, Card, Space, Input } from 'tdesign-react';

import {
  createJsonRenderActivityConfig,
  createCustomRegistry,
  type JsonRenderActivityProps,
} from '@tdesign-react/chat';

// 导入自定义组件
import { StatusCard, ProgressBar } from './components';

// Mock Server 地址
const MOCK_SERVER = 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com';

export default function AguiJsonRenderExternalPanelExample() {
  const [inputValue, setInputValue] = useState('创建一个任务进度表单，包含状态卡片和进度条');

  // ==================== ⭐ 旁路 UI 渲染状态 ====================
  // 用于控制外部面板可见性
  const [externalPanelVisible, setExternalPanelVisible] = useState(true);

  // 外部 Activity 内容（通过 eventBus 监听获取）
  const [externalActivity, setExternalActivity] = useState<JsonRenderActivityProps['content'] | null>(null);

  // 使用 useChat 创建 ChatEngine 实例
  const { chatEngine, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: `${MOCK_SERVER}/sse/json-render-activity`,
      protocol: 'agui',
      stream: true,
      onRequest: (params: ChatRequestParams) => {
        const requestBody: Record<string, any> = {
          uid: 'agui-json-render-external-panel-demo',
          prompt: params.prompt,
          demoMode: true,
        };

        if ((params as any).userActionMessage) {
          requestBody.userActionMessage = (params as any).userActionMessage;
        }

        return {
          body: JSON.stringify(requestBody),
        };
      },
      onError: (err) => {
        const errorMsg = err instanceof Error ? err.message : '请求失败';
        MessagePlugin.error(`请求失败: ${errorMsg}`);
      },
    },
  });

  // 创建自定义 ComponentRegistry（渲染层）
  const customRegistry = useMemo(
    () =>
      createCustomRegistry({
        StatusCard,
        ProgressBar,
      }),
    [],
  );

  // 创建 Activity 配置
  const jsonRenderConfig = createJsonRenderActivityConfig({
    activityType: 'json-render-main-card',
    registry: customRegistry,
    actionHandlers: {
      submit: async () => {
        MessagePlugin.success('提交成功');
      },
      refresh: async () => {
        MessagePlugin.info('数据已刷新');
      },
      export: async () => {
        MessagePlugin.info('开始导出数据');
        // 模拟导出
        setTimeout(() => {
          MessagePlugin.success('导出成功');
        }, 1000);
      },
    },
  });

  // 注册 json-render Activity 渲染器
  useAgentActivity(jsonRenderConfig);

  // ==================== ⭐ 使用 eventBus.AGUI_ACTIVITY 监听 Activity 变化 ====================
  useEffect(() => {
    if (!chatEngine) return;

    // 监听 AG-UI Activity 事件（细粒度事件，无需自行判断类型）
    const unsubscribe = chatEngine.eventBus.on(ChatEngineEventType.AGUI_ACTIVITY, (event) => {
      if (event.activityType === 'json-render-main-card') {
        setExternalActivity(event.content as JsonRenderActivityProps['content']);
        setExternalPanelVisible(true);
      }
    });

    return () => unsubscribe();
  }, [chatEngine]);

  // 清空 Activity
  const clearActivity = useCallback(() => {
    setExternalActivity(null);
  }, []);

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    await chatEngine.sendUserMessage({ prompt: inputValue });
    setInputValue('');
  };

  // 停止生成
  const handleStop = () => {
    chatEngine.abortChat();
    MessagePlugin.info('已停止生成');
  };

  const isLoading = status === 'pending' || status === 'streaming';

  return (
    <Space direction="vertical">
      {/* ==================== 左侧：控制面板 ==================== */}
      <Space direction="vertical">
        {/* 输入和控制区域 */}
        <Card bordered header={<div style={{ fontWeight: 600 }}>发送请求</div>}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Input
              value={inputValue}
              placeholder="输入你的需求..."
              onChange={(value) => setInputValue(value)}
              onEnter={handleSend}
              disabled={isLoading}
            />

            <Space>
              <Button theme="primary" onClick={handleSend} loading={isLoading} disabled={isLoading}>
                {isLoading ? '生成中...' : '🚀 发送请求'}
              </Button>
              <Button theme="default" onClick={handleStop} disabled={!isLoading}>
                ⏸️ 停止生成
              </Button>
              <Button variant="outline" onClick={clearActivity}>
                🗑️ 清空面板
              </Button>
            </Space>

            {isLoading && (
              <div style={{ fontSize: '12px', color: 'var(--td-brand-color)' }}>⏳ 正在生成 UI，请查看右侧面板...</div>
            )}
          </Space>
        </Card>
      </Space>

      {/* ==================== ⭐ 右侧：外部渲染面板（核心功能） ==================== */}
      {externalPanelVisible && (
        <Card
          bordered
          style={{
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid var(--td-brand-color)',
            overflow: 'hidden',
          }}
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--td-brand-color)' }}>⚡ 外部渲染面板</div>
                <div style={{ fontSize: '12px', color: 'var(--td-text-color-secondary)', marginTop: '2px' }}>
                  独立于对话框的 UI 渲染区域
                </div>
              </div>
            </div>
          }
        >
          <div style={{ minHeight: '400px', maxHeight: '600px', overflow: 'auto' }}>
            {externalActivity ? (
              <>
                {/* 调试：展示原始 JSON */}
                <details style={{ marginBottom: '12px', fontSize: '11px' }}>
                  <summary style={{ cursor: 'pointer', padding: '4px', background: '#f0f0f0', borderRadius: '4px' }}>
                    🔍 查看原始 Schema
                  </summary>
                  <pre
                    style={{
                      padding: '8px',
                      background: '#f5f5f5',
                      borderRadius: '4px',
                      overflow: 'auto',
                      maxHeight: '200px',
                      fontSize: '10px',
                    }}
                  >
                    {JSON.stringify(externalActivity, null, 2)}
                  </pre>
                </details>

                {/* 使用 ActivityRenderer 渲染 */}
                <div style={{ borderRadius: '4px' }}>
                  <ActivityRenderer
                    activity={{
                      activityType: 'json-render-main-card',
                      content: externalActivity,
                    }}
                  />
                </div>
              </>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: 'var(--td-text-color-placeholder)',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <div style={{ fontSize: '14px' }}>等待 Activity 事件...</div>
                <div style={{ fontSize: '12px', marginTop: '8px' }}>发送消息后，生成的 UI 将在此渲染</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 重新打开外部面板按钮 */}
      {!externalPanelVisible && (
        <Button
          size="large"
          theme="primary"
          shape="round"
          style={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
          onClick={() => setExternalPanelVisible(true)}
        >
          ⚡ 打开外部面板
        </Button>
      )}
    </Space>
  );
}
