import React, { useState } from 'react';
import { Steps } from '@tencent/tdesign-react';

const { StepItem } = Steps;

export default function OperateSteps() {
  const [current, setCurrent] = useState(1);

  const onChange = (current, previous) => {
    console.log(current, previous);
  };

  const goNextStep = () => {
    setCurrent(current + 1);
  };

  const goPreviousStep = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <button className="t-button t-button--primary t-size-s" onClick={goPreviousStep}>
        上一步
      </button>
      <button className="t-button t-button--line t-size-s" onClick={goNextStep}>
        下一步
      </button>
      <br />
      <br />
      <Steps current={current} onChange={onChange}>
        <StepItem title="步骤1" content="这里是提示文字"></StepItem>
        <StepItem title="步骤2" content="这里是提示文字"></StepItem>
        <StepItem title="步骤3" content="这里是提示文字"></StepItem>
        <StepItem title="步骤4" content="这里是提示文字"></StepItem>
      </Steps>

      <Steps direction="vertical" current={current}>
        <StepItem title="步骤1" content="这里是提示文字"></StepItem>
        <StepItem title="步骤3" content="这里是提示文字"></StepItem>
        <StepItem title="步骤4" content="这里是提示文字"></StepItem>
        <StepItem title="步骤5" content="这里是提示文字"></StepItem>
      </Steps>
    </>
  );
}
