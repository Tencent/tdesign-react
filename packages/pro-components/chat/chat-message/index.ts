import { type TdChatMessageProps } from '@tdesign/web-components-chat';
import '@tdesign/web-components-chat/lib/chat-message';
import reactify from '../_util/reactify';

export const ChatMessage: React.ForwardRefExoticComponent<
  Omit<TdChatMessageProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatMessageProps>('t-chat-item', 'ChatMessage');

export default ChatMessage;

export type { TdChatMessageProps } from '@tdesign/web-components-chat';
