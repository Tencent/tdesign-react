import React from "react";
import { Steps, Step } from "@tdesign/react/steps";

export default function HorizontalStepsWithNumbers() {
  return (
    <>
      <Steps direction="vertical" sequence="reverse" current={2}>
        <Step title="未进行的步骤" content="这里是提示文字"></Step>
        <Step title="未进行的步骤" content="这里是提示文字"></Step>
        <Step title="进行中的步骤" content="这里是提示文字"></Step>
        <Step title="已完成的步骤" content="这里是提示文字"></Step>
      </Steps>
    </>
  );
}
