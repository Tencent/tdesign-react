/**
 * @author kenzyyang
 * @date 2021-05-11 19:40:44
 * @desc message 展示的 icon，基于 theme 参数，通过 map 映射展示合适的 icon. 借鉴原开发的实现方式,本次修改仅做文件拆分
 */
import React from 'react';
import {
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
  HelpCircleFilledIcon as TdHelpCircleFilledIcon,
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
} from 'tdesign-icons-react';
import useGlobalIcon from '../hooks/useGlobalIcon';

import { TdMessageProps } from './type';
import Loading from '../loading';

export default function MessageIcon({ theme, onCloseBtnClick }: TdMessageProps) {
  const { CheckCircleFilledIcon, ErrorCircleFilledIcon, HelpCircleFilledIcon, InfoCircleFilledIcon } = useGlobalIcon({
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
    HelpCircleFilledIcon: TdHelpCircleFilledIcon,
    InfoCircleFilledIcon: TdInfoCircleFilledIcon,
  });

  // theme 和 icon 的映射表
  const iconMap = {
    info: InfoCircleFilledIcon,
    success: CheckCircleFilledIcon,
    warning: ErrorCircleFilledIcon,
    error: ErrorCircleFilledIcon,
    question: HelpCircleFilledIcon,
    loading: Loading,
  };
  const Icon = iconMap[theme];
  if (theme === 'loading') {
    return <Icon loading={true} />;
  }

  return Icon ? <Icon onClick={(e) => onCloseBtnClick?.({ e })} /> : null;
}
