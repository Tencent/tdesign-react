import { TdChatLoadingProps } from 'tdesign-web-components';
import 'tdesign-web-components/lib/chat-loading';
import reactify from '../_util/reactify';

export const ChatLoading: React.ForwardRefExoticComponent<
  Omit<TdChatLoadingProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatLoadingProps>('t-chat-loading');

export default ChatLoading;
export type { TdChatLoadingProps, ChatLoadingAnimationType } from 'tdesign-web-components';
