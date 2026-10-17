import '@tdesign/web-components-chat/chat-sender';

import reactify from '../_util/reactify';

import type { TdChatSenderProps } from '@tdesign/web-components-chat';

/** ChatSender 插槽属性（Web Components 运行时支持，类型声明暂未同步） */
export type TdChatSenderSlotsProps = {
  /** 自定义输入框上方区域，可用来引用内容或提示场景 */
  innerHeader?: React.ReactNode;
  /** 自定义输入框底部区域，可以增加模型选项 */
  footerPrefix?: React.ReactNode;
  /** 自定义输入框左侧区域，可以用来触发工具场景切换 */
  inputPrefix?: React.ReactNode;
};

export const ChatSender: React.ForwardRefExoticComponent<
  Omit<TdChatSenderProps & TdChatSenderSlotsProps & React.PropsWithChildren, 'ref'> &
    React.RefAttributes<HTMLElement | undefined>
> = reactify<TdChatSenderProps & TdChatSenderSlotsProps>('t-chat-sender');

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
