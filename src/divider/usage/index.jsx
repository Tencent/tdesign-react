/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from "react";
import BaseUsage, { useConfigChange } from "@site/src/components/BaseUsage";
import jsxToString from "jsx-to-string";
import configList from "./props.json";

import { Divider } from "tdesign-react";

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  const renderComp = (
    <div style={{ width: 200 }}>
      <span>正直</span>
      <Divider {...changedProps}>TDesign</Divider>
      <span>进取</span>
      <Divider {...changedProps}>TDesign</Divider>
      <span>合作</span>
      <Divider {...changedProps}>TDesign</Divider>
      <span>创新</span>
    </div>
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
