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

import { TreeSelect } from "tdesign-react";

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: "tree", value: "tree" }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

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
  useEffect(() => {
    setRenderComp(<TreeSelect {...defaultProps} {...changedProps} />);
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
