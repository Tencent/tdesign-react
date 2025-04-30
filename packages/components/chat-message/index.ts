import { type TdChatItemProps } from '@tencent/tdesign-chatbot';
import '@tencent/tdesign-chatbot/lib/style/index.css';
import reactify from '../_util/reactify';

export const ChatMessage: React.ForwardRefExoticComponent<
  Omit<TdChatItemProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatItemProps>('t-chat-item');

export default ChatMessage;
