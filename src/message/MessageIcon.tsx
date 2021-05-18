/**
 * @author kenzyyang
 * @date 2021-05-11 19:40:44
 * @desc message 展示的 icon，基于 theme 参数，通过 map 映射展示合适的 icon. 借鉴原开发的实现方式,本次修改仅做文件拆分
 */
import React from 'react';

import {
  CheckCircleFilledIcon,
  ErrorCircleFilledIcon,
  HelpCircleFilledIcon,
  InfoCircleFilledIcon,
  LoadingIcon,
} from '@tencent/tdesign-react';
import { TdMessageProps } from '../_type/components/message';

// theme 和 icon 的映射表
const iconMap = {
  info: InfoCircleFilledIcon,
  success: CheckCircleFilledIcon,
  warning: ErrorCircleFilledIcon,
  error: ErrorCircleFilledIcon,
  question: HelpCircleFilledIcon,
  loading: LoadingIcon,
};

export default function MessageIcon({ theme, onCloseBtnClick }: TdMessageProps) {
  const Icon = iconMap[theme];
  // :todo 关闭按钮是 Icon， 但接口定义的关闭事件类型是 divClick,需要 pmc 确定是否修改接口 -- kenzyyang
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return Icon ? <Icon onClick={(e) => onCloseBtnClick({ e })} /> : null;
}
