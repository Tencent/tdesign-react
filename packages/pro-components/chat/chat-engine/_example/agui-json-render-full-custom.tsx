/**
 * AG-UI + json-render 完整自定义示例
 *
 * 演示内容：
 * 1. 使用 createCustomCatalog 定义自定义组件的 props schema（约束层）
 * 2. 使用 createCustomRegistry 注册自定义组件的 React 实现（渲染层）
 * 3. 完整的两层架构演示
 */
import React, { useState, useRef, useMemo } from 'react';
import { MessagePlugin } from 'tdesign-react';
import { z } from 'zod';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  type ChatRequestParams,
  isActivityContent,
  ActivityRenderer,
} from '@tdesign-react/chat';
import { useChat, useAgentActivity, generateCatalogPrompt } from '@tdesign-react/chat';
import {
  createJsonRenderActivityConfig,
  createCustomRegistry,
} from '@tdesign-react/chat';


// 导入自定义组件
import { StatusCard, ProgressBar, NestedPanel } from './components';

// Mock Server 地址
const MOCK_SERVER = 'http://localhost:9001';

export default function AguiJsonRenderFullCustomExample() {
  const [inputValue, setInputValue] = useState('测试深层嵌套更新');
  const [currentStage, setCurrentStage] = useState<string>('');
  const listRef = useRef<any>(null);


  // ==================== 步骤 1: 创建自定义 Catalog（约束层） ====================
  // 定义自定义组件的 props schema 和 actions 白名单
  // 这个 Catalog 用于告诉 AI/服务端可以生成哪些组件及其约束
  // 注意：本 demo 主要演示前端渲染，Catalog 在实际生产中应传给后端服务（这里暂时用请求参数传递）
  const customCatalog = useMemo(
    () =>
      generateCatalogPrompt({
        name: 'my-dashboard',
        components: {
          // 定义 StatusCard 的 props schema
          StatusCard: {
            props: z.object({
              title: z.string(),
              status: z.enum(['success', 'warning', 'error', 'info']),
              description: z.string().nullable(),
              icon: z.string().nullable(),
            }),
            description: 'Custom status card component for displaying status information',
          },

          // 定义 ProgressBar 的 props schema
          ProgressBar: {
            props: z.object({
              label: z.string().nullable(),
              percentage: z.number().min(0).max(100),
              showInfo: z.boolean().nullable(),
            }),
            description: 'Custom progress bar component for showing completion status',
          },

          // 定义 NestedPanel 的 props schema（用于验证深层嵌套更新）
          NestedPanel: {
            props: z.object({
              title: z.string(),
              level: z.number().min(1).max(10).nullable(),
              collapsed: z.boolean().nullable(),
              borderColor: z.string().nullable(),
              backgroundColor: z.string().nullable(),
            }),
            description: 'Nested panel container for testing deep nesting updates. Can contain other components including itself.',
          },
        },
        actions: {
          // 除了内置的 submit/reset/cancel，添加自定义 actions
          refresh: { description: 'Refresh data from server' },
          export: { description: 'Export data to file' },
        },
      }),
    [],
  );

  // 使用 useChat 创建 ChatEngine 实例
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: `${MOCK_SERVER}/sse/json-render-activity`,
      protocol: 'agui',
      stream: true,
      onRequest: (params: ChatRequestParams) => {
        const requestBody: Record<string, any> = {
          uid: 'agui-json-render-full-custom-demo',
          prompt: params.prompt,
          demoMode: true,
          systemPrompt: customCatalog,
        };

        if ((params as any).userActionMessage) {
          requestBody.userActionMessage = (params as any).userActionMessage;
        }

        return {
          body: JSON.stringify(requestBody),
        };
      },
      onStart: () => {
        setCurrentStage('🚀 开始流式传输');
      },
      onComplete: () => {
        setCurrentStage('✅ 传输完成');
      },
      onError: (err) => {
        const errorMsg = err instanceof Error ? err.message : '请求失败';
        MessagePlugin.error(`请求失败: ${errorMsg}`);
        setCurrentStage(`❌ 错误: ${errorMsg}`);
      },
    },
  });

  // ==================== 步骤 2: 创建自定义 ComponentRegistry（渲染层） ====================
  // 注册自定义组件的 React 实现
  // 这个 Registry 用于告诉 Renderer 如何渲染组件
  const customRegistry = useMemo(
    () =>
      createCustomRegistry({
        // 注册 React 组件实现（必须与 Catalog 中的组件名一致）
        StatusCard,
        ProgressBar,
        NestedPanel,
        // 注册基础 Div 组件（用于渲染后端返回的 Div 类型元素）
        Div: ({element, children}) => {
          const {props} = element;
          // const {props, children} = element;
          return <div {...props} >{element.props.children || children}</div>
        }
      }),
    [],
  );

  // ==================== 步骤 3: 创建 Activity 配置 ====================
  const jsonRenderConfig =
      createJsonRenderActivityConfig({
        activityType: 'json-render-main-card',
        registry: customRegistry, // 使用自定义 registry（渲染层）
        debug: true,
        // 预定义 action handlers（必须与 Catalog 中的 actions 一致）
        actionHandlers: {
          // 内置 actions
          submit: async (params) => {
            setCurrentStage('提交表单...');

            try {
              await chatEngine.sendAIMessage({
                params: {
                  userActionMessage: {
                    name: 'submit',
                    params,
                    timestamp: new Date().toISOString(),
                  },
                },
                sendRequest: true,
              });

              setCurrentStage('表单提交成功');
              MessagePlugin.success('提交成功');
              listRef.current?.scrollList({ to: 'bottom' });
            } catch (error) {
              MessagePlugin.error(`提交失败: ${error instanceof Error ? error.message : '未知错误'}`);
              setCurrentStage('提交失败');
            }
          },

          reset: async () => {
            MessagePlugin.info('表单已重置');
            setCurrentStage('表单已重置');
          },

          cancel: async () => {
            MessagePlugin.info('已取消');
            setCurrentStage('已取消');
          },

          // 自定义 actions（与 Catalog 中定义的一致）
          refresh: async (params) => {
            MessagePlugin.info('数据已刷新');
            setCurrentStage('数据已刷新');

            try {
              await chatEngine.sendAIMessage({
                params: {
                  userActionMessage: {
                    name: 'refresh',
                    params,
                    timestamp: new Date().toISOString(),
                  },
                },
                sendRequest: true,
              });
            } catch (error) {
              console.error('刷新失败:', error);
            }
          },

          export: async () => {
            MessagePlugin.info('开始导出数据');
            setCurrentStage('导出数据中...');

            // 模拟导出
            setTimeout(() => {
              MessagePlugin.success('导出成功');
              setCurrentStage('导出完成');
            }, 1000);
          },
        },
      })

  // 注册 json-render Activity 渲染器
  useAgentActivity(jsonRenderConfig);

  // 发送消息
  const handleSend = async (e: CustomEvent<{ value: string }>) => {
    const { value } = e.detail;
    if (!value.trim()) return;

    setCurrentStage('');
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  // 停止生成
  const handleStop = () => {
    chatEngine.abortChat();
    MessagePlugin.info('已停止生成');
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

  return (
    <div style={{ height: '800px', display: 'flex', flexDirection: 'column' }}>
      {/* 标题区域 */}
      <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>完整自定义组件 + json-render 演示</h3>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--td-text-color-secondary)' }}>
          演示 Catalog（约束层）+ ComponentRegistry（渲染层）完整架构
        </p>
        {currentStage && (
          <div
            style={{
              marginTop: '8px',
              fontSize: '12px',
              color: 'var(--td-text-color-primary)',
            }}
          >
            当前状态: {currentStage}
          </div>
        )}
      </div>

      {/* 消息列表 */}
      <ChatList ref={listRef} style={{ flex: 1, overflow: 'auto' }}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            placement={message.role === 'user' ? 'right' : 'left'}
            variant={message.role === 'user' ? 'base' : 'text'}
          >
            {renderMsgContents(message)}
          </ChatMessage>
        ))}
      </ChatList>

      {/* 输入区域 */}
      <ChatSender
        value={inputValue}
        placeholder="试试：测试深层嵌套更新、创建任务进度表单"
        loading={status === 'pending' || status === 'streaming'}
        onChange={(e: CustomEvent<string>) => setInputValue(e.detail)}
        onSend={handleSend as any}
        onStop={handleStop}
      />
    </div>
  );
}
