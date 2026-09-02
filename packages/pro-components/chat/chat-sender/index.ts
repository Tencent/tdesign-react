import '@tdesign/web-components-chat/chat-sender';

import reactify from '../_util/reactify';

import type { TdChatSenderProps } from '@tdesign/web-components-chat';

export const ChatSender: React.ForwardRefExoticComponent<
  Omit<TdChatSenderProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSenderProps>('t-chat-sender');

export default ChatSender;

// 导出 chat-sender 相关类型（收窄范围，避免透传主入口导致跨子模块类型冲突）
export type {
  TdChatSenderAction,
  TdChatSenderActionName,
  TdChatSenderApi,
  TdChatSenderParams,
  TdChatSenderProps,
  TdChatSenderUploadProps,
  UploadActionType,
} from '@tdesign/web-components-chat';
