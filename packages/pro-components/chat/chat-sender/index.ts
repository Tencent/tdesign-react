import { TdChatSenderApi, TdChatSenderProps } from '@tencent/tdesign-chatbot';
import '@tencent/tdesign-chatbot/lib/style/index.css';
import reactify from '../_util/reactify';

export const ChatSender: React.ForwardRefExoticComponent<
  Omit<TdChatSenderProps & React.PropsWithChildren, 'ref'> &
    React.RefAttributes<HTMLElement | TdChatSenderApi | undefined>
> = reactify<TdChatSenderProps>('t-chat-sender');

export default ChatSender;
export type { TdChatSenderProps, TdChatSenderApi } from '@tencent/tdesign-chatbot';
