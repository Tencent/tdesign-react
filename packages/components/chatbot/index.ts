import '@tencent/tdesign-chatbot/lib/chatbot';
import '@tencent/tdesign-chatbot/lib/chat-message/content/thinking-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/search-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/suggestion-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/markdown-content';
import reactify from '../_util/reactify';
import '@tencent/tdesign-chatbot/lib/style/index.css';
import { TdChatProps } from '@tencent/tdesign-chatbot/lib/chatbot/type';
import { TdChatThinkContentProps } from '@tencent/tdesign-chatbot/lib/chat-message';
import { TdChatSearchContentProps } from '@tencent/tdesign-chatbot/lib/chat-message';
import { TdChatSuggestionContentProps } from '@tencent/tdesign-chatbot/lib/chat-message';
import { TdChatMarkdownContentProps } from '@tencent/tdesign-chatbot/lib/chat-message';

const ChatBot: React.ForwardRefExoticComponent<
  Omit<TdChatProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatProps>('t-chatbot');

const ChatThinkContent: React.ForwardRefExoticComponent<
  Omit<TdChatThinkContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatThinkContentProps>('t-chat-thinking-content');

const ChatSearchContent: React.ForwardRefExoticComponent<
  Omit<TdChatSearchContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSearchContentProps>('t-chat-search-content');

const ChatSuggestionContent: React.ForwardRefExoticComponent<
  Omit<TdChatSuggestionContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSuggestionContentProps>('t-chat-suggestion-content');

const ChatMarkdownContent: React.ForwardRefExoticComponent<
  Omit<TdChatMarkdownContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatMarkdownContentProps>('t-chat-md-content');

export { ChatBot, ChatThinkContent, ChatSearchContent, ChatSuggestionContent, ChatMarkdownContent };
export type * from '@tencent/tdesign-chatbot/lib/chatbot';
export type * from '@tencent/tdesign-chatbot/lib/chat-message';
