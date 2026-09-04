import '@tdesign/web-components-chat/chat-action';

import React from 'react';

import reactify from '../_util/reactify';

import type { TdChatActionProps, TdChatActionsName } from '@tdesign/web-components-chat';

type ChatActionBarAction =
  | TdChatActionsName
  | React.ReactElement
  | {
      name: string;
      render?: React.ReactNode;
      ignoreWrapper?: boolean;
    };

type ChatActionBarProps = Omit<TdChatActionProps, 'actionBar' | 'ref'> & {
  actionBar?: boolean | ChatActionBarAction[];
  ref?: React.Ref<HTMLElement | undefined>;
};

const BaseChatActionBar = reactify<TdChatActionProps>('t-chat-action');

const normalizeSlotName = (raw: string) => raw.replace(/[^a-zA-Z0-9_-]/g, '-');

export const ChatActionBar = (props: ChatActionBarProps) => {
  const { actionBar, ref, ...rest } = props;
  const slotProps: Record<string, React.ReactNode> = {};
  let mappedActionBar = actionBar;

  if (Array.isArray(actionBar)) {
    mappedActionBar = actionBar.map((action, index) => {
      if (React.isValidElement(action)) {
        const key = action.key != null ? String(action.key) : `item-${index}`;
        const slotName = normalizeSlotName(`action-${key}`);
        slotProps[`${slotName}Slot`] = action;
        return { name: slotName };
      }
      return action;
    });
  }

  return (
    <BaseChatActionBar
      {...(rest as TdChatActionProps)}
      actionBar={mappedActionBar as TdChatActionProps['actionBar']}
      ref={ref}
      {...slotProps}
    />
  );
};

export default ChatActionBar;
export type { TdChatActionProps, TdChatActionsName } from '@tdesign/web-components-chat';

// 方案1
// import { reactifyLazy } from './_util/reactifyLazy';
// const ChatActionBar = reactifyLazy<{
//   size: 'small' | 'medium' | 'large',
//   variant: 'primary' | 'secondary' | 'outline'
// }>(
//   't-chat-action',
//   '@tdesign/web-components-chat/esm/chat-action'
// );

// import ChatAction from '@tdesign/web-components-chat/esm/chat-action';
// import React, { forwardRef, useEffect } from 'react';

// // 注册Web Components组件
// const registerChatAction = () => {
//   if (!customElements.get('t-chat-action')) {
//     customElements.define('t-chat-action', ChatAction);
//   }
// };

// // 在组件挂载时注册
// const useRegisterWebComponent = () => {
//   useEffect(() => {
//     registerChatAction();
//   }, []);
// };

// // 使用reactify创建React组件
// const BaseChatActionBar = reactify<TdChatActionProps>('t-chat-action');

// // 包装组件，确保Web Components已注册
// export const ChatActionBar2 = forwardRef<
//   HTMLElement | undefined,
//   Omit<TdChatActionProps, 'ref'> & { [key: string]: any }
// >((props, ref) => {
//   useRegisterWebComponent();
//   return <BaseChatActionBar {...props} ref={ref} />;
// });
