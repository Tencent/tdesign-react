/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from "react";
import BaseUsage, { useConfigChange } from "@site/src/components/BaseUsage";
import jsxToString from "jsx-to-string";
import configList from "./props.json";

import { List } from "tdesign-react";

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  const avatarUrl = "https://tdesign.gtimg.com/list-icon.png";
  const listData = [
    { id: 1, content: "列表内容列表内容列表内容" },
    { id: 2, content: "列表内容列表内容列表内容" },
    { id: 3, content: "列表内容列表内容列表内容" },
  ];
  const renderComp = (
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
