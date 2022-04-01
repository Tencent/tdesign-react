/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from "react";
import BaseUsage, { useConfigChange } from "@site/src/components/BaseUsage";
import jsxToString from "jsx-to-string";
import configList from "./props.json";

import { Transfer } from "tdesign-react";

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      value: i.toString(),
      label: "内容" + i,
      disabled: i % 4 < 1,
    });
  }
  const defaultProps = { data };
  const renderComp = <Transfer {...defaultProps} {...changedProps} />;

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
