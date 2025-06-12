import 'tdesign-web-components/lib/chatbot';
import 'tdesign-web-components/lib/chat-message/content/search-content';
import 'tdesign-web-components/lib/chat-message/content/suggestion-content';
import type {
  TdChatbotApi,
  TdChatListApi,
  TdChatListProps,
  TdChatProps,
  TdChatSearchContentProps,
  TdChatSuggestionContentProps,
} from 'tdesign-web-components';
import reactify from '../_util/reactify';

export * from './useChat';

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

export { ChatBot, ChatSearchContent, ChatSuggestionContent, ChatList };

export * from 'tdesign-web-components/lib/chatbot/core/utils';
export type * from 'tdesign-web-components/lib/chatbot/type';
