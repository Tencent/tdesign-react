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

import { Menu } from "tdesign-react";

import { CodeIcon, AppIcon, FileIcon } from "tdesign-icons-react";

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [
    { label: "menu", value: "menu" },
    { label: "headMenu", value: "headMenu" },
  ];
  const defaultProps = {
    logo: (
      <img
        src="https://www.tencent.com/img/index/menu_logo_hover.png"
        width="136"
      />
    ),
  };
  const panelMap = {
    menu: (
      <div
        style={{
          padding: 24,
          background: "var(--bg-color-page)",
          borderRadius: 3,
        }}
      >
        <Menu {...changedProps}>
          <Menu.MenuItem value="0" icon={<AppIcon />}>
            仪表盘
          </Menu.MenuItem>
          <Menu.SubMenu
            value="1"
            title={<span>资源列表</span>}
            icon={<CodeIcon />}
          >
            <Menu.MenuItem value="1-1" disabled>
              <span>菜单二</span>
            </Menu.MenuItem>
          </Menu.SubMenu>
          <Menu.SubMenu
            value="2"
            title={<span>调度平台</span>}
            icon={<FileIcon />}
          >
            <Menu.SubMenu value="2-1" title="二级菜单-1">
              <Menu.MenuItem value="3-1">三级菜单-1</Menu.MenuItem>
              <Menu.MenuItem value="3-2">三级菜单-2</Menu.MenuItem>
              <Menu.MenuItem value="3-3">三级菜单-3</Menu.MenuItem>
            </Menu.SubMenu>
            <Menu.MenuItem value="2-2">
              <span>二级菜单-2</span>
            </Menu.MenuItem>
          </Menu.SubMenu>
        </Menu>
      </div>
    ),
    headMenu: (
      <div
        style={{
          padding: 24,
          background: "var(--bg-color-page)",
          borderRadius: 3,
        }}
      >
        <Menu.HeadMenu {...defaultProps} {...changedProps}>
          <Menu.MenuItem value="0">
            <span>菜单1</span>
          </Menu.MenuItem>
          <Menu.MenuItem value="1">
            <span>菜单2</span>
          </Menu.MenuItem>
        </Menu.HeadMenu>
      </div>
    ),
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
