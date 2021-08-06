// @ts-nocheck
import React, { Fragment, useState } from 'react';
import { Menu, UserAddIcon, AppIcon, CallIcon } from '@tencent/tdesign-react';

const { HeadMenu, MenuItem } = Menu;

function Single() {
  const [active, setActive] = useState('0');
  const [darkActive, setDarkActive] = useState('1');

  return (
    <Fragment>
      <HeadMenu
        theme="light"
        value={active}
        onChange={(v) => setActive(v)}
        logo={<img src="https://www.tencent.com/img/index/menu_logo_hover.png" width="136" alt="logo" />}
        operations={
          <>
            <UserAddIcon />
            <AppIcon />
            <CallIcon />
          </>
        }
        style={{ marginBottom: 20 }}
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
      {/* 暗黑模式 */}
      <HeadMenu
        theme="dark"
        value={darkActive}
        onChange={(v) => setDarkActive(v)}
        logo={<img src="https://www.tencent.com/img/index/menu_logo.png" width="136" alt="logo" />}
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
    </Fragment>
  );
}

export default Single;
