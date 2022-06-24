import React from 'react';
import { Steps } from 'tdesign-react';
import { LoginIcon, CartIcon, WalletIcon, CheckCircleIcon } from 'tdesign-icons-react';

const { StepItem } = Steps;

export default function BasicStepsExample() {
  return (
    <Steps defaultCurrent={1}>
      <StepItem icon={<LoginIcon />} title="登录" content="已完成状态" />
      <StepItem icon={<CartIcon />} title="购物" content="进行中状态" />
      <StepItem icon={<WalletIcon />} title="支付" content="未开始" />
      <StepItem icon={<CheckCircleIcon />} title="完成" content="未开始" />
    </Steps>
  );
}
