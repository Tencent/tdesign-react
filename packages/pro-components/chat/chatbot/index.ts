import '@tencent/tdesign-webc-test/lib/chatbot';
import '@tencent/tdesign-webc-test/lib/chat-message/content/reasoning-content';
import '@tencent/tdesign-webc-test/lib/chat-message/content/search-content';
import '@tencent/tdesign-webc-test/lib/chat-message/content/suggestion-content';
import type {
  TdChatbotApi,
  TdChatListApi,
  TdChatListProps,
  TdChatProps,
  TdChatSearchContentProps,
  TdChatSuggestionContentProps,
} from '@tencent/tdesign-webc-test';
import reactify from '../_util/reactify';
import ChatEngine from './core';

const ChatBot: React.ForwardRefExoticComponent<
  Omit<TdChatProps & Partial<TdChatbotApi>, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatProps>('t-chatbot');

const ChatSearchContent: React.ForwardRefExoticComponent<
  Omit<TdChatSearchContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSearchContentProps>('t-chat-search-content');

const ChatSuggestionContent: React.ForwardRefExoticComponent<
  Omit<TdChatSuggestionContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSuggestionContentProps>('t-chat-suggestion-content');

const ChatList: React.ForwardRefExoticComponent<
  Omit<TdChatListProps & Partial<TdChatListApi>, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatListProps>('t-chat-list');

// 导出组件
export { ChatBot, ChatSearchContent, ChatSuggestionContent, ChatList, ChatEngine };

// 导出类型和工具
export type * from '@tencent/tdesign-webc-test/lib/chatbot/type';
export * from './core';
export * from './hooks/useChat';
export * from './hooks/useAgentToolcall';
export * from './hooks/useAgentState';
export * from './components/toolcall';
export * from './components/provider/agent-state';
