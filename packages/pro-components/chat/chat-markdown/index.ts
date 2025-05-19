import { TdChatMarkdownContentProps } from '@tencent/tdesign-chatbot';
import reactify from '../_util/reactify';

export const ChatMarkdown: React.ForwardRefExoticComponent<
  Omit<TdChatMarkdownContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatMarkdownContentProps>('t-chat-md-content');

export default ChatMarkdown;
export type { TdChatMarkdownContentProps } from '@tencent/tdesign-chatbot';
