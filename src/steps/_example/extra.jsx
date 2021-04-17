import React from 'react';
import { Steps } from '@tencent/tdesign-react';

const { StepItem } = Steps;

export default function HorizontalStepsWithNumbers() {
  return (
    <>
      <Steps direction="vertical" current={2}>
        <StepItem title="已完成" content="这里是提示文字">
          <button className="t-button t-button--primary t-size-s">按钮</button>
          <button className="t-button t-button--line t-size-s">按钮</button>
        </StepItem>
        <StepItem title="进行中" content="这里是提示文字"></StepItem>
        <StepItem title="未进行" content="这里是提示文字"></StepItem>
        <StepItem title="未进行" content="这里是提示文字"></StepItem>
      </Steps>
    </>
  );
}
