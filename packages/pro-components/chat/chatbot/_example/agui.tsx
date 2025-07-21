import React, { ReactNode, useMemo, useRef, useState } from 'react';
import {
  type TdChatMessageConfig,
  type ChatRequestParams,
  type ChatMessagesData,
  type ChatBaseContent,
  ChatList,
  ChatSender,
  ChatMessage,
  TdChatListApi,
  TdChatSenderApi,
  ChatActionBar,
  isAIMessage,
  useChat,
} from '@tdesign-react/aigc';
import { getMessageContentForCopy, TdChatActionsName, TdChatSenderParams } from 'tdesign-web-components';
import mockData from './mock/data';

export default function ComponentsBuild() {
  const listRef = useRef<TdChatListApi>(null);
  const inputRef = useRef<TdChatSenderApi>(null);
  const [inputValue, setInputValue] = useState<string>('南极的自动提款机叫什么名字');
  const { chatEngine, messages, status } = useChat({
    defaultMessages: mockData.normal,
    // 聊天服务配置
    chatServiceConfig: {
      // 对话服务地址
      endpoint: `http://127.0.0.1:3000/sse/agui`,
      // endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agent`,
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
      onAbort: async () => {},
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
          maxHeight: 100,
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
        console.log('自定义重新回复');
        chatEngine.regenerateAIMessage();
        return;
      }
      default:
        console.log('触发action', name, 'data', data);
    }
  };

  /** 渲染消息内容体 */
  const renderMsgContents = (message: ChatMessagesData, isLast: boolean): ReactNode => (
    <>
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
    chatEngine.abortChat();
  };

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <ChatList ref={listRef} style={{ width: '100%' }}>
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
