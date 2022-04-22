/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import BaseUsage, {
  useConfigChange,
  usePanelChange,
} from "@site/src/components/BaseUsage";
import jsxToString from "react-element-to-jsx-string";

import configProps from "./props.json";

import { Tabs } from "tdesign-react";

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: "tabs", value: "tabs" }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  const defaultProps = { defaultValue: "1" };
  useEffect(() => {
    setRenderComp(
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
  }, [changedProps]);

  const jsxStr = useMemo(() => {
    if (!renderComp) return "";
    return jsxToString(renderComp);
  }, [renderComp]);

  return (
    <BaseUsage
      code={jsxStr}
      panelList={panelList}
      configList={configList}
      onPanelChange={onPanelChange}
      onConfigChange={onConfigChange}
    >
      {renderComp}
    </BaseUsage>
  );
}
