// @ts-nocheck
import React, { useState } from 'react';
import { Menu, Button } from 'tdesign-react';
import { AppIcon, CodeIcon, FileIcon, UserIcon, ViewListIcon, MailIcon, RollbackIcon } from 'tdesign-icons-react';

const { SubMenu, MenuItem } = Menu;

function ClosableSide() {
  const [active, setActive] = useState('1-1');
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Menu
      value={active}
      collapsed={collapsed}
      expandMutex={false}
      onChange={(v) => setActive(v)}
      operations={
        <Button variant="text" shape="square" icon={<ViewListIcon />} onClick={() => setCollapsed(!collapsed)} />
      }
      logo={<span>LOGO</span>}
    >
      <MenuItem value="0" icon={<AppIcon />}>
        仪表盘
      </MenuItem>
      <SubMenu value="1" title={<span>资源列表</span>} icon={<CodeIcon />}>
        <MenuItem value="1-1" disabled>
          <span>菜单二</span>
        </MenuItem>
      </SubMenu>
      <SubMenu value="2" title={<span>调度平台</span>} icon={<FileIcon />}>
        <MenuItem value="2-1">
          <span>三级菜单-1</span>
        </MenuItem>
        <MenuItem value="2-2">
          <span>三级菜单-2</span>
        </MenuItem>
      </SubMenu>
      <SubMenu value="3" title={<span>精准监控</span>} icon={<UserIcon />}>
        <MenuItem value="3-1">
          <span>三级菜单-1</span>
        </MenuItem>
        <MenuItem value="3-2">
          <span>三级菜单-2</span>
        </MenuItem>
      </SubMenu>
      <MenuItem value="4" disabled icon={<RollbackIcon />}>
        根目录
      </MenuItem>
      <SubMenu value="5" title={<span>消息区</span>} icon={<MailIcon />}>
        <MenuItem value="5-1">
          <span>三级菜单-1</span>
        </MenuItem>
        <MenuItem value="5-2">
          <span>三级菜单-2</span>
        </MenuItem>
      </SubMenu>
    </Menu>
  );
}

export default ClosableSide;
