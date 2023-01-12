import React from 'react';

import classNames from 'classnames';
import { TdMessageProps } from './type';

// 依赖组件引入
import MessageClose from './MessageClose';
import MessageIcon from './MessageIcon';
import { useMessageClass } from './useMessageClass';
import { StyledProps } from '../common';

// Message 组件参数，需在 api 定义上做部分扩展
export interface MessageComponentProps extends TdMessageProps, StyledProps {
  children?: React.ReactNode;
}

// message 直接作为组件使用时
const MessageComponent: React.FC<MessageComponentProps> = (props) => {
  // 样式相关变量和函数
  const { tdMessagePrefix, tdClassIsGenerator } = useMessageClass();

  const { theme = 'info', className, children, style, icon = true, content, ...otherProps } = props;

  let iconNode = icon;
  if (icon === true) {
    iconNode = <MessageIcon theme={theme} />;
  }

  return (
    <div
      key="message"
      style={style}
      className={classNames(
        className,
        `${tdMessagePrefix}`,
        tdClassIsGenerator(theme),
        otherProps.closeBtn ? tdClassIsGenerator('closable') : '',
      )}
    >
      {iconNode}
      {content ? content : children}
      <MessageClose {...otherProps} />
    </div>
  );
};

export default MessageComponent;
