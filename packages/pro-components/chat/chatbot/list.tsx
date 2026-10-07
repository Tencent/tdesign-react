import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDownIcon } from 'tdesign-icons-react';

import { eventOf, renderNode, rootProps, useChatClass, useElementRef } from '../_util/native';
import { useInjectedCSS } from '../_util/useInjectedCSS';

import type { StyledProps, TdChatListProps, TdChatListScrollToOptions } from '../_util/native-types';

export const ChatList = forwardRef<HTMLElement | undefined, TdChatListProps & StyledProps & { css?: string }>(
  (props, ref) => {
    const { autoScroll = true, defaultScrollTo = 'bottom', children } = props;
    const inner = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const follow = useRef(defaultScrollTo === 'bottom');
    const [back, setBack] = useState(false);
    const scrollList = useCallback(({ to = 'bottom', behavior = 'auto' }: TdChatListScrollToOptions = {}) => {
      const el = listRef.current;
      if (!el) return;
      follow.current = to === 'bottom';
      el.scrollTo({
        top: to === 'bottom' ? Math.max(0, el.scrollHeight - el.clientHeight) : 0,
        behavior,
      });
    }, []);
    const root = useElementRef(ref, { scrollList }, listRef);
    useInjectedCSS(root, props.css);
    useEffect(() => {
      scrollList({ to: defaultScrollTo });
      // Observe the actual content, including asynchronous Markdown and streamed text.
      const resize = () => {
        if (autoScroll && follow.current) scrollList();
        const el = listRef.current;
        if (el) setBack(el.scrollHeight - el.clientHeight - el.scrollTop > 140);
      };
      const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : undefined;
      if (inner.current) observer?.observe(inner.current);
      return () => observer?.disconnect();
    }, [autoScroll, defaultScrollTo, scrollList]);
    useEffect(() => {
      if (autoScroll && follow.current) scrollList();
    }, [children, autoScroll, scrollList]);
    return (
      <div
        ref={root}
        {...rootProps(props, useChatClass('chat__list'))}
        data-td-chat="list"
        onScroll={(e) => {
          const el = e.currentTarget;
          const distance = el.scrollHeight - el.clientHeight - el.scrollTop;
          follow.current = distance <= 50;
          setBack(distance > 140);
          props.onScroll?.(eventOf('scroll', { scrollTop: el.scrollTop }));
        }}
      >
        <div ref={inner} data-td-chat-part="list-content">
          {renderNode(children)}
        </div>
        {back && (
          <button
            data-td-chat-button=""
            type="button"
            aria-label="回到底部"
            onClick={() => scrollList({ behavior: 'smooth' })}
          >
            <ArrowDownIcon />
          </button>
        )}
      </div>
    );
  },
);
ChatList.displayName = 'ChatList';
