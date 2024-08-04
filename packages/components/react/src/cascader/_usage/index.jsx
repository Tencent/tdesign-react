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

import { Cascader } from "tdesign-react";

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: "cascader", value: "cascader" }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

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
  useEffect(() => {
    setRenderComp(<Cascader {...defaultProps} {...changedProps} />);
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
