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

import { Progress } from "tdesign-react";

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: "progress", value: "progress" }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  const [percent, setPercent] = useState(0);
  const defaultProps = { percentage: percent };

  useEffect(() => {
    const timer = setInterval(
      () => setPercent((percent) => (percent % 100) + 10),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setRenderComp(
      <div style={{ width: 200 }}>
        <Progress {...defaultProps} {...changedProps} />
      </div>
    );
  }, [changedProps, percent]);

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
