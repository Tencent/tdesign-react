import React from 'react';
import { Steps } from '@tdesign/react';

const { Step } = Steps;

export default function BasicStepsExample() {
  return (
    <Steps>
      <Step status="finish" title="已完成的步骤" content="这里是提示文字"></Step>
      <Step status="process" title="进行中的步骤" content="这里是提示文字"></Step>
      <Step status="error" title="错误的步骤" content="这里是提示文字"></Step>
      <Step status="wait" title="未进行的步骤" content="这里是提示文字"></Step>
    </Steps>
  );
}
