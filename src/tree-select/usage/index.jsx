/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from "react";
import BaseUsage, { useConfigChange } from "@site/src/components/BaseUsage";
import jsxToString from "jsx-to-string";
import configList from "./props.json";

import { TreeSelect } from "tdesign-react";

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  const defaultProps = {
    data: [
      {
        label: "广东省",
        value: "guangdong",
        children: [
          {
            label: "广州市",
            value: "guangzhou",
          },
          {
            label: "深圳市",
            value: "shenzhen",
          },
        ],
      },
      {
        label: "江苏省",
        value: "jiangsu",
        children: [
          {
            label: "南京市",
            value: "nanjing",
          },
          {
            label: "苏州市",
            value: "suzhou",
          },
        ],
      },
    ],
  };
  const renderComp = <TreeSelect {...defaultProps} {...changedProps} />;

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
