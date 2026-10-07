import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { CheckCircleIcon, ChevronDownIcon, CloseCircleIcon } from 'tdesign-icons-react';

import { eventOf, rootProps, slot, useChatClass, useElementRef } from '../_util/native';
import { ChatLoading } from '../chat-loading';

import type { StyledProps, TdChatThinkContentProps } from '../_util/native-types';

export const ChatThinking = forwardRef<HTMLElement | undefined, TdChatThinkContentProps & StyledProps>((props, ref) => {
  const { content, status, animation = 'circle', layout = 'block', maxHeight } = props;
  const [local, setLocal] = useState(props.defaultCollapsed || false);
  const collapsed = props.collapsed ?? local;
  const body = useRef<HTMLDivElement>(null);
  const follows = useRef(true);
  useEffect(() => {
    if (!collapsed && follows.current && body.current) body.current.scrollTop = body.current.scrollHeight;
  }, [content?.text, collapsed]);
  return (
    <div
      ref={useElementRef(ref)}
      {...rootProps(props, useChatClass('chat-thinking'))}
      data-td-chat="thinking"
      data-layout={layout}
    >
      <button
        data-td-chat-button=""
        type="button"
        aria-expanded={!collapsed}
        onClick={() => {
          setLocal(!collapsed);
          props.onCollapsedChange?.(eventOf('collapsedChange', !collapsed));
        }}
      >
        {status !== 'stop' && status === 'error' && <CloseCircleIcon />}
        {status === 'complete' && <CheckCircleIcon />}
        {status !== 'stop' && status !== 'error' && status !== 'complete' && <ChatLoading animation={animation} />}
        <span>{status === 'stop' ? '思考已终止' : content?.title}</span>
        <ChevronDownIcon />
      </button>
      <div
        ref={body}
        hidden={collapsed}
        style={{ maxHeight, overflowY: maxHeight ? 'auto' : undefined }}
        onScroll={(e) => {
          const el = e.currentTarget;
          follows.current = el.scrollHeight - el.clientHeight - el.scrollTop <= 50;
        }}
      >
        {slot(
          props.children,
          'content',
          content?.text
            ?.split('\n')
            .filter(Boolean)
            .map((text, index) => <p key={index}>{text}</p>),
        )}
      </div>
    </div>
  );
});
ChatThinking.displayName = 'ChatThinking';
export default ChatThinking;
export type { StyledProps, TdChatThinkContentProps } from '../_util/native-types';
