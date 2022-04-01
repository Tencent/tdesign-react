/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from "react";
import BaseUsage, { useConfigChange } from "@site/src/components/BaseUsage";
import jsxToString from "jsx-to-string";
import configList from "./props.json";

import { Pagination } from "tdesign-react";

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  const defaultProps = { total: 30 };
  const renderComp = (
    <div>
      <Pagination {...defaultProps} {...changedProps} />
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
