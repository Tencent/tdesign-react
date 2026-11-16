import '@tdesign/web-components-chat/chatbot';
import '@tdesign/web-components-chat/chat-message';

import reactify from '../_util/reactify';

import type {
  TdChatbotApi,
  TdChatListApi,
  TdChatListProps,
  TdChatProps,
  TdChatSearchContentProps,
  TdChatSuggestionContentProps,
} from '@tdesign/web-components-chat';

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

// 导出 chatbot 相关类型（收窄范围，避免透传主入口导致跨子模块类型冲突）
export type {
  BackBottomParams,
  FetchSSEOptions,
  Layout,
  MetaData,
  ModelRoleEnum,
  ScrollPosition,
  SSEEvent,
  TdChatbotApi,
  TdChatCodeProps,
  TdChatInjectCSS,
  TdChatListApi,
  TdChatListProps,
  TdChatListScrollToOptions,
  TdChatMessageActionEvent,
  TdChatMessageConfig,
  TdChatMessageConfigItem,
  TdChatProps,
} from '@tdesign/web-components-chat';
