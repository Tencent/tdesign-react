import React, { useState } from 'react';
import { HeadMenu, MenuItem } from '@tencent/tdesign-react';

const Logo = () => (
  <img
    style={{
      width: '140px',
      height: '30px',
      position: 'relative',
      top: '17px',
      left: '24px',
      background: '#5b6270',
      borderRadius: '3px',
    }}
    src="https://main.qcloudimg.com/raw/4927884bb0c43e726c5915d5bef49ef3/head-logo-dark.png"
    alt="logo"
  />
);
const Options = () => (
  <div
    style={{
      width: '70px',
      height: '40px',
      lineHeight: '40px',
      margin: '12px',
      background: 'hsla(0,0%,100%,.2)',
      textAlign: 'center',
      color: '#fff',
    }}
  >
    自定义
  </div>
);
export default function BasicUsage() {
  const [active, setActive] = useState('1');
  return (
    <HeadMenu
      theme="dark"
      active={active}
      logo={<Logo />}
      options={<Options />}
      onChange={(v) => {
        setActive(String(v));
      }}
    >
      <MenuItem name="1">菜单一</MenuItem>

      <MenuItem name="2">菜单二</MenuItem>
      <MenuItem name="3" disabled>
        菜单三
      </MenuItem>
    </HeadMenu>
  );
}
