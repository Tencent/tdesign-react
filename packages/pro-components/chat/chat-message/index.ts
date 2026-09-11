import '@tdesign/web-components-chat/chat-message';

import reactify from '../_util/reactify';

import type { TdChatMessageProps } from '@tdesign/web-components-chat';

export const ChatMessage: React.ForwardRefExoticComponent<
  Omit<TdChatMessageProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatMessageProps>('t-chat-item', 'ChatMessage');

export default ChatMessage;

export type {
  TdChatAttachmentContentProps,
  TdChatContentMDOptions,
  TdChatContentMDPluginConfig,
  TdChatContentMDPresetConfig,
  TdChatContentMDPresetPlugin,
  TdChatMarkdownContentProps,
  TdChatMessageAction,
  TdChatMessageActionData,
  TdChatMessageActionDataMap,
  TdChatMessageActionHandlers,
  TdChatMessageActionName,
  TdChatMessageProps,
  TdChatMessageVariant,
  TdChatSearchContentProps,
  TdChatSuggestionContentProps,
  TdChatThinkContentProps,
} from '@tdesign/web-components-chat/chat-message';
