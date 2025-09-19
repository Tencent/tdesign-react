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
  const reqParamsRef = useRef<{ think: boolean; search: boolean }>({ think: false, search: false });

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
        senderProps={{
          placeholder: '有问题，尽管问～ Enter 发送，Shift+Enter 换行',
        }}
        chatServiceConfig={chatServiceConfig}
      ></ChatBot>
    </div>
  );
}
