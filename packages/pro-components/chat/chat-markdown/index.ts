import { TdMarkdownEngine } from '@tdesign/web-components-chat/chat-message';

import reactify from '../_util/reactify';

import type { TdChatMarkdownContentProps } from '@tdesign/web-components-chat/chat-message';

export const MarkdownEngine: typeof TdMarkdownEngine = TdMarkdownEngine;
export const ChatMarkdown: React.ForwardRefExoticComponent<
  Omit<TdChatMarkdownContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatMarkdownContentProps>('t-chat-md-content');

export default ChatMarkdown;
export type { TdChatMarkdownContentProps } from '@tdesign/web-components-chat/chat-message';
