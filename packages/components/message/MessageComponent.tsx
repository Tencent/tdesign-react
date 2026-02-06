import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';

import { fadeIn } from '@tdesign/common-js/message/index';
import noop from '../_util/noop';
import { usePersistFn } from '../hooks/usePersistFn';
import MessageClose from './MessageClose';
import MessageIcon from './MessageIcon';
import { useMessageClass } from './useMessageClass';

import type { StyledProps } from '../common';
import type { MessagePlacementList, TdMessageProps } from './type';

// Message 组件参数，需在 api 定义上做部分扩展
export interface MessageComponentProps extends TdMessageProps, StyledProps {
  placement?: MessagePlacementList;
  children?: React.ReactNode;
}

// message 直接作为组件使用时
const MessageComponent = forwardRef<HTMLDivElement, MessageComponentProps>((props, ref) => {
  const { placement, ...otherProps } = props;
  // 样式相关变量和函数
  const { tdMessagePrefix, tdClassIsGenerator } = useMessageClass();

  const {
    theme = 'info',
    className,
    children,
    style,
    icon = true,
    content,
    closeBtn,
    onCloseBtnClick = noop,
    onDurationEnd = noop,
    onClose = noop,
    duration,
  } = otherProps;

  const [isHovering, setIsHovering] = useState(false);
  const onCloseFn = usePersistFn(onClose);
  const onDurationEndFn = usePersistFn(onDurationEnd);
  const onCloseBtnClickFn = usePersistFn(onCloseBtnClick);

  function handleCloseBtnClick(e) {
    onCloseBtnClickFn(e);
    onCloseFn({
      trigger: 'close-click',
    });
  }

  useEffect(() => {
    if (ref && 'current' in ref && ref.current && placement) {
      fadeIn(ref.current, placement);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  useEffect(() => {
    if (!isHovering && duration > 0) {
      const timer = setTimeout(() => {
        onDurationEndFn();
        onCloseFn({
          trigger: 'duration-end',
        });
      }, duration);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [duration, isHovering, onCloseFn, onDurationEndFn]);

  return (
    <div
      ref={ref}
      key="message"
      style={style}
      className={classNames(
        className,
        `${tdMessagePrefix}`,
        tdClassIsGenerator(theme),
        closeBtn ? tdClassIsGenerator('closable') : '',
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {icon === true ? <MessageIcon theme={theme} /> : icon}
      {content ? content : children}
      <MessageClose closeBtn={closeBtn} onCloseBtnClick={handleCloseBtnClick} />
    </div>
  );
});

MessageComponent.displayName = 'Message';

export default MessageComponent;
