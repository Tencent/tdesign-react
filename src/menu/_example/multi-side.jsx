// @ts-nocheck
import React, { useState } from 'react';
import { Menu, SubMenu, MenuItem, AppIcon, CodeIcon, FileIcon, UserIcon } from '@tencent/tdesign-react';

function MultiSide() {
  const [active, setActive] = useState('0');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Menu
      value={active}
      // expandType="popup"
      collapsed={collapsed}
      onCollapsed={({ collapsed }) => setCollapsed(collapsed)}
      expandMutex
      width={265}
      onChange={(v) => setActive(v)}
      logo={
        collapsed ? null : <img src="https://www.tencent.com/img/index/menu_logo_hover.png" width="136" alt="logo" />
      }
    >
      <SubMenu value="0" title="仪表盘" icon={<AppIcon />}>
        <MenuItem value="0-1">
          <span>子菜单1</span>
        </MenuItem>
        <MenuItem value="0-2">
          <span>子菜单2</span>
        </MenuItem>
      </SubMenu>
      <SubMenu value="1" title={<span>菜单1</span>} icon={<CodeIcon />}>
        <MenuItem value="1-1" disabled>
          <span>菜单二</span>
        </MenuItem>
      </SubMenu>
      <SubMenu value="2" title={<span>菜单三</span>} icon={<FileIcon />}>
        <MenuItem value="2-1">
          <span>三级菜单-1</span>
        </MenuItem>
        <MenuItem value="2-2">
          <span>三级菜单-2</span>
        </MenuItem>
      </SubMenu>
      <SubMenu value="3" title={<span>菜单三</span>} icon={<UserIcon />}>
        <MenuItem value="3-1">
          <span>三级菜单-1</span>
        </MenuItem>
        <MenuItem value="3-2">
          <span>三级菜单-2</span>
        </MenuItem>
      </SubMenu>
    </Menu>
  );
}

export default MultiSide;
