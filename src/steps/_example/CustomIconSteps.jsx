import React from 'react';
import { Steps } from '@tdesign/react';

const { Step } = Steps;

export default function BasicStepsExample() {
  return (
    <>
      <Steps>
        <Step icon="success-fill" title="已完成的步骤" content="这里是提示文字"></Step>
        <Step icon="success-fill" title="进行中的步骤" content="这里是提示文字"></Step>
        <Step icon="success-fill" title="未进行的步骤" content="这里是提示文字"></Step>
        <Step icon="success-fill" title="未进行的步骤" content="这里是提示文字"></Step>
      </Steps>
    </>
  );
}
