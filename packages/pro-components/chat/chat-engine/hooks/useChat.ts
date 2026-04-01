import React, { useEffect, useRef, useState } from 'react';
import ChatEngine from 'tdesign-web-components/lib/chat-engine';
import type { ChatMessagesData, ChatServiceConfig, ChatStatus } from 'tdesign-web-components/lib/chat-engine';
import { useChatPaging, UseChatPagingConfig } from './useChatPaging';

export type IUseChat = {
  defaultMessages?: ChatMessagesData[];
  chatServiceConfig: ChatServiceConfig | (() => ChatServiceConfig);
  /** 消息分页配置 */
  chatPagingConfig?: UseChatPagingConfig;
};

export const useChat = ({ defaultMessages: initialMessages, chatServiceConfig, chatPagingConfig }: IUseChat) => {
  const { pageSize } = chatPagingConfig || {};
  const [status, setStatus] = useState<ChatStatus>('idle');
  const chatEngineRef = useRef<ChatEngine>(new ChatEngine());
  const msgSubscribeRef = useRef<null | (() => void)>(null);
  const prevInitialMessagesRef = useRef<ChatMessagesData[]>([]);

  const chatEngine = chatEngineRef.current;

  // 分页逻辑委托给 useChatPaging
  const { messages, syncMessages, initPaging, chatListProps } = useChatPaging(
    chatEngineRef as React.MutableRefObject<{ messages: ChatMessagesData[] }>,
    { pageSize },
  );

  /** 同步状态：将 chatEngine 的消息同步到 React state */
  const syncState = (engineMessages: ChatMessagesData[]) => {
    syncMessages(engineMessages);
    setStatus(engineMessages.at(-1)?.status || 'idle');
  };

  const subscribeToChat = () => {
    msgSubscribeRef.current?.();
    msgSubscribeRef.current = chatEngine.messageStore.subscribe((state) => {
      syncState(state.messages);
    });
  };

  const initChat = () => {
    const msgs = initialMessages || [];

    // @ts-ignore
    chatEngine.init(chatServiceConfig, msgs);

    // 初始化分页并同步消息
    const visibleMessages = initPaging(msgs);
    setStatus(visibleMessages.at(-1)?.status || 'idle');

    subscribeToChat();
  };

  // 初始化聊天引擎
  useEffect(() => {
    initChat();
    return () => msgSubscribeRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 监听 defaultMessages 变化（非分页模式）
  useEffect(() => {
    if (pageSize) return;

    const hasChanged = JSON.stringify(prevInitialMessagesRef.current) !== JSON.stringify(initialMessages);

    if (hasChanged && initialMessages && initialMessages.length > 0) {
      prevInitialMessagesRef.current = initialMessages;
      chatEngine.setMessages(initialMessages, 'replace');
      syncState(initialMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessages, chatEngine, pageSize]);

  return {
    chatEngine,
    messages,
    status,
    /** 分页模式下传入 ChatList 的 props，直接展开即可：{...chatListProps} */
    chatListProps,
  };
};
