import { TdChatMarkdownContentProps } from 'tdesign-web-components';
import 'tdesign-web-components/lib/chat-message/content/markdown-content';
import reactify from '../_util/reactify';

export const ChatMarkdown: React.ForwardRefExoticComponent<
  Omit<TdChatMarkdownContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatMarkdownContentProps>('t-chat-md-content');

export default ChatMarkdown;
export type { TdChatMarkdownContentProps } from 'tdesign-web-components';
