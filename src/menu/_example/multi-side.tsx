// @ts-nocheck
import React, { Fragment, useState } from 'react';
import { Menu, Button } from 'tdesign-react';
import { AppIcon, CodeIcon, FileIcon, UserIcon, ViewListIcon, MailIcon, RollbackIcon } from 'tdesign-icons-react';

const { SubMenu, MenuItem } = Menu;

function MultiSide() {
  const [active, setActive] = useState('1-1');
  const [collapsed, setCollapsed] = useState(false);
  const [expands, setExpands] = useState(['1', '2']);

  const [darkActive, setDarkActive] = useState('1-1');
  const [darkCollapsed, setDarkCollapsed] = useState(false);
  const [darkExpands, setDarkExpands] = useState(['1', '2']);

  return (
    <Fragment>
      <Menu
        value={active}
        collapsed={collapsed}
        expandMutex={false}
        expanded={expands}
        onExpand={(values) => setExpands(values)}
        onChange={(v) => setActive(v)}
        operations={
          <Button variant="text" shape="square" icon={<ViewListIcon />} onClick={() => setCollapsed(!collapsed)} />
        }
        style={{ marginRight: 20 }}
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
          <SubMenu value="2-1" title="二级菜单-1">
            <MenuItem value="2-1-1">三级菜单-1</MenuItem>
            <MenuItem value="2-1-2">三级菜单-2</MenuItem>
            <MenuItem value="2-1-3">三级菜单-3</MenuItem>
          </SubMenu>
          <MenuItem value="2-2">
            <span>二级菜单-2</span>
          </MenuItem>
        </SubMenu>
        <SubMenu value="3" title={<span>精准监控</span>} icon={<UserIcon />}>
          <MenuItem value="3-1">
            <span>二级菜单-1</span>
          </MenuItem>
          <MenuItem value="3-2">
            <span>二级菜单-2</span>
          </MenuItem>
        </SubMenu>
        <MenuItem value="4" disabled icon={<RollbackIcon />}>
          根目录
        </MenuItem>
        <SubMenu value="5" title={<span>消息区</span>} icon={<MailIcon />}>
          <MenuItem value="5-1">
            <span>二级菜单-1</span>
          </MenuItem>
          <MenuItem value="5-2">
            <span>二级菜单-2</span>
          </MenuItem>
        </SubMenu>
      </Menu>
      {/* 暗黑模式 */}
      <Menu
        theme="dark"
        value={darkActive}
        collapsed={darkCollapsed}
        expandMutex={false}
        expanded={darkExpands}
        onExpand={(values) => setDarkExpands(values)}
        onChange={(v) => setDarkActive(v)}
        operations={
          <div className="tdesign-demo-menu-collapse--dark">
            <Button
              variant="text"
              shape="square"
              icon={<ViewListIcon />}
              onClick={() => setDarkCollapsed(!darkCollapsed)}
            />
          </div>
        }
      >
        <MenuItem value="0" icon={<AppIcon />}>
          仪表盘
        </MenuItem>
        <SubMenu value="1" title={<span>资源列表</span>} icon={<CodeIcon />}>
          <SubMenu value="2-1" title="二级菜单-1">
            <MenuItem value="2-1-1">三级菜单-1</MenuItem>
            <MenuItem value="2-1-2">三级菜单-2</MenuItem>
            <MenuItem value="2-1-3">三级菜单-3</MenuItem>
          </SubMenu>
        </SubMenu>
        <SubMenu value="2" title={<span>调度平台</span>} icon={<FileIcon />}>
          <MenuItem value="2-1">
            <span>二级菜单-1</span>
          </MenuItem>
          <MenuItem value="2-2">
            <span>二级菜单-2</span>
          </MenuItem>
        </SubMenu>
        <SubMenu value="3" title={<span>精准监控</span>} icon={<UserIcon />}>
          <MenuItem value="3-1">
            <span>二级菜单-1</span>
          </MenuItem>
          <MenuItem value="3-2">
            <span>二级菜单-2</span>
          </MenuItem>
        </SubMenu>
        <MenuItem value="4" disabled icon={<RollbackIcon />}>
          根目录
        </MenuItem>
        <SubMenu value="5" title={<span>消息区</span>} icon={<MailIcon />}>
          <MenuItem value="5-1">
            <span>二级菜单-1</span>
          </MenuItem>
          <MenuItem value="5-2">
            <span>二级菜单-2</span>
          </MenuItem>
        </SubMenu>
      </Menu>
    </Fragment>
  );
}

export default MultiSide;
