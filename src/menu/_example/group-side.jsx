// @ts-nocheck
import React, { useState } from 'react';
import { Menu } from 'tdesign-react';
import { ViewListIcon, ChartIcon } from 'tdesign-icons-react';

const { MenuGroup, MenuItem } = Menu;

function GroupSide() {
  const [value, setValue] = useState('1');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Menu
      value={value}
      onChange={(value) => setValue(value)}
      collapsed={collapsed}
      operations={<ViewListIcon onClick={() => setCollapsed(!collapsed)} />}
      logo={<img src="https://www.tencent.com/img/index/menu_logo_hover.png" width="136" alt="logo" />}
    >
      <MenuGroup title="Classification A">
        <MenuItem value="1" icon={<ChartIcon />}>
          仪表盘
        </MenuItem>
      </MenuGroup>
      <MenuGroup title="Classification B">
        <MenuItem value="2">调度平台</MenuItem>
        <MenuItem value="3">菜单内容二很长很长很长很长很长很长很长很长</MenuItem>
      </MenuGroup>
      <MenuGroup title="Classification C">
        <MenuItem value="4">精准监控</MenuItem>
      </MenuGroup>
    </Menu>
  );
}

export default GroupSide;
