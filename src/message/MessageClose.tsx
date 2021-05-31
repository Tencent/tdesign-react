/**
 * @author kenzyyang
 * @date 2021-05-11 20:01:45
 * @desc message 关闭按钮组件
 */
import React from 'react';

import classNames from 'classnames';
import { CloseIcon } from '../icon';
import { TdMessageProps } from '../_type/components/message';
import { useMessageClass } from './useMessageClass';

export default function MessageClose({ closeBtn, onCloseBtnClick }: TdMessageProps) {
  const { tdMessageClassGenerator } = useMessageClass();

  // falseLike 类型表明不展示 close
  if (!closeBtn) {
    return null;
  }

  if (typeof closeBtn === 'function') {
    return React.cloneElement(closeBtn(), {
      className: classNames(closeBtn().props.className, tdMessageClassGenerator('close')),
    });
  }

  // 数字 字符串类型封装 span 标签
  if (typeof closeBtn === 'string' || typeof closeBtn === 'number') {
    return (
      <span className={tdMessageClassGenerator('close')} onClick={(e) => onCloseBtnClick?.({ e })}>
        {closeBtn}
      </span>
    );
  }

  // 组件或者 dom 节点 加上 close 样式
  if (React.isValidElement(closeBtn)) {
    return React.cloneElement(closeBtn, {
      className: classNames(closeBtn.props.className, tdMessageClassGenerator('close')),
    });
  }

  // 否则使用默认的关闭按钮样式
  return <CloseIcon className={tdMessageClassGenerator('close')} />;
}
