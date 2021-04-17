import React from 'react';
import { Steps } from '@tencent/tdesign-react';

const { StepItem } = Steps;

export default function HorizontalStepsWithNumbers() {
  return (
    <>
      <Steps direction="vertical" sequence="reverse" current={2}>
        <StepItem title="未进行的步骤" content="这里是提示文字"></StepItem>
        <StepItem title="未进行的步骤" content="这里是提示文字"></StepItem>
        <StepItem title="进行中的步骤" content="这里是提示文字"></StepItem>
        <StepItem title="已完成的步骤" content="这里是提示文字"></StepItem>
      </Steps>
    </>
  );
}
