import React from 'react';
import { Steps } from '@tencent/tdesign-react';

const { StepItem } = Steps;

export default function BasicStepsExample() {
  return (
    <>
      <Steps>
        <StepItem status="finish" title="已完成的步骤" content="这里是提示文字" />
        <StepItem status="process" title="进行中的步骤" content="这里是提示文字" />
        <StepItem status="wait" title="未进行的步骤" content="这里是提示文字" />
        <StepItem status="wait" title="未进行的步骤" content="这里是提示文字" />
      </Steps>
      <Steps style={{ marginTop: 16 }}>
        <StepItem status="finish" title="已完成的步骤" content="这里是提示文字" />
        <StepItem status="process" title="进行中的步骤" content="这里是提示文字" />
        <StepItem status="error" title="错误的步骤" content="优先展示`t-step`中设置的 status" />
        <StepItem status="wait" title="未进行的步骤" content="这里是提示文字" />
      </Steps>
    </>
  );
}
