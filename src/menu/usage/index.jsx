/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from "react";
import BaseUsage, { useConfigChange } from "@site/src/components/BaseUsage";
import jsxToString from "jsx-to-string";
import configList from "./props.json";

import { Menu } from "tdesign-react";

import { CodeIcon, AppIcon, FileIcon } from "tdesign-icons-react";

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  const defaultProps = {
    style: { marginBottom: 20 },
    logo: (
      <img
        src="https://www.tencent.com/img/index/menu_logo_hover.png"
        width="136"
      />
    ),
  };
  const renderComp = (
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
