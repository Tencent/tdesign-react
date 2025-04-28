import { TdChatLoadingProps } from '@tencent/tdesign-chatbot';
import reactify from '../_util/reactify';

export const ChatLoading: React.ForwardRefExoticComponent<
  Omit<TdChatLoadingProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatLoadingProps>('t-chat-loading');

export default ChatLoading;
export type { TdChatLoadingProps } from '@tencent/tdesign-chatbot';
