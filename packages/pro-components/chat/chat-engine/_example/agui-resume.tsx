import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import {
  type TdChatMessageConfig,
  type ChatRequestParams,
  type ChatMessagesData,
  type TdChatActionsName,
  type TdChatSenderParams,
  ChatList,
  ChatSender,
  ChatMessage,
  TdChatListApi,
  ChatActionBar,
  isAIMessage,
  getMessageContentForCopy,
  AGUIAdapter,
  isToolCallContent,
} from '@tdesign-react/chat';
import { Button, Space, MessagePlugin, Tag } from 'tdesign-react';
import { useChat } from '../index';
import CustomToolCallRenderer from './components/Toolcall';

// Mock 服务地址（本地开发使用 localhost:9001，线上使用云函数）
const MOCK_BASE_URL = 'http://127.0.0.1:9001';

/**
 * AG-UI 断点恢复（Resume）示例
 *
 * 演示场景：
 * 1. 用户之前发起了一个对话请求（要求 AI 搜索并分析 React vs Vue）
 * 2. 后端 Agent 开始执行（思考 → 工具调用 → 文本输出），但用户中途离开了页面
 * 3. 用户重新进入页面后：
 *    a. 先加载历史消息（只有已完成的消息）
 *    b. 发现有未完成的 run（pendingRun 标识）
 *    c. 调用 chatEngine.resumeRun() 发起 SSE 连接
 *    d. 后端推 MESSAGES_SNAPSHOT 恢复已产生的中间内容（思考、工具调用、部分文本）
 *    e. 后端继续推增量事件（新的文本内容），直到 RUN_FINISHED
 *
 * 关键 API：
 * - chatEngine.resumeRun(params) — 创建空 AI 消息 + 发起 sendRequest
 * - MESSAGES_SNAPSHOT 事件 — 一次性恢复中间状态（replaceContent 语义）
 */
export default function AguiResumeExample() {
  const listRef = useRef<TdChatListApi>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [resumeState, setResumeState] = useState<'idle' | 'loading' | 'resumed' | 'error'>('idle');
  const [pendingRunInfo, setPendingRunInfo] = useState<{
    runId: string;
    threadId: string;
  } | null>(null);

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      // 续传接口
      endpoint: `${MOCK_BASE_URL}/sse/agui-resume`,
      protocol: 'agui',
      stream: true,
      onRequest: (params: ChatRequestParams) => ({
        body: JSON.stringify({
          uid: 'resume-demo',
          prompt: params.prompt,
          threadId: params.threadId,
          runId: params.runId,
        }),
      }),
      onStart: (chunk) => {
        console.log('[Resume] 流式传输开始:', chunk);
      },
      onComplete: (aborted, params, event) => {
        console.log('[Resume] 流式传输完成:', { aborted, event });
        if (!aborted) {
          setResumeState('resumed');
          MessagePlugin.success('断点恢复完成！');
        }
      },
      onError: (err) => {
        console.error('[Resume] 错误:', err);
        setResumeState('error');
      },
    },
  });

  const senderLoading = useMemo(
    () => status === 'pending' || status === 'streaming',
    [status],
  );

  /**
   * 模拟断点恢复的完整流程
   *
   * 实际业务中，这个流程通常在页面 mount 时自动执行：
   * 1. 请求历史消息接口
   * 2. 检查是否有 pendingRun
   * 3. 如果有，自动调用 resumeRun
   */
  const handleSimulateResume = useCallback(async () => {
    setResumeState('loading');

    try {
      // Step 1: 请求历史消息
      console.log('[Resume] Step 1: 加载历史消息...');
      const response = await fetch(`${MOCK_BASE_URL}/api/conversation/resume-history`);
      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error('加载历史消息失败');
      }

      const { messages: historyMessages, pendingRun } = result.data;

      // Step 2: 使用 convertHistoryMessages 转换已完成的历史消息
      const convertedMessages = AGUIAdapter.convertHistoryMessages(historyMessages);
      chatEngine.setMessages(convertedMessages);
      
      console.log(`[Resume] 历史消息已加载: ${convertedMessages.length} 条`);

      // Step 3: 检查是否有未完成的 run
      if (pendingRun) {
        console.log('[Resume] Step 2: 发现未完成的 run:', pendingRun);
        setPendingRunInfo(pendingRun);
        MessagePlugin.info(`发现未完成的任务 (runId: ${pendingRun.runId})，正在恢复...`);

        // Step 4: 调用 resumeRun 发起续传
        // 这会创建一条空的 AI 消息，然后发起 SSE 请求
        // 后端会先推 MESSAGES_SNAPSHOT 恢复中间状态，然后推增量事件
        console.log('[Resume] Step 3: 发起 resumeRun...');
        const messageId = await chatEngine.resumeRun({
          threadId: pendingRun.threadId,
          runId: pendingRun.runId,
        });
        console.log(`[Resume] resumeRun 完成，消息 ID: ${messageId}`);
      } else {
        console.log('[Resume] 没有未完成的 run');
        setResumeState('idle');
        MessagePlugin.info('没有需要恢复的任务');
      }
    } catch (error) {
      console.error('[Resume] 恢复失败:', error);
      setResumeState('error');
      MessagePlugin.error('断点恢复失败');
    }
  }, [chatEngine]);

  // 正常发送消息（恢复完成后可以继续对话）
  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
    listRef.current?.scrollList({ to: 'bottom' });
  };

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
    },
    assistant: {
      placement: 'left',
      chatContentProps: {
        thinking: { maxHeight: 300 },
      },
    },
  };

  // 渲染消息内容
  const renderMsgContents = (message: ChatMessagesData): ReactNode => {
    const contentElements = message.content?.map((item, index) => {
      if (isToolCallContent(item)) {
        return (
          <div key={`toolcall-${index}`} className="toolcall-wrapper">
            <CustomToolCallRenderer toolCall={item.data} status={item.status || 'complete'} />
          </div>
        );
      }
      return null;
    });

    return (
      <>
        {contentElements}
        {isAIMessage(message) && message.status === 'complete' ? (
          <ChatActionBar
            slot="actionbar"
            actionBar={['copy', 'good', 'bad'] as TdChatActionsName[]}
            handleAction={(name) => console.log('action:', name)}
            copyText={getMessageContentForCopy(message)}
          />
        ) : null}
      </>
    );
  };

  // 状态标签
  const getResumeStatusTag = () => {
    const config: Record<string, { theme: string; text: string }> = {
      idle: { theme: 'default', text: '未开始' },
      loading: { theme: 'warning', text: '恢复中...' },
      resumed: { theme: 'success', text: '恢复完成' },
      error: { theme: 'danger', text: '恢复失败' },
    };
    const c = config[resumeState];
    return <Tag theme={c.theme as any} size="small">{c.text}</Tag>;
  };

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* 操作栏 */}
      <div style={{ padding: '12px', borderBottom: '1px solid #e7e7e7', backgroundColor: '#fafafa' }}>
        <Space align="center">
          <Button
            size="small"
            theme="primary"
            onClick={handleSimulateResume}
            loading={resumeState === 'loading'}
            disabled={senderLoading}
          >
            模拟断点恢复
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              chatEngine.clearMessages();
              setResumeState('idle');
              setPendingRunInfo(null);
              MessagePlugin.success('已清空');
            }}
          >
            清空消息
          </Button>
          {getResumeStatusTag()}
          {pendingRunInfo && (
            <span style={{ fontSize: '12px', color: '#999' }}>
              threadId: {pendingRunInfo.threadId}
            </span>
          )}
        </Space>
      </div>

      {/* 消息列表 */}
      <ChatList ref={listRef} style={{ width: '100%', flex: 1 }}>
        {messages.map((message, idx) => (
          <ChatMessage key={message.id} {...messageProps[message.role]} message={message}>
            {renderMsgContents(message, idx === messages.length - 1)}
          </ChatMessage>
        ))}
      </ChatList>

      {/* 输入框 */}
      <ChatSender
        value={inputValue}
        placeholder={resumeState === 'resumed' ? '恢复完成，可以继续对话' : '点击「模拟断点恢复」开始演示'}
        loading={senderLoading}
        onChange={(e) => setInputValue(e.detail)}
        onSend={handleSend}
        onStop={() => chatEngine.abortChat()}
      />
    </div>
  );
}
