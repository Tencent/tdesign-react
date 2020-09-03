import React from 'react';
import { HeadMenu, MenuItem, SubMenu } from '@tdesign/react';

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
  return (
    <HeadMenu theme="dark" mode="title" logo={<Logo />} options={<Options />}>
      <MenuItem name="1">导航一</MenuItem>
      <SubMenu name="sub-2" title="导航二">
        <MenuItem name="3">子导航一</MenuItem>
        <MenuItem name="4">子导航二</MenuItem>
        <MenuItem name="5">子导航三</MenuItem>
      </SubMenu>
    </HeadMenu>
  );
}
