import { TdChatActionProps } from 'tdesign-web-components';
import 'tdesign-web-components/lib/chat-action';
import reactify from '../_util/reactify';

export const ChatActionBar: React.ForwardRefExoticComponent<
  Omit<TdChatActionProps, 'ref'> &
    React.RefAttributes<HTMLElement | undefined> & {
      [key: string]: any;
    }
> = reactify<TdChatActionProps>('t-chat-action');

export default ChatActionBar;
export type { TdChatActionProps, TdChatActionsName } from 'tdesign-web-components';

// 方案1
// import { reactifyLazy } from './_util/reactifyLazy';
// const ChatActionBar = reactifyLazy<{
//   size: 'small' | 'medium' | 'large',
//   variant: 'primary' | 'secondary' | 'outline'
// }>(
//   't-chat-action',
//   'tdesign-web-components/esm/chat-action'
// );

// import ChatAction from 'tdesign-web-components/esm/chat-action';
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
