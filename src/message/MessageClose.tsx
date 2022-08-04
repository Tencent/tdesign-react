/**
 * @author kenzyyang
 * @date 2021-05-11 20:01:45
 * @desc message 关闭按钮组件
 */
import React from 'react';

import classNames from 'classnames';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-react';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { TdMessageProps } from './type';
import { useMessageClass } from './useMessageClass';

export default function MessageClose({ closeBtn, onCloseBtnClick }: TdMessageProps) {
  const { tdMessageClassGenerator } = useMessageClass();
  const { CloseIcon } = useGlobalIcon({ CloseIcon: TdCloseIcon });

  let relCloseBtn = closeBtn;
  // 函数类型先执行并解出具体的内容，然后进行判断
  if (typeof closeBtn === 'function') {
    relCloseBtn = closeBtn();
  }

  // falseLike 类型表明不展示 close
  if (!relCloseBtn) {
    return null;
  }

  // 数字 字符串类型封装 span 标签
  if (typeof relCloseBtn === 'string' || typeof relCloseBtn === 'number') {
    return (
      <span className={tdMessageClassGenerator('close')} onClick={(e) => onCloseBtnClick?.({ e })}>
        {closeBtn}
      </span>
    );
  }

  // 组件或者 dom 节点 加上 close 样式
  if (React.isValidElement(relCloseBtn)) {
    const { onClick } = relCloseBtn.props;
    return React.cloneElement(relCloseBtn, {
      className: classNames(relCloseBtn.props.className, tdMessageClassGenerator('close')),
      onClick: (e) => {
        onClick?.(e);
        onCloseBtnClick?.({ e });
      },
    });
  }

  // 否则使用默认的关闭按钮样式
  return <CloseIcon className={tdMessageClassGenerator('close')} onClick={(e) => onCloseBtnClick?.({ e })} />;
}
