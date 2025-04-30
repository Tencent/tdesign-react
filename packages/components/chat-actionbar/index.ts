import { TdChatActionProps } from '@tencent/tdesign-chatbot';
import reactify from '../_util/reactify';

export const ChatActionBar: React.ForwardRefExoticComponent<
  Omit<TdChatActionProps, 'ref'> &
    React.RefAttributes<HTMLElement | undefined> & {
      [key: string]: any;
    }
> = reactify<TdChatActionProps>('t-chat-action');

export default ChatActionBar;
export type { TdChatActionProps } from '@tencent/tdesign-chatbot';
