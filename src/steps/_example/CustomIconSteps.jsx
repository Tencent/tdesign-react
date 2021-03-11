import React from 'react';
import { Steps, CheckCircleFilledIcon } from '@tencent/tdesign-react';

const { Step } = Steps;

export default function BasicStepsExample() {
  return (
    <>
      <Steps>
        <Step icon={<CheckCircleFilledIcon />} title="已完成的步骤" content="这里是提示文字"></Step>
        <Step icon={<CheckCircleFilledIcon />} title="进行中的步骤" content="这里是提示文字"></Step>
        <Step icon={<CheckCircleFilledIcon />} title="未进行的步骤" content="这里是提示文字"></Step>
        <Step icon={<CheckCircleFilledIcon />} title="未进行的步骤" content="这里是提示文字"></Step>
      </Steps>
    </>
  );
}
