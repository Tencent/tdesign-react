import '@tencent/tdesign-chatbot/lib/chatbot';
import '@tencent/tdesign-chatbot/lib/chat-message/content/search-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/suggestion-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/markdown-content';
import '@tencent/tdesign-chatbot/lib/style/index.css';
import type {
  TdChatbotApi,
  TdChatListApi,
  TdChatListProps,
  TdChatProps,
  TdChatSearchContentProps,
  TdChatSuggestionContentProps,
} from '@tencent/tdesign-chatbot';
import reactify from '../_util/reactify';

export * from '@tencent/tdesign-chatbot/lib/chatbot/core/utils';

export * from './useChat';

const ChatBot: React.ForwardRefExoticComponent<
  Omit<TdChatProps & TdChatbotApi, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatProps>('t-chatbot');

const ChatSearchContent: React.ForwardRefExoticComponent<
  Omit<TdChatSearchContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSearchContentProps>('t-chat-search-content');

const ChatSuggestionContent: React.ForwardRefExoticComponent<
  Omit<TdChatSuggestionContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSuggestionContentProps>('t-chat-suggestion-content');

const ChatList: React.ForwardRefExoticComponent<
  Omit<TdChatListProps, 'ref'> & React.RefAttributes<HTMLElement | TdChatListApi | undefined>
> = reactify<TdChatProps>('t-chat-list');

export { ChatBot, ChatSearchContent, ChatSuggestionContent, ChatList };
// export type * from '@tencent/tdesign-chatbot/lib/chatbot/type';
