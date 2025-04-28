import '@tencent/tdesign-chatbot/lib/chatbot';
import '@tencent/tdesign-chatbot/lib/chat-message/content/search-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/suggestion-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/markdown-content';
import '@tencent/tdesign-chatbot/lib/style/index.css';
import { TdChatProps, TdChatSearchContentProps, TdChatSuggestionContentProps } from '@tencent/tdesign-chatbot';
import reactify from '../_util/reactify';

const ChatBot: React.ForwardRefExoticComponent<
  Omit<TdChatProps & TdChatbotApi, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatProps>('t-chatbot');

const ChatSearchContent: React.ForwardRefExoticComponent<
  Omit<TdChatSearchContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSearchContentProps>('t-chat-search-content');

const ChatSuggestionContent: React.ForwardRefExoticComponent<
  Omit<TdChatSuggestionContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSuggestionContentProps>('t-chat-suggestion-content');

export { ChatBot, ChatSearchContent, ChatSuggestionContent };
export type * from '@tencent/tdesign-chatbot/lib/chatbot/type';
