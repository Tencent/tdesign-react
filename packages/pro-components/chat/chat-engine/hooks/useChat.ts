import { useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import ChatEngine from '@tdesign/ai-chat-engine';

import type { ChatMessagesData, ChatServiceConfigSetter, ChatStatus } from '@tdesign/ai-chat-engine';

export type IUseChat = {
  defaultMessages?: ChatMessagesData[];
  chatServiceConfig: ChatServiceConfigSetter;
};

const emptyMessages: ChatMessagesData[] = [];
export const useChat = ({ defaultMessages = emptyMessages, chatServiceConfig }: IUseChat) => {
  const [chatEngine] = useState(() => new ChatEngine());
  const [messages, setMessages] = useState<ChatMessagesData[]>(defaultMessages);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<unknown>();
  const initial = useRef({ defaultMessages, chatServiceConfig });
  const lifetime = useRef({ generation: 0 });
  const previousMessages = useRef(defaultMessages);

  useEffect(() => {
    const owner = lifetime.current;
    owner.generation += 1;
    const { generation } = owner;
    let active = true;
    let unsubscribe: (() => void) | undefined;
    chatEngine
      .init(initial.current.chatServiceConfig, initial.current.defaultMessages)
      .then(() => {
        if (!active) return;
        const sync = () => setMessages(chatEngine.messages);
        unsubscribe = chatEngine.messageStore.subscribe(sync);
        sync();
        setReady(true);
      })
      .catch((reason) => {
        if (active) setError(reason);
      });
    return () => {
      active = false;
      unsubscribe?.();
      // StrictMode immediately repeats setup. A real unmount releases the engine
      // after that synchronous replay, while subscription cleanup is immediate.
      Promise.resolve().then(() => {
        if (owner.generation === generation) chatEngine.destroy();
      });
    };
  }, [chatEngine]);

  useEffect(() => {
    if (ready && !isEqual(previousMessages.current, defaultMessages)) {
      previousMessages.current = defaultMessages;
      chatEngine.setMessages(defaultMessages, 'replace');
    }
  }, [defaultMessages, ready, chatEngine]);

  const status: ChatStatus = messages[messages.length - 1]?.status || 'idle';
  return { chatEngine, messages, status, ready, error };
};
