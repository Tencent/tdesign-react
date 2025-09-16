import { TdChatThinkContentProps } from 'tdesign-web-components';
import 'tdesign-web-components/lib/chat-message/content/thinking-content';
import reactify from '../_util/reactify';

const ChatThinkContent: React.ForwardRefExoticComponent<
  Omit<TdChatThinkContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatThinkContentProps>('t-chat-thinking-content');

export const ChatThinking = ChatThinkContent;

export default ChatThinking;

export type { TdChatThinkContentProps } from 'tdesign-web-components';
