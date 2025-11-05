import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { InternetIcon } from 'tdesign-icons-react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  ChatActionBar,
  ChatLoading,
  useChat,
  isAIMessage,
  getMessageContentForCopy,
  type SSEChunkData,
  type AIMessageContent,
  type ChatMessagesData,
  type ChatRequestParams,
  type TdChatSenderParams,
  type TdChatActionsName,
} from '@tdesign-react/chat';
import { Avatar, Button, Space } from 'tdesign-react';

/**
 * 综合示例
 * 
 * 本示例展示如何综合使用多个功能：
 * - 初始消息和建议问题
 * - 消息配置（样式、操作按钮）
 * - 数据转换（思考过程、搜索结果、文本）
 * - 请求配置（自定义参数）
 * - 实例方法（重新生成、填充提示语）
 * - 自定义插槽（输入框底部区域）
 */
export default function Comprehensive() {
  const [inputValue, setInputValue] = useState('');
  const [activeR1, setR1Active] = useState(true);
  const [activeSearch, setSearchActive] = useState(true);
  const reqParamsRef = useRef<{ think: boolean; search: boolean }>({ think: false, search: false });

  // 默认初始化消息
  const defaultMessages: ChatMessagesData[] = [
    {
      id: '123',
      role: 'assistant',
      content: [
        {
          type: 'text',
          status: 'complete',
          data: '欢迎使用TDesign Chatbot智能助手，你可以这样问我：',
        },
        {
          type: 'suggestion',
          status: 'complete',
          data: [
            {
              title: '南极的自动提款机叫什么名字',
              prompt: '南极的自动提款机叫什么名字？',
            },
            {
              title: '南极自动提款机在哪里',
              prompt: '南极自动提款机在哪里',
            },
          ],
        },
      ],
    },
  ];

  const { chatEngine, messages, status } = useChat({
    defaultMessages,
    chatServiceConfig: {
      // 对话服务地址
      endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal`,
      stream: true,

      // 流式对话结束
      onComplete: (aborted: boolean, params: RequestInit) => {
        console.log('onComplete', aborted, params);
      },

      // 流式对话过程中出错
      onError: (err: Error | Response) => {
        console.error('Chatservice Error:', err);
      },

      // 用户主动结束对话
      onAbort: async () => {},

      // 自定义流式数据结构解析
      onMessage: (chunk: SSEChunkData): AIMessageContent | null => {
        const { type, ...rest } = chunk.data;
        switch (type) {
          case 'search':
            // 搜索
            return {
              type: 'search',
              data: {
                title: rest.title || `搜索到${rest?.docs?.length || 0}条内容`,
                references: rest?.content,
              },
            };
          // 思考
          case 'think':
            return {
              type: 'thinking',
              status: /耗时/.test(rest?.title) ? 'complete' : 'streaming',
              data: {
                title: rest.title || '深度思考中',
                text: rest.content || '',
              },
            };
          // 正文
          case 'text':
            return {
              type: 'markdown',
              data: rest?.msg || '',
            };
        }
        return null;
      },

      // 自定义请求参数
      onRequest: (innerParams: ChatRequestParams) => {
        const { prompt } = innerParams;
        return {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            uid: 'tdesign-chat',
            prompt,
            ...reqParamsRef.current,
          }),
        };
      },
    },
  });

  // 更新请求参数
  useEffect(() => {
    reqParamsRef.current = {
      think: activeR1,
      search: activeSearch,
    };
  }, [activeR1, activeSearch]);

  // 操作按钮配置
  const getActionBar = (message: ChatMessagesData, isLast: boolean): TdChatActionsName[] => {
    const actions: TdChatActionsName[] = ['copy', 'good', 'bad'];
    if (isLast) {
      actions.push('replay');
    }
    return actions;
  };

  // 消息内容操作回调（用于 ChatMessage）
  const handleMsgActions = {
    suggestion: (data?: any) => {
      console.log('点击建议问题', data);
      // 点建议问题自动填入输入框
      setInputValue(data?.content?.prompt || '');
      // 也可以点建议问题直接发送消息
      // chatEngine.sendUserMessage({ prompt: data.content.prompt });
    },
  };

  // 底部操作栏处理（用于 ChatActionBar）
  const handleAction = (name: string, data?: any) => {
    console.log('触发操作栏action', name, 'data', data);
    switch (name) {
      case 'copy':
        console.log('复制');
        break;
      case 'good':
        console.log('点赞', data);
        break;
      case 'bad':
        console.log('点踩', data);
        break;
      case 'replay':
        console.log('重新生成');
        chatEngine.regenerateAIMessage();
        break;
      default:
        console.log('其他操作', name, data);
    }
  };

  // 渲染消息内容
  const renderMessageContent = (message: ChatMessagesData, isLast: boolean): ReactNode => {
    if (isAIMessage(message) && message.status === 'complete') {
      return (
        <ChatActionBar
          slot="actionbar"
          actionBar={getActionBar(message, isLast)}
          handleAction={handleAction}
          copyText={getMessageContentForCopy(message)}
        />
      );
    }
    return <ChatLoading animation="dot" />;
  };

  // 发送消息
  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <ChatList style={{ flex: 1 }}>
        {messages.map((message, idx) => {
          const isLast = idx === messages.length - 1;
          // 假设只有单条thinking
          const thinking = message.content.find((item) => item.type === 'thinking');

          // 根据角色配置消息样式
          if (message.role === 'user') {
            return (
              <ChatMessage
                key={message.id}
                message={message}
                variant="base"
                placement="right"
                avatar={<Avatar image="https://tdesign.gtimg.com/site/avatar.jpg" />}
              />
            );
          }

          // AI 消息配置
          return (
            <ChatMessage
              key={message.id}
              message={message}
              placement="left"
              handleActions={handleMsgActions}
              chatContentProps={{
                thinking: {
                  maxHeight: 100, // 思考框最大高度，超过会自动滚动
                  layout: 'block', // 思考内容样式，border|block
                  collapsed: thinking?.status === 'complete', // 是否折叠，这里设置内容输出完成后折叠
                },
              }}
            >
              {renderMessageContent(message, isLast)}
            </ChatMessage>
          );
        })}
      </ChatList>

      <ChatSender
        value={inputValue}
        placeholder="有问题，尽管问～ Enter 发送，Shift+Enter 换行"
        loading={status === 'pending' || status === 'streaming'}
        onChange={(e) => setInputValue(e.detail)}
        onSend={handleSend}
        onStop={() => chatEngine.abortChat()}
      >
        {/* 自定义输入框底部区域slot，可以增加模型选项 */}
        <div slot="footer-prefix">
          <Space align="center" size="small">
            <Button
              variant="outline"
              shape="round"
              theme={activeR1 ? 'primary' : 'default'}
              size="small"
              onClick={() => setR1Active(!activeR1)}
            >
              R1.深度思考
            </Button>
            <Button
              variant="outline"
              theme={activeSearch ? 'primary' : 'default'}
              icon={<InternetIcon />}
              size="small"
              shape="round"
              onClick={() => setSearchActive(!activeSearch)}
            >
              联网查询
            </Button>
          </Space>
        </div>
      </ChatSender>
    </div>
  );
}
