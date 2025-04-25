import '@tencent/tdesign-chatbot/lib/chatbot';
import '@tencent/tdesign-chatbot/lib/chat-message/content/thinking-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/search-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/suggestion-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/markdown-content';
import '@tencent/tdesign-chatbot/lib/style/index.css';
import {
  TdChatProps,
  TdChatThinkContentProps,
  TdChatSearchContentProps,
  TdChatSuggestionContentProps,
  TdChatMarkdownContentProps,
  TdChatSenderProps,
} from '@tencent/tdesign-chatbot';
import { TdChatLoadingProps } from '@tencent/tdesign-chatbot/lib/chat-loading';
import { TdChatActionProps } from '@tencent/tdesign-chatbot/lib/chat-action';
import { TdAttachmentsProps } from '@tencent/tdesign-chatbot/lib/attachments';
import { TdFileCardProps } from '@tencent/tdesign-chatbot/lib/filecard';
import reactify from '../_util/reactify';

const ChatBot: React.ForwardRefExoticComponent<
  Omit<TdChatProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatProps>('t-chatbot');

const ChatSender: React.ForwardRefExoticComponent<
  Omit<TdChatSenderProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSenderProps>('t-chat-sender');

const ChatActionBar: React.ForwardRefExoticComponent<
  Omit<TdChatActionProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatActionProps>('t-chat-action');

const ChatLoading: React.ForwardRefExoticComponent<
  Omit<TdChatLoadingProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatLoadingProps>('t-chat-loading');

const Attachments: React.ForwardRefExoticComponent<
  Omit<TdAttachmentsProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdAttachmentsProps>('t-attachments');

const Filecard: React.ForwardRefExoticComponent<
  Omit<TdFileCardProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdFileCardProps>('t-filecard');

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

export {
  ChatBot,
  ChatSender,
  ChatActionBar,
  ChatLoading,
  Attachments,
  Filecard,
  ChatThinkContent,
  ChatSearchContent,
  ChatSuggestionContent,
  ChatMarkdownContent,
};

export type * from '@tencent/tdesign-chatbot';
