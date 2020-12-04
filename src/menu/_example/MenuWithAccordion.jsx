import React, { useState } from 'react';
import { Menu, MenuItem, SubMenu, MenuItemGroup } from '@tencent/tdesign-react';
const Logo = () => (
  <img src="https://main.qcloudimg.com/raw/9fe1217de2bd7eb623f70648a046e341/head-logo.png" alt="logo" />
);
export default function BasicUsage() {
  const [active, setActive] = useState(null);
  const [expand, setExpand] = useState([]);

  return (
    <Menu
      theme="dark"
      active={active}
      onChange={(v) => setActive(v)}
      onExpand={(name, allExpand) => {
        if (allExpand.includes(name)) {
          setExpand([...allExpand.filter((x) => x !== name)]);
        } else {
          setExpand([...expand, name]);
        }
      }}
      expand={expand}
      logo={<Logo />}
      options="自定义"
    >
      <MenuItem name="1">菜单一</MenuItem>
      <MenuItemGroup title="分组一">
        <SubMenu name="sub-1" title="菜单二">
          <MenuItem name="3">子菜单2-1</MenuItem>
          <MenuItem name="4">子菜单2-2</MenuItem>
        </SubMenu>
        <SubMenu name="sub-2" title="菜单三">
          <MenuItem name="5">子菜单3-1</MenuItem>
          <MenuItem name="6">子菜单3-2</MenuItem>
        </SubMenu>
      </MenuItemGroup>
      <SubMenu name="sub-3" title="菜单四">
        <MenuItem name="7">子菜单4-1</MenuItem>
        <MenuItem name="8">子菜单4-2</MenuItem>
      </SubMenu>
      <MenuItem name="9" disabled>
        菜单五
      </MenuItem>
    </Menu>
  );
}
