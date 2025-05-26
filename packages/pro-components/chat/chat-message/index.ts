import { type TdChatItemProps } from 'tdesign-web-components';
import 'tdesign-web-components/lib/chat-message';
import reactify from '../_util/reactify';

export const ChatMessage: React.ForwardRefExoticComponent<
  Omit<TdChatItemProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatItemProps>('t-chat-item');

export default ChatMessage;

export type { TdChatItemProps } from 'tdesign-web-components';
