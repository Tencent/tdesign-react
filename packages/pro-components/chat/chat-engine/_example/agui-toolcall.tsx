import React, { ReactNode, useRef, useState, useMemo } from 'react';
import { Card, Progress, Space, Image } from 'tdesign-react';
import { CheckCircleFilledIcon, CloseCircleFilledIcon, LoadingIcon } from 'tdesign-icons-react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  ChatActionBar,
  isAIMessage,
  TdChatSenderParams,
  ChatLoading,
  TdChatActionsName,
  ToolCallRenderer,
  useAgentState,
  useChat,
  useAgentToolcall,
} from '@tdesign-react/chat';
import type { TdChatMessageConfig, ChatMessagesData, ChatRequestParams, AIMessageContent, ToolCall, AgentToolcallConfig, ToolcallComponentProps } from '@tdesign-react/chat';

/**
 * 图片生成进度状态接口
 */
interface ImageGenState {
  status: 'preparing' | 'generating' | 'completed' | 'failed';
  progress: number;
  message: string;
  imageUrl?: string;
  error?: string;
}

/**
 * 图片生成进度组件
 * 演示如何通过 useAgentState 订阅 AG-UI 状态事件
 */
interface ImageGenProgressProps {
  taskId?: string;
}

export const ImageGenProgress: React.FC<ImageGenProgressProps> = ({ taskId }) => {
  // 订阅 AG-UI 状态事件
  const { stateMap, currentStateKey } = useAgentState({
    subscribeKey: taskId,
  });

  // 提取当前任务的状态数据
  const genState = useMemo<ImageGenState | null>(() => {
    const targetKey = taskId || currentStateKey;
    if (!stateMap || !targetKey || !stateMap[targetKey]) {
      return null;
    }
    return stateMap[targetKey] as ImageGenState;
  }, [stateMap, taskId, currentStateKey]);

  if (!genState) {
    return <div>等待任务开始...</div>;
  }

  const { status, progress, message, imageUrl, error } = genState;

  // 渲染不同状态的 UI
  const renderContent = () => {
    switch (status) {
      case 'preparing':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LoadingIcon />
              <span>准备生成图片...</span>
            </div>
            <Progress percentage={progress} />
            <div style={{ color: '#666', fontSize: '12px' }}>{message}</div>
          </Space>
        );

      case 'generating':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LoadingIcon />
              <span>正在生成图片...</span>
            </div>
            <Progress percentage={progress} />
            <div style={{ color: '#666', fontSize: '12px' }}>{message}</div>
          </Space>
        );

      case 'completed':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#52c41a' }}>
              <CheckCircleFilledIcon />
              <span>图片生成完成</span>
            </div>
            {imageUrl && (
              <Image
                src={imageUrl}
                fit="cover"
                style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
              />
            )}
          </Space>
        );

      case 'failed':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4d4f' }}>
              <CloseCircleFilledIcon />
              <span>图片生成失败</span>
            </div>
            <div style={{ color: '#ff4d4f', fontSize: '12px' }}>{error || '未知错误'}</div>
          </Space>
        );

      default:
        return null;
    }
  };

  return (
    <Card bordered hoverShadow style={{ marginTop: '12px' }}>
      {renderContent()}
    </Card>
  );
};

// 图片生成工具调用类型定义
interface GenerateImageArgs {
  taskId: string;
  prompt: string;
}

// 图片生成工具调用配置
const imageGenActions: AgentToolcallConfig[] = [
  {
    name: 'generate_image',
    description: '生成图片',
    parameters: [
      { name: 'taskId', type: 'string', required: true },
      { name: 'prompt', type: 'string', required: true },
    ],
    component: ({ status, args, error }: ToolcallComponentProps<GenerateImageArgs>) => {
      if (status === 'error') {
        return <div style={{ color: '#ff4d4f' }}>解析参数失败: {error?.message}</div>;
      }
      // 使用 taskId 作为状态订阅的 key，确保多轮对话时每个任务的状态是独立的
      return <ImageGenProgress taskId={args?.taskId} />;
    },
  },
];

/**
 * 图片生成 Agent 聊天组件
 * 演示如何使用 useAgentToolcall 和 useAgentState 实现工具调用和状态订阅
 */
export default function ImageGenAgentChat() {
  const listRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>('请帮我生成一张赛博朋克风格的城市夜景图片');

  // 注册图片生成工具
  useAgentToolcall(imageGenActions);

  // 创建聊天服务配置
  const createChatServiceConfig = () => ({
    endpoint: `http://localhost:3000/sse/image-gen`,
    protocol: 'agui' as const,
    stream: true,
    onComplete: (isAborted: boolean) => {
      if (isAborted) {
        return { status: 'stop' };
      }
    },
    onError: (err: Error | Response) => {
      console.error('图片生成服务错误:', err);
    },
    onRequest: (innerParams: ChatRequestParams) => {
      const { prompt, toolCallMessage } = innerParams;
      return {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: 'image_gen_uid',
          prompt,
          toolCallMessage,
        }),
      };
    },
  });

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: createChatServiceConfig(),
  });

  const senderLoading = useMemo(() => status === 'pending' || status === 'streaming', [status]);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: { variant: 'base', placement: 'right' },
    assistant: {
      placement: 'left',
      handleActions: {
        suggestion: (data) => {
          setInputValue(data.content.prompt);
        },
      }
    },
  };

  // 操作栏配置
  const getActionBar = (isLast: boolean): TdChatActionsName[] => {
    const actions: TdChatActionsName[] = ['good', 'bad'];
    if (isLast) actions.unshift('replay');
    return actions;
  };

  // 操作处理
  const handleAction = (name: string) => {
    if (name === 'replay') {
      chatEngine.regenerateAIMessage();
    }
  };

  // 处理工具调用响应（如果需要交互式工具）
  const handleToolCallRespond = async <T extends object = any>(toolcall: ToolCall, response: T) => {
    const tools = chatEngine.getToolcallByName(toolcall.toolCallName) || {};
    await chatEngine.sendAIMessage({
      params: {
        prompt: inputValue,
        toolCallMessage: { ...tools, result: JSON.stringify(response) },
      },
      sendRequest: true,
    });
  };

  // 渲染消息内容
  const renderMessageContent = (item: AIMessageContent, index: number, isLast: boolean): ReactNode => {
    if (item.type === 'suggestion' && !isLast) {
      return <div slot={`${item.type}-${index}`} key={`suggestion-${index}`} />;
    }
    if (item.type === 'toolcall' && item.data) {
      return (
        <div slot={`${item.type}-${index}`} key={`toolcall-${index}`}>
          <ToolCallRenderer toolCall={item.data} onRespond={handleToolCallRespond} />
        </div>
      );
    }
    return null;
  };

  // 渲染消息体
  const renderMsgContents = (message: ChatMessagesData, isLast: boolean): ReactNode => (
    <>
      {message.content?.map((item, index) => renderMessageContent(item, index, isLast))}
      {isAIMessage(message) && message.status === 'complete' ? (
        <ChatActionBar
          slot="actionbar"
          actionBar={getActionBar(isLast)}
          handleAction={handleAction}
        />
      ) : (
        isLast && message.status !== 'stop' && (
          <div slot="actionbar">
            <ChatLoading animation="dot" />
          </div>
        )
      )}
    </>
  );

  // 发送消息
  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    await chatEngine.sendUserMessage({ prompt: e.detail.value });
    setInputValue('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ChatList ref={listRef}>
        {messages.map((message, idx) => (
          <ChatMessage key={message.id} {...messageProps[message.role]} message={message as any}>
            {renderMsgContents(message, idx === messages.length - 1)}
          </ChatMessage>
        ))}
      </ChatList>
      <ChatSender
        value={inputValue}
        placeholder="请描述您想要生成的图片，例如：赛博朋克风格的城市夜景"
        loading={senderLoading}
        onChange={(e) => setInputValue(e.detail)}
        onSend={handleSend as any}
        onStop={() => chatEngine.abortChat()}
      />
    </div>
  );
}
