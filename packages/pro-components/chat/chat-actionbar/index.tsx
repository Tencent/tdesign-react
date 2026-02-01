import React from 'react';
import { TdChatActionProps, TdChatActionsName } from 'tdesign-web-components';
import 'tdesign-web-components/lib/chat-action';
import reactify from '../_util/reactify';

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
export type { ChatActionBarAction };
export type { TdChatActionProps, TdChatActionsName } from 'tdesign-web-components';
