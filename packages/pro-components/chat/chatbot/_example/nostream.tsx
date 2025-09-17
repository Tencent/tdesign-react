import React, { useEffect, useRef, useState } from 'react';
import { InternetIcon } from 'tdesign-icons-react';
import {
  TdChatMessageConfigItem,
  ChatRequestParams,
  ChatMessagesData,
  ChatServiceConfig,
  ChatBot,
  type TdChatbotApi,
} from '@tdesign-react/chat';
import { Button, Space } from 'tdesign-react';

export default function chatSample() {
  const chatRef = useRef<HTMLElement & TdChatbotApi>(null);
  const [activeR1, setR1Active] = useState(false);
  const [activeSearch, setSearchActive] = useState(false);
  const [ready, setReady] = useState(false);
  const reqParamsRef = useRef<{ think: boolean; search: boolean }>({ think: false, search: false });

  // 消息属性配置
  const messageProps = (msg: ChatMessagesData): TdChatMessageConfigItem => {
    const { role, content } = msg;
    if (role === 'user') {
      return {
        variant: 'base',
        placement: 'right',
        avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      };
    }
    if (role === 'assistant') {
      return {
        placement: 'left',
        actions: ['replay', 'copy', 'good', 'bad'],
        handleActions: {
          // 处理消息操作回调
          good: async ({ message, active }) => {
            // 点赞
            console.log('点赞', message, active);
          },
          bad: async ({ message, active }) => {
            // 点踩
            console.log('点踩', message, active);
          },
          replay: ({ message, active }) => {
            console.log('自定义重新回复', message, active);
            chatRef?.current?.regenerate();
          },
          suggestion: ({ content }) => {
            console.log('点击建议问题', content);
            chatRef?.current?.sendUserMessage({ prompt: content.prompt });
          },
        },
      };
    }
  };

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    // 对话服务地址
    endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/fetch/normal`,
    stream: false,
    // 流式对话结束（aborted为true时，表示用户主动结束对话，params为请求参数）
    onComplete: (isAborted, req, result) => {
      console.log('onComplete', isAborted, req, result);
      return {
        type: 'text',
        data: result.data,
      };
    },
    // 流式对话过程中出错业务自定义行为
    onError: (err: Error | Response) => {
      console.error('Chatservice Error:', err);
    },
    // 流式对话过程中用户主动结束对话业务自定义行为
    onAbort: async () => {
      chatRef.current?.sendSystemMessage('用户已暂停');
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
  };

  useEffect(() => {
    reqParamsRef.current = {
      think: activeR1,
      search: activeSearch,
    };
  }, [activeR1, activeSearch]);

  return (
    <div style={{ height: '600px' }}>
      <ChatBot
        ref={chatRef}
        defaultMessages={[]}
        messageProps={messageProps}
        senderProps={{
          placeholder: '有问题，尽管问～ Enter 发送，Shift+Enter 换行',
        }}
        chatServiceConfig={chatServiceConfig}
        onChatReady={(e) => {
          setReady(true);
        }}
      ></ChatBot>
    </div>
  );
}
