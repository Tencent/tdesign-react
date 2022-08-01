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

import DatePickerConfigProps from "./date-picker-props.json";

import DateRangePickerConfigProps from "./date-range-picker-props.json";

import { DatePicker, DateRangePicker } from "tdesign-react";

export default function Usage() {
  const [configList, setConfigList] = useState(DatePickerConfigProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [
    { label: "datePicker", value: "datePicker", config: DatePickerConfigProps },
    {
      label: "dateRangePicker",
      value: "dateRangePicker",
      config: DateRangePickerConfigProps,
    },
  ];

  const panelMap = {
    datePicker: <DatePicker {...changedProps} />,
    dateRangePicker: <DateRangePicker {...changedProps} />,
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
