import { useEffect, useRef, useState } from 'react';
import type { ChatMessagesData, ChatStatus } from '@tencent/tdesign-chatbot/lib/chatbot/core/type';
import { TdChatProps } from '@tencent/tdesign-chatbot';
import ChatEngine from '@tencent/tdesign-chatbot/lib/chatbot/core';

export type IUseChat = Pick<TdChatProps, 'messages' | 'chatServiceConfig'>;

export const useChat = ({ messages: initialMessages, chatServiceConfig }: IUseChat) => {
  const [messages, setMessage] = useState<ChatMessagesData[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const chatEngineRef = useRef<ChatEngine>(new ChatEngine());
  const msgSubscribeRef = useRef<null | (() => void)>(null);

  const chatEngine = chatEngineRef.current;

  const syncState = (state: ChatMessagesData[]) => {
    setMessage(state);
    setStatus(state.at(-1)?.status || 'idle');
  };

  const subscribeToChat = () => {
    msgSubscribeRef.current = chatEngine.messageStore.subscribe((state) => {
      syncState(state.messages);
    });
  };

  const initChat = () => {
    chatEngine.init(chatServiceConfig, initialMessages);
    syncState(initialMessages);
    subscribeToChat();
  };

  useEffect(() => {
    initChat();

    return () => msgSubscribeRef.current?.();
  }, []);

  return {
    chatEngine,
    messages,
    status,
  };
};
