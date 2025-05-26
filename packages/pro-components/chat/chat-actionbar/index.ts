import { TdChatActionProps } from 'tdesign-web-components';
import 'tdesign-web-components/lib/chat-action';
import reactify from '../_util/reactify';

export const ChatActionBar: React.ForwardRefExoticComponent<
  Omit<TdChatActionProps, 'ref'> &
    React.RefAttributes<HTMLElement | undefined> & {
      [key: string]: any;
    }
> = reactify<TdChatActionProps>('t-chat-action');

export default ChatActionBar;
export type { TdChatActionProps } from 'tdesign-web-components';
