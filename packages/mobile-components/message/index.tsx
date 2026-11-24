import React from 'react';
import { attachMethodsToComponent } from '../_util/attachMethodsToComponent';
import _Message from './Message';
import type { MessageProps } from './Message';
import * as methods from './methods';
import type { MessageActionOptionsType } from './methods';
import './style';

export * from './type';

type MessageApi = {
  /** 展示普通消息 */
  info: (options?: MessageActionOptionsType | string) => void;
  /** 展示成功消息 */
  success: (options?: MessageActionOptionsType | string) => void;
  /** 展示警示消息 */
  warning: (options?: MessageActionOptionsType | string) => void;
  /** 展示错误消息 */
  error: (options?: MessageActionOptionsType | string) => void;
  /** 关闭全部 */
  closeAll: () => void;
};

export interface MessageType extends React.FC<MessageProps> {
  info: MessageApi['info'];
  warning: MessageApi['warning'];
  success: MessageApi['success'];
  error: MessageApi['error'];
  closeAll: MessageApi['closeAll'];
}

const { info, warning, success, error, closeAll } = methods.default;

export const Message: MessageType = attachMethodsToComponent(_Message, {
  info,
  warning,
  success,
  error,
  closeAll,
});

export default Message;
