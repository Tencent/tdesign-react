import { TdChatThinkContentProps } from '@tencent/tdesign-chatbot';
import reactify from '../_util/reactify';

const ChatThinkContent: React.ForwardRefExoticComponent<
  Omit<TdChatThinkContentProps, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatThinkContentProps>('t-chat-thinking-content');

export const ChatThinking = ChatThinkContent;

export default ChatThinking;

export type { TdChatThinkContentProps } from '@tencent/tdesign-chatbot';
