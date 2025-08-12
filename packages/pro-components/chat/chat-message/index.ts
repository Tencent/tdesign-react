import { type TdChatMessageProps } from '@tencent/tdesign-webc-test';
import '@tencent/tdesign-webc-test/lib/chat-message';
import reactify from '../_util/reactify';

export const ChatMessage: React.ForwardRefExoticComponent<
  Omit<TdChatMessageProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatMessageProps>('t-chat-item');

export default ChatMessage;

export type { TdChatMessageProps } from '@tencent/tdesign-webc-test';
