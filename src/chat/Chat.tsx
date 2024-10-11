import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import classNames from 'classnames';
import isArray from 'lodash/isArray';
import { Icon } from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import ChatItem from './components/ChatItem';
import type { TdChatItemProps } from './components/ChatItem';
import Popconfirm from '../popconfirm';
import Divider from '../divider';
import parseTNode from '../_util/parseTNode';

const handleScrollToBottom = (target: HTMLDivElement, behavior?: 'auto' | 'smooth') => {
  const currentScrollHeight = target.scrollHeight;
  const currentClientHeight = target.clientHeight;

  const innerBehavior = behavior ?? 'auto';
  if (innerBehavior === 'auto') {
    // eslint-disable-next-line no-param-reassign
    target.scrollTop = currentScrollHeight - currentClientHeight;
  } else {
    const startScrollTop = target.scrollTop;
    const endScrollTop = currentScrollHeight - currentClientHeight;
    const duration = 300;
    const step = (endScrollTop - startScrollTop) / duration;
    let startTime: number | undefined;
    // 平滑地修改scrollTop值
    const animateScroll = (time: number) => {
      if (!startTime) {
        startTime = time;
      }
      const elapsed = time - startTime;
      const top = Math.min(endScrollTop, startScrollTop + elapsed * step);
      // eslint-disable-next-line no-param-reassign
      target.scrollTop = top;
      if (top < endScrollTop) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }
};

const Chat = forwardRef<any, any>((props, ref) => {
  const {
    data,
    layout,
    clearHistory = true,
    reverse,
    // isStreamLoad,
    textLoading,
    footer,
    children,
    onClear,
    onScroll,
  } = props;
  const { classPrefix } = useConfig();
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  const COMPONENT_NAME = `${classPrefix}-chat`;

  const classes = useMemo(
    () =>
      classNames([
        COMPONENT_NAME,
        {
          [`${COMPONENT_NAME}--normal`]: layout === 'both',
        },
      ]),
    [COMPONENT_NAME, layout],
  );

  const listClasses = useMemo(
    () =>
      classNames([
        `${COMPONENT_NAME}__list`,
        {
          [`${COMPONENT_NAME}__list--reverse`]: reverse,
        },
      ]),
    [COMPONENT_NAME, reverse],
  );

  const clearConfirm = (context: { e: React.MouseEvent<HTMLElement, MouseEvent> }) => {
    onClear?.(context);
  };

  const renderBody = () => {
    /**
     * 1. 两种方式获取要渲染的 list
     *  a. props 传 data
     *  b. slots t-chat-item
     * a 优先级更高
     */
    if (isArray(data) && data.length > 0) {
      const isLoading = (index: number) => (reverse ? index === 0 : index === data.length - 1) && textLoading;
      return data.map((item: TdChatItemProps, index: number) => (
        <ChatItem
          key={index}
          avatar={item.avatar}
          name={item.name}
          role={item.role}
          datetime={item.datetime}
          content={item.content}
          textLoading={isLoading(index)}
          itemIndex={index}
        />
      ));
    }
    return children;
  };

  const defaultClearHistory = (
    <Popconfirm content="确定要清空所有的消息吗？" onConfirm={clearConfirm}>
      <Divider className="clear-btn">
        <Icon name="clear" size="14px" />
        <span className="clear-btn-text">清空历史记录</span>
      </Divider>
    </Popconfirm>
  );

  const renderClearHistory = clearHistory && parseTNode(clearHistory, null, defaultClearHistory);

  // 滚动到底部
  // BackBottomParams
  const scrollToBottom = (data: any) => {
    if (!chatBoxRef.current) return;
    const { behavior = 'auto' } = data;
    handleScrollToBottom(chatBoxRef.current, behavior);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll?.({ e });
  };

  useImperativeHandle(ref, () => ({
    scrollToBottom,
  }));

  return (
    <div className={classes}>
      <div className={listClasses} ref={chatBoxRef} onScroll={handleScroll}>
        {reverse && <div className="place-holder"></div>}
        {reverse && renderClearHistory}
        {renderBody()}
        {!reverse && renderClearHistory}
      </div>
      {!!footer && <div className={`${COMPONENT_NAME}__footer`}>{parseTNode(footer)}</div>}
    </div>
  );
});

Chat.displayName = 'Chat';

export default Chat;
