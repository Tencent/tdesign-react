import '@tencent/tdesign-chatbot/lib/chatbot';
import '@tencent/tdesign-chatbot/lib/chat-message/content/search-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/suggestion-content';
import '@tencent/tdesign-chatbot/lib/chat-message/content/markdown-content';
import '@tencent/tdesign-chatbot/lib/style/index.css';
import {
  TdChatProps,
  TdChatSearchContentProps,
  TdChatSuggestionContentProps,
  TdChatMarkdownContentProps,
  TdChatbotApi,
} from '@tencent/tdesign-chatbot';
import { TdChatActionProps } from '@tencent/tdesign-chatbot/lib/chat-action';
import { TdAttachmentsProps } from '@tencent/tdesign-chatbot/lib/attachments';
import { TdFileCardProps } from '@tencent/tdesign-chatbot/lib/filecard';
import reactify from '../_util/reactify';

const ChatBot: React.ForwardRefExoticComponent<
  Omit<TdChatProps & TdChatbotApi, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatProps>('t-chatbot');

const ChatActionBar: React.ForwardRefExoticComponent<
  Omit<TdChatActionProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatActionProps>('t-chat-action');

const Attachments: React.ForwardRefExoticComponent<
  Omit<TdAttachmentsProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdAttachmentsProps>('t-attachments');

const Filecard: React.ForwardRefExoticComponent<
  Omit<TdFileCardProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdFileCardProps>('t-filecard');

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
  ChatActionBar,
  Attachments,
  Filecard,
  ChatSearchContent,
  ChatSuggestionContent,
  ChatMarkdownContent,
};

export type * from '@tencent/tdesign-chatbot';
