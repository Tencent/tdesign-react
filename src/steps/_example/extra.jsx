import React, { useState } from 'react';
import { Steps, Button } from 'tdesign-react';

const { StepItem } = Steps;

export default function HorizontalStepsWithNumbers() {
  const [current, setCurrent] = useState(1);

  const preBtn = (
    <Button
      size={'small'}
      onClick={() => {
        setCurrent(current - 1);
      }}
    >
      pre
    </Button>
  );

  const preTextBtn = (
    <Button
      size={'small'}
      variant="text"
      onClick={() => {
        setCurrent(current - 1);
      }}
    >
      pre
    </Button>
  );

  const nextBtn = (
    <Button
      size={'small'}
      onClick={() => {
        setCurrent(current + 1);
      }}
    >
      Next
    </Button>
  );

  const preNextBtnGroup = (
    <>
      {preTextBtn}
      <div style={{ display: 'inline', marginLeft: 4 }}>{nextBtn}</div>
    </>
  );

  return (
    <Steps layout="vertical" defaultCurrent={current}>
      <StepItem title="步骤1" content="这里是提示文字">
        {current === 0 ? nextBtn : null}
      </StepItem>
      <StepItem title="步骤2" content="这里是提示文字">
        {current === 1 ? preNextBtnGroup : null}
      </StepItem>
      <StepItem title="步骤3" content="这里是提示文字">
        {current === 2 ? preNextBtnGroup : null}
      </StepItem>
      <StepItem title="步骤4" content="这里是提示文字">
        {current === 3 ? preBtn : null}
      </StepItem>
    </Steps>
  );
}
