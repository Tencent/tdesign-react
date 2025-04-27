import { TdChatSenderProps } from '@tencent/tdesign-chatbot';
import reactify from '../_util/reactify';

export const ChatSender: React.ForwardRefExoticComponent<
  Omit<TdChatSenderProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSenderProps>('t-chat-sender');

export default ChatSender;
export type { TdChatSenderProps } from '@tencent/tdesign-chatbot';
