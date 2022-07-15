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

import baseTableConfigProps from "./base-table-props.json";

import { Table } from "tdesign-react";

export default function Usage() {
  const [configList, setConfigList] = useState(baseTableConfigProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [
    { label: "baseTable", value: "baseTable", config: baseTableConfigProps },
  ];

  const data = Array(30)
    .fill(0)
    .map((_, i) => ({
      index: i,
      platform: "公有",
      description: "数据源",
    }));

  const columns = [
    { colKey: "index", title: "index" },
    { colKey: "platform", title: "平台" },
    { colKey: "description", title: "说明" },
  ];

  const defaultProps = {
    data,
    columns,
    maxHeight: 140,
    pagination: { total: 30, defaultPageSize: 10 },
  };

  const panelMap = {
    baseTable: <Table {...defaultProps} {...changedProps} />,
  };

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  useEffect(() => {
    setRenderComp(panelMap[panel]);
  }, [changedProps, panel]);

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
