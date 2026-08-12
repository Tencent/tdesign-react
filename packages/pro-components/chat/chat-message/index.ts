import 'tdesign-web-components/lib/chat-message';

import reactify from '../_util/reactify';

import type { ChatMessagesData } from '@tdesign/ai-chat-engine';
import type { TdChatMessageProps as WCTdChatMessageProps } from 'tdesign-web-components';

/**
 * TdChatMessageProps 的 `message` 字段来源修正：
 * - `tdesign-web-components` 里的 `ChatMessagesData` 与 `@tdesign/ai-chat-engine`
 *   里的 `ChatMessagesData` 暂时是同构但不同源的两份类型（前者是历史内部定义，
 *   后者是新架构的规范来源），下游 `useChat` 返回的 messages 走的是 chat-engine，
 *   桥接组件如果直接用 web-components 的类型会导致 TS 无法互赋值。
 * - 这里用 `Omit + &` 覆盖 `message` 字段的类型来源，运行时不变；组件底层是
 *   web component，只关心属性值，不感知 TS 类型。
 */
export type TdChatMessageProps = Omit<WCTdChatMessageProps, 'message'> & {
  message?: ChatMessagesData;
};

export const ChatMessage: React.ForwardRefExoticComponent<
  Omit<TdChatMessageProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatMessageProps>('t-chat-item', 'ChatMessage');

export default ChatMessage;
