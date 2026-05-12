import 'tdesign-web-components/lib/chatbot';
import 'tdesign-web-components/lib/chat-message/content/reasoning-content';
import 'tdesign-web-components/lib/chat-message/content/search-content';
import 'tdesign-web-components/lib/chat-message/content/suggestion-content';

import reactify from '../_util/reactify';

import type {
  TdChatbotApi,
  TdChatListApi,
  TdChatListProps,
  TdChatProps,
  TdChatSearchContentProps,
  TdChatSuggestionContentProps,
} from 'tdesign-web-components';

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
export { ChatBot, ChatList, ChatSearchContent, ChatSuggestionContent };

// 导出类型和工具
export type * from 'tdesign-web-components/lib/chatbot/type';
