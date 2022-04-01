/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from "react";
import BaseUsage, { useConfigChange } from "@site/src/components/BaseUsage";
import jsxToString from "jsx-to-string";
import configList from "./props.json";

import { Tabs } from "tdesign-react";

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  const defaultProps = { defaultValue: "1" };
  const renderComp = (
    <div
      style={{
        padding: 24,
        background: "var(--bg-color-page)",
        borderRadius: 3,
      }}
    >
      <Tabs {...defaultProps} {...changedProps}>
        <Tabs.TabPanel value="1" label="选项卡1">
          <div style={{ margin: 20 }}>选项卡1内容区</div>
        </Tabs.TabPanel>
        <Tabs.TabPanel value="2" label="选项卡2">
          <div style={{ margin: 20 }}>选项卡2内容区</div>
        </Tabs.TabPanel>
        <Tabs.TabPanel value="3" label="选项卡3">
          <div style={{ margin: 20 }}>选项卡3内容区</div>
        </Tabs.TabPanel>
      </Tabs>
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
