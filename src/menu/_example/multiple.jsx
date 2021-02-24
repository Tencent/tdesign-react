import React, { useState } from 'react';
import { HeadMenu, MenuItem, SubMenu } from '@tencent/tdesign-react';

export default function BasicUsage() {
  const [active, setActive] = useState('1');

  return (
    <HeadMenu
      active={active}
      onChange={(v) => {
        setActive(String(v));
      }}
    >
      <MenuItem name="1">菜单一</MenuItem>
      <SubMenu name="sub-2" title="菜单二">
        <MenuItem name="3">子菜单2-1</MenuItem>
        <MenuItem name="4">子菜单2-2</MenuItem>
      </SubMenu>
      <SubMenu name="sub-3" title="菜单三">
        <MenuItem name="7">子菜单3-1</MenuItem>
        <MenuItem name="8">子菜单3-2</MenuItem>
      </SubMenu>
    </HeadMenu>
  );
}
