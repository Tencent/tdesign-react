import React, { useEffect, useRef } from 'react';
import { Card, Button, Space, Divider } from 'tdesign-react';
import ChatEngine, {
  ChatEngineEventType,
  type SSEChunkData,
  type AIMessageContent,
} from 'tdesign-web-components/lib/chat-engine';

/**
 * 纯 Headless 示例 - 无 UI 依赖的 ChatEngine 使用方式
 *
 * 此示例展示如何在不使用任何 Chat UI 组件的情况下，
 * 仅通过事件总线来驱动业务逻辑。
 *
 * 适用场景：
 * - 嵌入式 AI 助手（如侧边栏建议）
 * - 后台批处理任务
 * - 与其他 UI 框架集成（Vue/Angular 等）
 * - 自定义渲染逻辑
 */
export default function HeadlessPureExample() {
  const outputRef = useRef<HTMLPreElement>(null);
  const engineRef = useRef<ChatEngine | null>(null);

  // 输出日志到界面
  const log = (msg: string) => {
    if (outputRef.current) {
      const time = new Date().toLocaleTimeString();
      outputRef.current.textContent += `[${time}] ${msg}\n`;
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  // 清空日志
  const clearLog = () => {
    if (outputRef.current) {
      outputRef.current.textContent = '';
    }
  };

  // 运行 Headless Demo
  const runHeadlessDemo = async () => {
    clearLog();
    log('=== 开始 Headless ChatEngine Demo ===\n');

    // 1. 创建引擎实例
    log('1. 创建 ChatEngine 实例...');
    const engine = new ChatEngine({ debug: false });
    engineRef.current = engine;

    // 2. 初始化配置
    log('2. 初始化配置...');
    engine.init({
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
      stream: true,
      onMessage: (chunk: SSEChunkData): AIMessageContent => ({
        type: 'markdown',
        data: chunk.data?.msg || '',
      }),
    });

    // 3. 设置事件监听
    log('3. 设置事件监听...\n');

    // 监听消息创建
    engine.eventBus.on(ChatEngineEventType.MESSAGE_CREATE, ({ message }) => {
      log(`📝 消息创建: [${message.role}] ID=${message.id}`);
    });

    // 监听状态变化
    engine.eventBus.on(ChatEngineEventType.MESSAGE_STATUS_CHANGE, ({ messageId, status, previousStatus }) => {
      log(`🔄 状态变化: ${previousStatus || 'none'} → ${status} (${messageId.slice(0, 8)}...)`);
    });

    // 监听请求开始
    engine.eventBus.on(ChatEngineEventType.REQUEST_START, ({ messageId }) => {
      log(`🚀 请求开始: ${messageId?.slice(0, 8)}...`);
    });

    // 监听流式数据（采样）
    let streamCount = 0;
    engine.eventBus.on(ChatEngineEventType.REQUEST_STREAM, () => {
      streamCount += 1;
      if (streamCount % 10 === 0) {
        log(`📡 已接收 ${streamCount} 个数据块...`);
      }
    });

    // 监听请求完成
    engine.eventBus.on(ChatEngineEventType.REQUEST_COMPLETE, ({ messageId, message }) => {
      log(`✅ 请求完成: ${messageId.slice(0, 8)}...`);
      log(`📄 最终消息内容:`);

      if (message.role === 'assistant' && 'content' in message && message.content) {
        message.content.forEach((content, idx) => {
          if (content.type === 'markdown') {
            log(`   [${idx}] ${String(content.data).slice(0, 100)}...`);
          }
        });
      }
    });

    // 监听错误
    engine.eventBus.on(ChatEngineEventType.REQUEST_ERROR, ({ error }) => {
      log(`❌ 请求错误: ${String(error)}`);
    });

    // 4. 发送消息
    log('\n4. 发送用户消息...');
    await engine.sendUserMessage({ prompt: '简单介绍一下 TypeScript' });

    log('\n=== Demo 运行中，等待响应... ===');
  };

  // 运行带条件等待的 Demo
  const runWaitForDemo = async () => {
    clearLog();
    log('=== WaitFor Demo ===\n');

    const engine = new ChatEngine();
    engineRef.current = engine;

    engine.init({
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
      stream: true,
      onMessage: (chunk: SSEChunkData): AIMessageContent => ({
        type: 'markdown',
        data: chunk.data?.msg || '',
      }),
    });

    log('发送消息并等待完成...');

    // 发送消息
    engine.sendUserMessage({ prompt: '用一句话介绍 React' });

    // 使用 waitFor 等待完成事件
    try {
      const result = await engine.eventBus.waitFor(ChatEngineEventType.REQUEST_COMPLETE, 60000);
      log(`\n✅ 收到完成事件!`);
      log(`消息ID: ${result.messageId}`);

      const msg = result.message;
      if (msg.role === 'assistant' && 'content' in msg && msg.content) {
        const textContent = msg.content.find((c) => c.type === 'markdown');
        if (textContent) {
          log(`响应内容: ${String(textContent.data)}`);
        }
      }
    } catch (error) {
      log(`❌ 等待超时或出错: ${String(error)}`);
    }
  };

  // 运行自定义事件 Demo
  const runCustomEventDemo = () => {
    clearLog();
    log('=== 自定义事件 Demo ===\n');

    const engine = new ChatEngine();
    engineRef.current = engine;

    engine.init({
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
      stream: true,
    });

    // 订阅自定义事件
    engine.eventBus.onCustom<{ action: string; data: unknown }>('business:event', (payload) => {
      log(`📬 收到自定义事件: ${payload.action}`);
      log(`   数据: ${JSON.stringify(payload.data)}`);
    });

    // 模拟业务场景：用户操作触发事件
    log('模拟用户操作...\n');

    engine.eventBus.emitCustom('business:event', {
      action: 'user_click_suggest',
      data: { suggestId: 1, text: '推荐问题A' },
    });

    engine.eventBus.emitCustom('business:event', {
      action: 'user_feedback',
      data: { messageId: 'msg-123', rating: 'good' },
    });

    engine.eventBus.emitCustom('business:event', {
      action: 'context_update',
      data: { key: 'user_preference', value: 'concise' },
    });

    log('\n✅ 自定义事件演示完成');
  };

  // 中止当前请求
  const abortCurrent = () => {
    if (engineRef.current) {
      engineRef.current.abortChat();
      log('\n⏹️ 已发送中止请求');
    }
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
      <Card title="纯 Headless 模式示例" bordered>
        <Space direction="vertical" style={{ width: '100%' }}>
          <p style={{ color: '#666' }}>
            此示例展示如何在不使用任何 Chat UI 组件的情况下，仅通过事件总线来驱动业务逻辑。 适用于嵌入式 AI
            助手、后台任务、与其他框架集成等场景。
          </p>

          <Divider />

          <Space>
            <Button onClick={runHeadlessDemo} theme="primary">
              运行基础 Demo
            </Button>
            <Button onClick={runWaitForDemo} variant="outline">
              运行 WaitFor Demo
            </Button>
            <Button onClick={runCustomEventDemo} variant="outline">
              运行自定义事件 Demo
            </Button>
            <Button onClick={abortCurrent} theme="warning">
              中止请求
            </Button>
            <Button onClick={clearLog}>清空日志</Button>
          </Space>

          <Divider />

          {/* 输出区域 */}
          <pre
            ref={outputRef}
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: 16,
              borderRadius: 4,
              height: 400,
              overflow: 'auto',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: 13,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            点击上方按钮运行示例...
          </pre>
        </Space>
      </Card>
    </div>
  );
}
