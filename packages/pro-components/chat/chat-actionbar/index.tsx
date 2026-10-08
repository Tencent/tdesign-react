import React, { forwardRef, isValidElement, useEffect, useState } from 'react';
import {
  CopyIcon,
  RefreshIcon,
  Share1Icon,
  ThumbDownFilledIcon,
  ThumbDownIcon,
  ThumbUpFilledIcon,
  ThumbUpIcon,
} from 'tdesign-icons-react';
import { MessagePlugin, Tooltip } from 'tdesign-react';

import { renderNode, rootProps, slot, useChatClass, useElementRef } from '../_util/native';

import type { TdChatActionProps, TdChatActionsName } from '../_util/native-types';

export type ChatActionBarAction =
  | TdChatActionsName
  | React.ReactElement
  | {
      name: string;
      render?: React.ReactNode | ((props: any) => React.ReactNode);
      ignoreWrapper?: boolean;
    };
export type ChatActionBarProps = Omit<TdChatActionProps, 'actionBar'> & {
  actionBar?: boolean | ChatActionBarAction[];
};
export const defaultActions: TdChatActionsName[] = ['replay', 'copy', 'good', 'bad', 'share'];
const labels = {
  replay: '重新生成',
  copy: '复制',
  good: '点赞',
  bad: '点踩',
  share: '分享',
};
export const ChatActionBar = forwardRef<HTMLElement | undefined, ChatActionBarProps>((props, ref) => {
  const { actionBar = true, copyText = '', handleAction, comment, tooltipProps } = props;
  const [currentComment, setComment] = useState(comment);
  useEffect(() => setComment(comment), [comment]);
  const root = useElementRef(ref);
  const base = useChatClass('chat-actions');
  const click = async (name: TdChatActionsName, event: React.MouseEvent) => {
    const active = name === 'good' || name === 'bad' ? currentComment !== name : undefined;
    if (active !== undefined) setComment(active ? (name as 'good' | 'bad') : undefined);
    handleAction?.(name, {
      event: event.nativeEvent,
      ...(active === undefined ? {} : { active }),
    });
    if (name === 'copy' && copyText) {
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(copyText);
        else {
          const area = document.createElement('textarea');
          area.value = copyText;
          area.style.position = 'fixed';
          area.style.opacity = '0';
          document.body.appendChild(area);
          try {
            area.select();
            if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
          } finally {
            area.remove();
          }
        }
        MessagePlugin.success('复制成功');
      } catch {
        MessagePlugin.error('复制失败，请手动复制');
      }
    }
  };
  const icons = {
    replay: <RefreshIcon />,
    copy: <CopyIcon />,
    share: <Share1Icon />,
    good: currentComment === 'good' ? <ThumbUpFilledIcon /> : <ThumbUpIcon />,
    bad: currentComment === 'bad' ? <ThumbDownFilledIcon /> : <ThumbDownIcon />,
  };
  const actions = Array.isArray(actionBar) ? actionBar : defaultActions;
  if (actionBar === false || actions.length === 0) return null;
  return (
    <div ref={root} {...rootProps(props, base)} data-td-chat="actions">
      {actions.map((action, index) => {
        if (isValidElement(action)) return <React.Fragment key={action.key || index}>{action}</React.Fragment>;
        if (typeof action !== 'string' && 'name' in action) {
          const node = renderNode(action.render) || slot(props.children, action.name);
          return action.ignoreWrapper ? (
            <React.Fragment key={action.name}>{node}</React.Fragment>
          ) : (
            <span key={action.name} className={`${base}__item__wrapper`}>
              {node}
            </span>
          );
        }
        if (typeof action !== 'string') return null;
        const button = (
          <Tooltip key={action} content={labels[action]} placement="top" showArrow {...tooltipProps}>
            <button
              data-td-chat-button=""
              type="button"
              className={`${base}__item__wrapper`}
              aria-label={labels[action]}
              aria-pressed={action === 'good' || action === 'bad' ? currentComment === action : undefined}
              onClick={(event) => {
                click(action, event);
              }}
            >
              {icons[action]}
            </button>
          </Tooltip>
        );
        return action === 'replay' && index < actions.length - 1 ? (
          <span key={action} data-td-chat-part="action-replay">
            {button}
            <span data-td-chat-part="action-divider" aria-hidden="true" />
          </span>
        ) : (
          button
        );
      })}
    </div>
  );
});
ChatActionBar.displayName = 'ChatActionBar';
export default ChatActionBar;
export type { TdChatActionProps, TdChatActionsName } from '../_util/native-types';
