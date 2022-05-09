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

import { List } from "tdesign-react";

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: "list:", value: "list:" }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  const avatarUrl = "https://tdesign.gtimg.com/list-icon.png";
  const listData = [
    { id: 1, content: "列表内容列表内容列表内容" },
    { id: 2, content: "列表内容列表内容列表内容" },
    { id: 3, content: "列表内容列表内容列表内容" },
  ];
  useEffect(() => {
    setRenderComp(
      <List {...changedProps}>
        {listData.map((item) => (
          <List.ListItem key={item.id}>
            <List.ListItemMeta
              image={avatarUrl}
              title="列表主内容"
              description="列表内容列表内容列表内容"
            />
          </List.ListItem>
        ))}
      </List>
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
