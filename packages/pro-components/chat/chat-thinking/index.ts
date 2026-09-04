import '@tdesign/web-components-chat/chat-message';

import reactify from '../_util/reactify';

import type { TdChatThinkContentProps } from '@tdesign/web-components-chat/chat-message';

const ChatThinkContent: React.ForwardRefExoticComponent<
  Omit<TdChatThinkContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatThinkContentProps>('t-chat-thinking-content');

export const ChatThinking = ChatThinkContent;

export default ChatThinking;

export type { TdChatThinkContentProps } from '@tdesign/web-components-chat/chat-message';
