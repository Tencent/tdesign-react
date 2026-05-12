import reactify from '../_util/reactify';

import type { TdChatMessageProps } from 'tdesign-web-components';

import 'tdesign-web-components/lib/chat-message';

export const ChatMessage: React.ForwardRefExoticComponent<
  Omit<TdChatMessageProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatMessageProps>('t-chat-item', 'ChatMessage');

export default ChatMessage;

export type { TdChatMessageProps } from 'tdesign-web-components';
