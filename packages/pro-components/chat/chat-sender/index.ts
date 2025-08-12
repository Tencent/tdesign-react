import { TdChatSenderProps } from '@tencent/tdesign-webc-test';
import '@tencent/tdesign-webc-test/lib/chat-sender';
import reactify from '../_util/reactify';

export const ChatSender: React.ForwardRefExoticComponent<
  Omit<TdChatSenderProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSenderProps>('t-chat-sender');

export default ChatSender;
export type * from '@tencent/tdesign-webc-test/lib/chat-sender/type';
