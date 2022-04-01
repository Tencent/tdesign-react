/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from "react";
import BaseUsage, { useConfigChange } from "@site/src/components/BaseUsage";
import jsxToString from "jsx-to-string";
import configList from "./props.json";

import { Steps } from "tdesign-react";

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  const defaultProps = { current: 1 };
  const renderComp = (
    <Steps {...defaultProps} {...changedProps}>
      <Steps.StepItem title="步骤1" content="提示文字" />
      <Steps.StepItem title="步骤2" content="提示文字" />
      <Steps.StepItem title="步骤3" content="提示文字" />
    </Steps>
  );

  const jsxStr = jsxToString(renderComp);

  return (
    <BaseUsage
      code={jsxStr}
      configList={configList}
      onConfigChange={onConfigChange}
    >
      {renderComp}
    </BaseUsage>
  );
}
