import '@tdesign/web-components-chat/chat-action';

import reactify from '../_util/reactify';

import type { TdChatActionProps } from '@tdesign/web-components-chat/chat-action';

export const ChatActionBar: React.ForwardRefExoticComponent<
  Omit<TdChatActionProps, 'ref'> &
    React.RefAttributes<HTMLElement | undefined> & {
      [key: string]: any;
    }
> = reactify<TdChatActionProps>('t-chat-action');

export default ChatActionBar;
export type { TdChatActionProps, TdChatActionsName } from '@tdesign/web-components-chat/chat-action';
