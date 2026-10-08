import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircleIcon, ChevronDownIcon, CloseCircleIcon } from 'tdesign-icons-react';

import { eventOf, rootProps, slot, useChatClass, useElementRef } from '../_util/native';
import { ChatLoading } from '../chat-loading';

import type { StyledProps, TdChatThinkContentProps } from '../_util/native-types';

export const ChatThinking = forwardRef<HTMLElement | undefined, TdChatThinkContentProps & StyledProps>((props, ref) => {
  const { content, status, animation = 'circle', layout = 'block', maxHeight } = props;
  const [local, setLocal] = useState(props.defaultCollapsed || false);
  const collapsed = props.collapsed ?? local;
  const body = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const follows = useRef(true);
  const scrollToBottom = useCallback(() => {
    if (!collapsed && follows.current && body.current) body.current.scrollTop = body.current.scrollHeight;
  }, [collapsed]);
  useEffect(scrollToBottom, [scrollToBottom, content?.text, props.children, maxHeight]);
  useEffect(() => {
    // Custom reasoning and asynchronous children can grow without changing content.text.
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scrollToBottom) : undefined;
    if (inner.current) observer?.observe(inner.current);
    return () => observer?.disconnect();
  }, [scrollToBottom]);
  return (
    <div
      ref={useElementRef(ref)}
      {...rootProps(props, useChatClass('chat-thinking'))}
      data-td-chat="thinking"
      data-layout={layout}
      data-status={status}
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
        {status === 'error' && (
          <CloseCircleIcon size="var(--td-chat-item-think-status-wh)" data-td-chat-part="thinking-status" />
        )}
        {status === 'complete' && (
          <CheckCircleIcon size="var(--td-chat-item-think-status-wh)" data-td-chat-part="thinking-status" />
        )}
        {status !== 'stop' && status !== 'error' && status !== 'complete' && <ChatLoading animation={animation} />}
        <span>{status === 'stop' ? '思考已终止' : content?.title}</span>
        <ChevronDownIcon size="18px" data-td-chat-part="collapse-icon" />
      </button>
      <div data-td-chat-part="thinking-body" hidden={collapsed}>
        <div
          ref={body}
          data-td-chat-part="thinking-scroll"
          style={{ maxHeight, overflowY: maxHeight ? 'auto' : undefined }}
          onScroll={(e) => {
            const el = e.currentTarget;
            follows.current = el.scrollHeight - el.clientHeight - el.scrollTop <= 50;
          }}
        >
          <div ref={inner} data-td-chat-part="thinking-content">
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
      </div>
    </div>
  );
});
ChatThinking.displayName = 'ChatThinking';
export default ChatThinking;
export type { StyledProps, TdChatThinkContentProps } from '../_util/native-types';
