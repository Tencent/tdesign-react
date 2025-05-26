import { useEffect, useRef, useState } from 'react';
import type { ChatMessagesData, ChatStatus } from 'tdesign-web-components/lib/chatbot/core/type';
import { TdChatProps } from 'tdesign-web-components';
import ChatEngine from 'tdesign-web-components/lib/chatbot/core';

// @ts-ignore
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
    // @ts-ignore
    chatEngine.init(chatServiceConfig, initialMessages);
    // @ts-ignore
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
