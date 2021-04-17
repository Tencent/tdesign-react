import React from 'react';
import { Steps } from '@tencent/tdesign-react';

const { StepItem } = Steps;

export default function BasicStepsExample() {
  return (
    <Steps>
      <StepItem status="finish" title="已完成的步骤" content="这里是提示文字"></StepItem>
      <StepItem status="process" title="进行中的步骤" content="这里是提示文字"></StepItem>
      <StepItem status="error" title="错误的步骤" content="这里是提示文字"></StepItem>
      <StepItem status="wait" title="未进行的步骤" content="这里是提示文字"></StepItem>
    </Steps>
  );
}
