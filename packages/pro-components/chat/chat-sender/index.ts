import { TdChatSenderProps } from '@tdesign/web-components-chat';
import '@tdesign/web-components-chat/lib/chat-sender';
import reactify from '../_util/reactify';

export const ChatSender: React.ForwardRefExoticComponent<
  Omit<TdChatSenderProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSenderProps>('t-chat-sender');

export default ChatSender;
export type * from '@tdesign/web-components-chat/lib/chat-sender/type';
