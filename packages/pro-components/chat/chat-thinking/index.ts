import reactify from '../_util/reactify';

import type { TdChatThinkContentProps } from 'tdesign-web-components';

import 'tdesign-web-components/lib/chat-message/content/thinking-content';

const ChatThinkContent: React.ForwardRefExoticComponent<
  Omit<TdChatThinkContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatThinkContentProps>('t-chat-thinking-content');

export const ChatThinking = ChatThinkContent;

export default ChatThinking;

export type { TdChatThinkContentProps } from 'tdesign-web-components';
