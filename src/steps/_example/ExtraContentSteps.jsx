import React from "react";
import { Steps, Step } from "@tdesign/react/steps";

export default function HorizontalStepsWithNumbers() {
  return (
    <>
      <Steps direction="vertical" current={2}>
        <Step title="已完成" content="这里是提示文字">
          <button className="t-button t-button--primary t-size-s">按钮</button>
          <button className="t-button t-button--line t-size-s">按钮</button>
        </Step>
        <Step title="进行中" content="这里是提示文字"></Step>
        <Step title="未进行" content="这里是提示文字"></Step>
        <Step title="未进行" content="这里是提示文字"></Step>
      </Steps>
    </>
  );
}
