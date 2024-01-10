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

import { Descriptions } from "tdesign-react";

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: "descriptions", value: "descriptions" }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  const { DescriptionsItem } = Descriptions;
  useEffect(() => {
    setRenderComp(
      <Descriptions title="Shipping address" {...changedProps}>
        <DescriptionsItem label="Name">TDesign</DescriptionsItem>
        <DescriptionsItem label="Telephone Number">
          139****0609
        </DescriptionsItem>
        <DescriptionsItem label="Area">
          China Tencent Headquarters
        </DescriptionsItem>
        <DescriptionsItem label="Address" content="test">
          Shenzhen Penguin Island D1 4A Mail Center
        </DescriptionsItem>
      </Descriptions>
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
