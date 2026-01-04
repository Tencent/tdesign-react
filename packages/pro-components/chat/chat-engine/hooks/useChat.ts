import { useEffect, useRef, useState } from 'react';
import ChatEngine from 'tdesign-web-components/lib/chat-engine';
import type { ChatMessagesData, ChatServiceConfig, ChatStatus } from 'tdesign-web-components/lib/chat-engine';

export type IUseChat = {
  defaultMessages?: ChatMessagesData[];
  chatServiceConfig: ChatServiceConfig;
};

export const useChat = ({ defaultMessages: initialMessages, chatServiceConfig }: IUseChat) => {
  const [messages, setMessage] = useState<ChatMessagesData[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const chatEngineRef = useRef<ChatEngine>(new ChatEngine());
  const msgSubscribeRef = useRef<null | (() => void)>(null);
  const prevInitialMessagesRef = useRef<ChatMessagesData[]>([]);

  const chatEngine = chatEngineRef.current;

  const syncState = (state: ChatMessagesData[]) => {
    setMessage(state);
    setStatus(state.at(-1)?.status || 'idle');
  };

  const subscribeToChat = () => {
    // 清理之前的订阅
    msgSubscribeRef.current?.();

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

  // 初始化聊天引擎
  useEffect(() => {
    initChat();
    return () => msgSubscribeRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 监听 defaultMessages 变化
  useEffect(() => {
    // 检查 initialMessages 是否真的发生了变化
    const hasChanged = JSON.stringify(prevInitialMessagesRef.current) !== JSON.stringify(initialMessages);

    if (hasChanged && initialMessages && initialMessages.length > 0) {
      // 更新引用
      prevInitialMessagesRef.current = initialMessages;

      // 重新初始化聊天引擎或更新消息
      chatEngine.setMessages(initialMessages, 'replace');

      // 同步状态
      syncState(initialMessages);
    }
  }, [initialMessages, chatEngine]);

  return {
    chatEngine,
    messages,
    status,
  };
};
