/**
 * @author kenzyyang
 * @date 2021-05-11 19:25:08
 * @desc Message 纯组件实现.(Message.info Message.close 等函数用法封装在 message.tsx)
 */
import React from 'react';

import classNames from 'classnames';
import { TdMessageProps } from './type';

// 依赖组件引入
import noop from '../_util/noop';
import MessageClose from './MessageClose';
import MessageIcon from './MessageIcon';
import { useMessageClass } from './useMessageClass';

// Message 组件参数，需在 api 定义上做部分扩展
interface MessageComponentProps extends TdMessageProps {
  style?: React.CSSProperties;
}

// message 直接作为组件使用时
const MessageComponent: React.FC<MessageComponentProps> = (props) => {
  // 样式相关变量和函数
  const { tdMessagePrefix, tdClassIsGenerator } = useMessageClass();

  const { theme = 'info', children, closeBtn, onCloseBtnClick = noop, style, icon, content } = props;

  return (
    <div
      key="message"
      style={style}
      className={classNames(
        `${tdMessagePrefix}`,
        tdClassIsGenerator(theme),
        closeBtn ? tdClassIsGenerator('closable') : '',
      )}
    >
      {icon ? icon : <MessageIcon theme={theme} onCloseBtnClick={onCloseBtnClick} />}
      {content ? content : children}
      <MessageClose {...props} />
    </div>
  );
};

export default MessageComponent;
