import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { Avatar } from 'tdesign-react';
import {
  type SSEChunkData,
  type TdChatMessageConfig,
  type AIMessageContent,
  type ChatRequestParams,
  type ChatMessagesData,
  ChatList,
  ChatSender,
  ChatMessage,
  TdChatListApi,
  TdChatSenderApi,
  ChatActionBar,
  isAIMessage,
  getMessageContentForCopy,
  TdChatSenderParams,
} from '@tdesign-react/aigc';
import { useChat } from '../useChat';
import mockData from './mock/data';
import { EventType } from '../core/adapters/agui/events';

export default function ComponentsBuild() {
  const listRef = useRef<TdChatListApi>(null);
  const inputRef = useRef<TdChatSenderApi>(null);
  const [inputValue, setInputValue] = useState<string>('南极的自动提款机叫什么名字');
  const { chatEngine, messages, status } = useChat({
    defaultMessages: mockData.normal,
    // 聊天服务配置
    chatServiceConfig: {
      // 对话服务地址f
      endpoint: `http://127.0.0.1:3000/sse/agui`,
      stream: true,
      // 流式对话结束（aborted为true时，表示用户主动结束对话，params为请求参数）
      onComplete: (aborted: boolean, params: RequestInit) => {
        console.log('onComplete', aborted, params);
      },
      // 流式对话过程中出错业务自定义行为
      onError: (err: Error | Response) => {
        console.error('Chatservice Error:', err);
      },
      // 流式对话过程中用户主动结束对话业务自定义行为
      onAbort: async () => {
        console.log('中断');
      },
      onMessage: (chunk: SSEChunkData): AIMessageContent => {
        const { type, toolCallId, toolCallName, delta, title } = chunk.data;
        // switch (type) {
        //   case 'search':
        //     // 搜索
        //     return {
        //       type: 'search',
        //       data: {
        //         title: rest.title || `搜索到${rest?.docs.length}条内容`,
        //         references: rest?.content,
        //       },
        //     };
        //   // 思考
        //   case 'think':
        //     return {
        //       type: 'thinking',
        //       status: (status) => (/耗时/.test(rest?.title) ? 'complete' : status),
        //       data: {
        //         title: rest.title || '深度思考中',
        //         text: rest.content || '',
        //       },
        //     };
        //   // 正文
        //   case 'text':
        //     return {
        //       type: 'markdown',
        //       data: rest?.msg || '',
        //     };
        switch (type) {
          case 'TEXT_MESSAGE_START':
            return {
              type: 'markdown',
              status: 'streaming',
              data: '',
              strategy: 'append',
            };
          case 'TEXT_MESSAGE_CHUNK':
          case 'TEXT_MESSAGE_END':
            return {
              type: 'markdown',
              status: type === 'TEXT_MESSAGE_END' ? 'complete' : 'streaming',
              data: delta || '',
              strategy: 'merge',
            };
          case EventType.THINKING_START:
            return {
              type: 'thinking',
              data: { title: title || '思考中...' },
              status: 'streaming',
              strategy: 'append',
            };
          case EventType.THINKING_TEXT_MESSAGE_CONTENT:
            return { type: 'thinking', data: { text: delta }, status: 'streaming', strategy: 'merge' };
          case EventType.THINKING_END:
            return { type: 'thinking', data: { title: title || '思考结束' }, status: 'complete' };

          case EventType.TOOL_CALL_START:
          case EventType.TOOL_CALL_ARGS:
            this.toolCallMap[toolCallId] = {
              name: toolCallName,
              arguments: type === 'TOOL_CALL_ARGS' ? delta : '',
            };
            if (toolCallName === 'search') {
              return {
                type: 'search',
                data: {
                  title: '联网搜索中',
                  references: [],
                },
                status: 'pending',
              };
            }
            return null;
          case EventType.TOOL_CALL_CHUNK:
          case EventType.TOOL_CALL_RESULT:
            if (toolCallName === 'search') {
              let parsed = {
                title: '搜索中',
                references: [],
              };
              try {
                parsed = JSON.parse(delta || content);
              } catch {}
              return {
                type: 'search',
                data: parsed,
                status: type === 'TOOL_CALL_RESULT' ? 'complete' : 'streaming',
              };
            }
            return null;
          case EventType.RUN_ERROR:
            return [
              {
                type: 'text',
                data: 'Unknown error',
                status: 'error',
              },
            ];
        }
      },
      // 自定义请求参数
      onRequest: (innerParams: ChatRequestParams) => ({
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          uid: 'abcd',
          think: true,
          search: true,
          ...innerParams,
        }),
      }),
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
      avatar: <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg" />,
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
      abc: 1,
    };
    await sendUserMessage(params);
    setInputValue('');
  };

  const stopHandler = () => {
    chatEngine.abortChat();
  };

  const onScrollHandler = (e) => {
    // console.log('===scroll', e, e.detail);
  };

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <ChatList ref={listRef} style={{ width: '100%' }} onScroll={onScrollHandler}>
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
