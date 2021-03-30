import React, { useState } from 'react';
import { Menu, MenuItem } from '@tencent/tdesign-react';

const Logo = () => (
  <img src="https://main.qcloudimg.com/raw/9fe1217de2bd7eb623f70648a046e341/head-logo.png" alt="logo" />
);

export default function BasicUsage() {
  const [active, setActive] = useState('1');
  return (
    <Menu theme="dark" logo={<Logo />} options="自定义" active={active} onChange={(v) => setActive(String(v))}>
      <MenuItem name="1">菜单一</MenuItem>
      <MenuItem name="2">菜单二</MenuItem>
      <MenuItem name="3" disabled>
        菜单三
      </MenuItem>
      <MenuItem name="2">菜单四</MenuItem>
      <MenuItem name="2">菜单五</MenuItem>
    </Menu>
  );
}
