import { TdChatMarkdownContentProps, TdMarkdownEngine } from 'tdesign-web-components';
import reactify from '../_util/reactify';

export const MarkdownEngine: typeof TdMarkdownEngine = TdMarkdownEngine;
export const ChatMarkdown: React.ForwardRefExoticComponent<
  Omit<TdChatMarkdownContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatMarkdownContentProps>('t-chat-md-content');

// eslint-disable-next-line import/first
import 'tdesign-web-components/lib/chat-message/content/markdown-content';

export default ChatMarkdown;
export type { TdChatMarkdownContentProps } from 'tdesign-web-components';
