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

import { Pagination } from "tdesign-react";

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: "pagination", value: "pagination" }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  const defaultProps = { total: 30 };
  useEffect(() => {
    setRenderComp(<Pagination {...defaultProps} {...changedProps} />);
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
