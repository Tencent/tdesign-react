import React, { useState } from 'react';
import { HeadMenu, MenuItem, SubMenu } from '@tdesign/react';

export default function BasicUsage() {
  const [active, setActive] = useState('1');

  return (
    <HeadMenu
      theme="dark"
      mode="title"
      active={active}
      onChange={(v) => {
        setActive(String(v));
      }}
    >
      <MenuItem name="1">菜单一</MenuItem>
      <SubMenu name="sub-2" title="菜单二">
        <MenuItem name="3">子菜单一</MenuItem>
        <MenuItem name="4">子菜单二</MenuItem>
        <MenuItem name="5">子菜单三</MenuItem>
      </SubMenu>
    </HeadMenu>
  );
}
