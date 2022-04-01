/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from "react";
import BaseUsage, { useConfigChange } from "@site/src/components/BaseUsage";
import jsxToString from "jsx-to-string";
import configList from "./props.json";

import { Cascader } from "tdesign-react";

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  const defaultProps = {
    options: [
      {
        label: "选项一",
        value: "1",
        children: [
          { label: "子选项一", value: "1.1" },
          { label: "子选项二", value: "1.2" },
        ],
      },
      {
        label: "选项二",
        value: "2",
        children: [
          { label: "子选项一", value: "2.1" },
          { label: "子选项二", value: "2.2" },
        ],
      },
    ],
  };
  const renderComp = <Cascader {...defaultProps} {...changedProps} />;

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
