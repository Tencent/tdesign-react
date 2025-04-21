import '@tencent/tdesign-chatbot-dev/lib/chatbot';
import reactify from '../_util/reactify';
import { TdChatProps } from '@tencent/tdesign-chatbot-dev/lib/chatbot';
import '@tencent/tdesign-chatbot-dev/lib/style/index.css';

const ChatBot: React.ForwardRefExoticComponent<
  Omit<TdChatProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatProps>('t-chatbot');

export { ChatBot };
export type * from '@tencent/tdesign-chatbot-dev/lib/chatbot';
