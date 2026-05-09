import reactify from '../_util/reactify';

import type { TdChatSenderProps } from 'tdesign-web-components';

import 'tdesign-web-components/lib/chat-sender';

export const ChatSender: React.ForwardRefExoticComponent<
  Omit<TdChatSenderProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSenderProps>('t-chat-sender');

export default ChatSender;
export type * from 'tdesign-web-components/lib/chat-sender/type';
