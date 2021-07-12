// @ts-nocheck
import React, { useState } from 'react';
import { Menu, MenuItem } from '@tencent/tdesign-react';

function SingleSide() {
  const [active, setActive] = useState('0');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Menu
      value={active}
      onChange={(v) => setActive(v)}
      onCollapsed={({ collapsed }) => setCollapsed(collapsed)}
      logo={
        collapsed ? null : (
          <img src="https://www.tencent.com/img/index/menu_logo_hover.png" width="136" alt="logo" />
        )
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
    </Menu>
  );
}

export default SingleSide;
