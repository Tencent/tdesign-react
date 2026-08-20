import '@tdesign/web-components-chat/chat-loading';

import reactify from '../_util/reactify';

import type { TdChatLoadingProps } from '@tdesign/web-components-chat/chat-loading';

export const ChatLoading: React.ForwardRefExoticComponent<
  Omit<TdChatLoadingProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatLoadingProps>('t-chat-loading');

export default ChatLoading;
export type { ChatLoadingAnimationType, TdChatLoadingProps } from '@tdesign/web-components-chat/chat-loading';
