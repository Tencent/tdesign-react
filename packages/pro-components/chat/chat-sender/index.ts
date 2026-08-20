import '@tdesign/web-components-chat/chat-sender';

import reactify from '../_util/reactify';

import type { TdChatSenderProps } from '@tdesign/web-components-chat/chat-sender';

export const ChatSender: React.ForwardRefExoticComponent<
  Omit<TdChatSenderProps & React.PropsWithChildren, 'ref'> & React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSenderProps>('t-chat-sender');

export default ChatSender;
export type {
  TdChatSenderAction,
  TdChatSenderActionName,
  TdChatSenderApi,
  TdChatSenderParams,
  TdChatSenderProps,
  TdChatSenderUploadProps,
  UploadActionType,
} from '@tdesign/web-components-chat/chat-sender';
