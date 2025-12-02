import React, { useMemo, forwardRef } from 'react';
import { TdChatActionProps } from 'tdesign-web-components';
import 'tdesign-web-components/lib/chat-action';
import reactify from '../_util/reactify';

const BaseChatActionBar = reactify<TdChatActionProps>('t-chat-action') as React.ComponentType<any>;

export const ChatActionBar = forwardRef<HTMLElement, TdChatActionProps>((props, ref) => {
  const { actionBar, handleAction, ...rest } = props;

  const { finalActionBar, slots } = useMemo(() => {
    if (!Array.isArray(actionBar)) return { finalActionBar: actionBar, slots: null };

    const newActionBar = [];
    const newSlots: React.ReactNode[] = [];

    actionBar.forEach((item, index) => {
      if (typeof item === 'string') {
        newActionBar.push(item);
      } else if (React.isValidElement(item)) {
        const reactItem = item as React.ReactElement;

        const slotName = `action-item-${index}`;

        // 设置 ignoreWrapper 属性可以让 actionBar 中的元素不继承父级默认的样式
        const ignoreWrapper = reactItem.props.ignoreWrapper as any;

        // 通过 webc 内部 wrapper 的事件冒泡来触发 handleAction
        newActionBar.push({ name: slotName, ignoreWrapper });

        newSlots.push(
          <div slot={slotName} key={slotName} style={{ display: 'contents' }}>
            {item}
          </div>,
        );
      } else {
        newActionBar.push(item);
      }
    });

    return { finalActionBar: newActionBar, slots: newSlots };
  }, [actionBar]);

  return (
    <BaseChatActionBar {...rest} handleAction={handleAction} actionBar={finalActionBar} ref={ref}>
      {slots}
      {props.children}
    </BaseChatActionBar>
  );
}) as React.ForwardRefExoticComponent<
  Omit<TdChatActionProps, 'ref'> &
    React.RefAttributes<HTMLElement | undefined> & {
      [key: string]: any;
    }
>;

export default ChatActionBar;
export type { TdChatActionProps, TdChatActionsName } from 'tdesign-web-components';
