import React, { createContext, useContext } from 'react';

type Role = 'user' | 'assistant' | 'error' | 'model-change' | 'system';

const ChatItemContext = createContext<{
  role: Role;
}>({
  role: 'user',
});

export const useChatItemContext = () => useContext(ChatItemContext);

interface TdChatItemProvider {
  children: React.ReactNode;
  value: {
    role: Role;
  };
}

const ChatItemProvider: React.FC<TdChatItemProvider> = (props) => {
  const { value, children } = props;

  return <ChatItemContext.Provider value={value}>{children}</ChatItemContext.Provider>;
};

export default ChatItemProvider;
