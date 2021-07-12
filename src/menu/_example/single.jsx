// @ts-nocheck
import React, { useState } from 'react';
import { HeadMenu, MenuItem, UserAddIcon, AppIcon, CallIcon } from '@tencent/tdesign-react';

function Single() {
  const [active, setActive] = useState('0');

  return (
    <HeadMenu
      theme="light"
      value={active}
      onChange={(v) => setActive(v)}
      logo={
        <img
          className="margin_0"
          src="https://www.tencent.com/img/index/menu_logo_hover.png"
          width="136"
          alt="logo"
        />
      }
      operations={
        <>
          <UserAddIcon />
          <AppIcon />
          <CallIcon />
        </>
      }
    >
      <MenuItem value={'0'}>
        <span>菜单1</span>
      </MenuItem>
      <MenuItem value={'1'}>
        <span>菜单2</span>
      </MenuItem>
      <MenuItem value={'2'}>
        <span>菜单3</span>
      </MenuItem>
      <MenuItem value={'3'}>
        <span>菜单4</span>
      </MenuItem>
    </HeadMenu>
  );
}

export default Single;
