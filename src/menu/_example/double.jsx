// @ts-nocheck
import React, { useState } from 'react';
import { HeadMenu, SubMenu, MenuItem } from '@tencent/tdesign-react';

function Double() {
  const [active, setActive] = useState('1');

  return (
    <HeadMenu
      theme="dark"
      value={active}
      onChange={(v) => setActive(v)}
      logo={
        <img
          className="tdesign-demo-menu__logo"
          src="https://main.qcloudimg.com/raw/4927884bb0c43e726c5915d5bef49ef3/head-logo-dark.png"
          alt="logo"
        />
      }
    >
      <SubMenu value="sub-0" title="菜单1">
        <MenuItem value="1">子菜单1</MenuItem>
        <MenuItem value="2">子菜单2</MenuItem>
      </SubMenu>
      <SubMenu value="sub-1" title="菜单2">
        <MenuItem value="3">
          <span>子菜单1</span>
        </MenuItem>
        <MenuItem value="4">
          <span>子菜单2</span>
        </MenuItem>
      </SubMenu>
      <SubMenu value="sub-2" title="菜单3">
        <MenuItem value="5">
          <span>二级菜单-1</span>
        </MenuItem>
        <MenuItem value="6">
          <span>二级菜单-2</span>
        </MenuItem>
      </SubMenu>
      <SubMenu value="sub-3" title="菜单4">
        <MenuItem value="7">
          <span>菜单四</span>
        </MenuItem>
      </SubMenu>
    </HeadMenu>
  );
}

export default Double;
