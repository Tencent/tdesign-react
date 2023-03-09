import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import { TdMessageProps } from './type';

// 依赖组件引入
import MessageClose from './MessageClose';
import MessageIcon from './MessageIcon';
import { useMessageClass } from './useMessageClass';
import { StyledProps } from '../common';
import { usePersistFn } from '../_util/usePersistFn';
import noop from '../_util/noop';

// Message 组件参数，需在 api 定义上做部分扩展
export interface MessageComponentProps extends TdMessageProps, StyledProps {
  children?: React.ReactNode;
}

// message 直接作为组件使用时
const MessageComponent: React.FC<MessageComponentProps> = (props) => {
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
  } = props;

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
};

export default MessageComponent;
