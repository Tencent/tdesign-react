// @ts-nocheck
import React, { useState } from 'react';
import { Menu } from 'tdesign-react';
import { ViewListIcon, ChartIcon, FileIcon } from 'tdesign-icons-react';

const { MenuGroup, MenuItem, SubMenu } = Menu;

function GroupSide() {
  const [value, setValue] = useState('1');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Menu
      value={value}
      onChange={(value) => setValue(value)}
      collapsed={collapsed}
      operations={<ViewListIcon onClick={() => setCollapsed(!collapsed)} />}
      logo={
        collapsed ? (
          <img
            src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/logo%402x.png"
            width="35"
            alt="logo"
          />
        ) : (
          <img src="https://www.tencent.com/img/index/menu_logo_hover.png" width="136" alt="logo" />
        )
      }
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
        <SubMenu value="5" title={<span>资源列表</span>} icon={<FileIcon />}>
          <MenuGroup title="inner Classification D">
            <SubMenu value="2-1" title="二级菜单-1">
              <MenuGroup title="inner Classification E">
                <MenuItem value="3-1">三级菜单-1</MenuItem>
              </MenuGroup>
              <MenuItem value="3-2">三级菜单-2</MenuItem>
              <MenuItem value="3-3">三级菜单-3</MenuItem>
            </SubMenu>
          </MenuGroup>
          <MenuGroup title="inner Classification E">
            <MenuItem value="2-2">
              <span>二级菜单-2</span>
            </MenuItem>
          </MenuGroup>
        </SubMenu>
      </MenuGroup>
    </Menu>
  );
}

export default GroupSide;
