import React from 'react';
import { Steps } from '@tdesign/react';

const { Step } = Steps;

export default function HorizontalStepsWithNumbers() {
  return (
    <>
      <Steps direction="vertical" current={2}>
        <Step title="已完成的步骤" content="这里是提示文字"></Step>
        <Step title="进行中的步骤" content="这里是提示文字"></Step>
        <Step title="未进行的步骤" content="这里是提示文字"></Step>
        <Step title="未进行的步骤" content="这里是提示文字"></Step>
      </Steps>
    </>
  );
}
