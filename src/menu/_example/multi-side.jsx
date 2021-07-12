// @ts-nocheck
import React, { useState } from 'react';
import { Menu, SubMenu, MenuItem, UserIcon, InternetIcon } from '@tencent/tdesign-react';

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
        collapsed ? null : (
          <img src="https://main.qcloudimg.com/raw/9fe1217de2bd7eb623f70648a046e341/head-logo.png" alt="logo" />
        )
      }
    >
      <SubMenu value="0" title={<span>菜单1</span>} icon={<UserIcon />}>
        <MenuItem value="0-1">
          <span>子菜单1</span>
        </MenuItem>
        <MenuItem value="0-2">
          <span>子菜单2</span>
        </MenuItem>
      </SubMenu>
      <MenuItem value="7" disabled>
        <span>菜单二</span>
      </MenuItem>
      <SubMenu value="sub-2" title={<span>菜单三</span>} icon={<UserIcon />}>
        <SubMenu value="sub-3" title={<span>二级菜单-1</span>} icon={<UserIcon />}>
          <MenuItem value="5">
            <span>三级菜单-1</span>
          </MenuItem>
        </SubMenu>
        <SubMenu value="sub-4" title={<span>二级菜单-2</span>} icon={<InternetIcon />}>
          <MenuItem value="6">
            <span>三级菜单-2</span>
          </MenuItem>
        </SubMenu>
      </SubMenu>
      <MenuItem value="9">
        <span>菜单四</span>
      </MenuItem>
    </Menu>
  );
}

export default MultiSide;
