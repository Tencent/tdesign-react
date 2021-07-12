// @ts-nocheck
import React, { useState } from 'react';
import { HeadMenu, SubMenu, MenuItem, InternetIcon, UserIcon } from '@tencent/tdesign-react';

function Multiple() {
  const [active, setActive] = useState('0');

  return (
    <HeadMenu
      value={active}
      expandType="popup"
      onChange={(v) => setActive(v)}
      logo={
        <img
          className="margin_0"
          src="https://main.qcloudimg.com/raw/9fe1217de2bd7eb623f70648a046e341/head-logo.png"
          alt="logo"
        />
      }
    >
      <SubMenu value="0" title="电器">
        <MenuItem value="0-1">
          <span>电视</span>
        </MenuItem>
        <MenuItem value="0-2">
          <span>冰箱</span>
        </MenuItem>
      </SubMenu>
      <MenuItem value="7" disabled>
        女装
      </MenuItem>
      <SubMenu value="sub-2" title="水果蔬菜" icon={<UserIcon />}>
        <SubMenu value="sub-3" title="水果" icon={<UserIcon />}>
          <MenuItem value="5">
            <span>苹果</span>
          </MenuItem>
        </SubMenu>
        <SubMenu value="sub-4" title="蔬菜" icon={<InternetIcon />}>
          <MenuItem value="6">黄瓜</MenuItem>
        </SubMenu>
      </SubMenu>
      <MenuItem value="9">其他</MenuItem>
    </HeadMenu>
  );
}

export default Multiple;
