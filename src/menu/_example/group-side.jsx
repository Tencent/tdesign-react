// @ts-nocheck
import React, { useState } from 'react';
import { Menu, Button } from 'tdesign-react';
import {
  ViewListIcon,
  ServerIcon,
  Edit1Icon,
  RootListIcon,
  CheckIcon,
  UserIcon,
  AppIcon,
  LoginIcon,
} from 'tdesign-icons-react';

const { MenuGroup, MenuItem, SubMenu } = Menu;

function GroupSide() {
  const [value, setValue] = useState('1');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Menu
      value={value}
      onChange={(value) => setValue(value)}
      collapsed={collapsed}
      operations={
        <Button variant="text" shape="square" icon={<ViewListIcon />} onClick={() => setCollapsed(!collapsed)} />
      }
      logo={
        collapsed ? (
          <img
            src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/logo%402x.png"
            width="35"
            alt="logo"
          />
        ) : (
          <img src="https://tdesign.gtimg.com/site/baseLogo-light.png" width="136" alt="logo" />
        )
      }
    >
      <MenuGroup title="主导航">
        <MenuItem value="item1" icon={<AppIcon />}>
          仪表盘
        </MenuItem>
      </MenuGroup>
      <MenuGroup title="组件">
        <SubMenu title="列表项" value="2-1" icon={<ServerIcon />}>
          <MenuItem value="2-1-1">基础列表项</MenuItem>
          <MenuItem value="2-1-2">卡片列表项</MenuItem>
          <MenuItem value="2-1-3">筛选列表项</MenuItem>
          <MenuItem value="2-1-4">树状筛选列表项</MenuItem>
        </SubMenu>
        <MenuItem value="2-2" icon={<Edit1Icon />}>
          表单项
        </MenuItem>
        <MenuItem value="2-3" icon={<RootListIcon />}>
          详情页
        </MenuItem>
        <MenuItem value="2-4" icon={<CheckIcon />}>
          结果页
        </MenuItem>
      </MenuGroup>
      <MenuGroup title="更多">
        <MenuItem value="item3" icon={<UserIcon />}>
          个人页
        </MenuItem>
        <MenuItem value="item4" icon={<LoginIcon />}>
          登录页
        </MenuItem>
      </MenuGroup>
    </Menu>
  );
}

export default GroupSide;
