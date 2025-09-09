import { TdChatMarkdownContentProps, TdMarkdownEngine } from '@tencent/tdesign-webc-test';
import '@tencent/tdesign-webc-test/lib/chat-message/content/markdown-content';
import reactify from '../_util/reactify';

export const MarkdownEngine = TdMarkdownEngine;
export const ChatMarkdown: React.ForwardRefExoticComponent<
  Omit<TdChatMarkdownContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatMarkdownContentProps>('t-chat-md-content');

export default ChatMarkdown;
export type { TdChatMarkdownContentProps } from '@tencent/tdesign-webc-test';
