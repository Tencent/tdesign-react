import React, { ReactNode, useMemo, useRef, useState } from 'react';
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
  TdChatSenderApi,
  ChatActionBar,
  isAIMessage,
  getMessageContentForCopy,
  AGUIAdapter,
} from '@tdesign-react/chat';
import { Button, Space, MessagePlugin } from 'tdesign-react';
import { useChat } from '../index';
import CustomToolCallRenderer from './components/Toolcall';

export default function ComponentsBuild() {
  const listRef = useRef<TdChatListApi>(null);
  const inputRef = useRef<TdChatSenderApi>(null);
  const [inputValue, setInputValue] = useState<string>('AG-UI协议的作用是什么');
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    // 聊天服务配置
    chatServiceConfig: {
      // 对话服务地址
      endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agui-simple`,
      // 开启agui协议解析支持
      protocol: 'agui',
      stream: true,
      onStart: (chunk) => {
        console.log('onStart', chunk);
      },
      // 流式对话结束（aborted为true时，表示用户主动结束对话，params为请求参数）
      onComplete: (aborted: boolean, params: RequestInit, event) => {
        console.log('onComplete', aborted, params, event);
      },
      // 流式对话过程中出错业务自定义行为
      onError: (err: Error | Response) => {
        console.error('Chatservice Error:', err);
      },
      // 流式对话过程中用户主动结束对话业务自定义行为
      onAbort: async () => '',
      // 自定义请求参数
      onRequest: (innerParams: ChatRequestParams) => {
        const { prompt } = innerParams;
        return {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            uid: 'agent_uid',
            prompt,
          }),
        };
      },
    },
  });

  const senderLoading = useMemo(() => {
    if (status === 'pending' || status === 'streaming') {
      return true;
    }
    return false;
  }, [status]);

  // 加载历史消息
  const loadHistoryMessages = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/conversation/history?type=simple`);
      const result = await response.json();
      if (result.success && result.data) {
        const messages = AGUIAdapter.convertHistoryMessages(result.data);
        chatEngine.setMessages(messages);
        listRef.current?.scrollList({ to: 'bottom' });
      }
    } catch (error) {
      console.error('加载历史消息出错:', error);
      MessagePlugin.error('加载历史消息出错');
    } finally {
      setLoadingHistory(false);
    }
  };

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
    },
    assistant: {
      placement: 'left',
      // 内置的消息渲染配置
      chatContentProps: {
        thinking: {
          maxHeight: 300,
        },
        reasoning: {
          maxHeight: 300,
          defaultCollapsed: false,
        },
      },
    },
  };

  const getChatActionBar = (isLast: boolean) => {
    let filterActions = ['replay', 'good', 'bad', 'copy'];
    if (!isLast) {
      // 只有最后一条AI消息才能重新生成
      filterActions = filterActions.filter((item) => item !== 'replay');
    }
    return filterActions;
  };

  const actionHandler = (name: string, data?: any) => {
    switch (name) {
      case 'replay': {
        chatEngine.regenerateAIMessage();
        return;
      }
      default:
        console.log('触发action', name, 'data', data);
    }
  };

  /** 渲染消息内容体 */
  const renderMsgContents = (message: ChatMessagesData, isLast: boolean): ReactNode => {
    const contentElements = message.content?.map((item, index) => {
      const { data, type } = item;

      if (type === 'reasoning') {
        // reasoning 类型包含一个 data 数组，需要遍历渲染每个子项
        return data.map((subItem: any, subIndex: number) => {
          if (subItem.type === 'toolcall') {
            return (
              <div
                slot={`reasoning-toolcall-${subIndex}`}
                key={`toolcall-${index}-${subIndex}`}
                className="toolcall-wrapper"
              >
                <CustomToolCallRenderer toolCall={subItem.data} status={subItem.status} />
              </div>
            );
          }
          return null;
        });
      }

      return null;
    });

    return (
      <>
        {contentElements}
        {isAIMessage(message) && message.status === 'complete' ? (
          <ChatActionBar
            slot="actionbar"
            actionBar={getChatActionBar(isLast) as TdChatActionsName[]}
            handleAction={actionHandler}
            copyText={getMessageContentForCopy(message)}
            comment={message.role === 'assistant' ? message.comment : undefined}
          />
        ) : null}
      </>
    );
  };

  const sendUserMessage = async (requestParams: ChatRequestParams) => {
    await chatEngine.sendUserMessage(requestParams);
    listRef.current?.scrollList({ to: 'bottom' });
  };

  const inputChangeHandler = (e: CustomEvent) => {
    setInputValue(e.detail);
  };

  const sendHandler = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    const params = {
      prompt: value,
    };
    await sendUserMessage(params);
    setInputValue('');
  };

  const stopHandler = () => {
    console.log('stopHandler');
    chatEngine.abortChat();
  };

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* 历史消息加载控制栏 */}
      <div style={{ padding: '12px', borderBottom: '1px solid #e7e7e7', backgroundColor: '#fafafa' }}>
        <Space>
          <Button size="small" onClick={loadHistoryMessages} loading={loadingHistory}>
            加载历史消息
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              chatEngine.clearMessages();
              MessagePlugin.success('已清空消息');
            }}
          >
            清空消息
          </Button>
        </Space>
      </div>

      <ChatList ref={listRef} style={{ width: '100%', flex: 1 }}>
        {messages.map((message, idx) => (
          <ChatMessage key={message.id} {...messageProps[message.role]} message={message}>
            {renderMsgContents(message, idx === messages.length - 1)}
          </ChatMessage>
        ))}
      </ChatList>
      <ChatSender
        ref={inputRef}
        value={inputValue}
        placeholder="请输入内容"
        loading={senderLoading}
        onChange={inputChangeHandler}
        onSend={sendHandler}
        onStop={stopHandler}
      ></ChatSender>
    </div>
  );
}
