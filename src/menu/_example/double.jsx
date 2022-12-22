// @ts-nocheck
import React, { Fragment, useState } from 'react';
import { Menu } from 'tdesign-react';

const { HeadMenu, SubMenu, MenuItem } = Menu;

function Double() {
  const [active, setActive] = useState('1');
  const [darkActive, setDarkActive] = useState('1');

  return (
    <Fragment>
      <HeadMenu
        value={active}
        onChange={(v) => setActive(v)}
        logo={<img src="https://tdesign.gtimg.com/site/baseLogo-light.png" width="136" alt="logo" />}
        style={{ marginBottom: 20 }}
      >
        <SubMenu value="sub-0" title="菜单1">
          <MenuItem value="1">子菜单1</MenuItem>
          <MenuItem value="2">子菜单2</MenuItem>
        </SubMenu>
        <SubMenu value="sub-1" title="菜单2">
          <MenuItem value="3">
            <span>子菜单1</span>
          </MenuItem>
          <MenuItem value="4">
            <span>子菜单2</span>
          </MenuItem>
        </SubMenu>
        <SubMenu value="sub-2" title="菜单3">
          <MenuItem value="5">
            <span>二级菜单-1</span>
          </MenuItem>
          <MenuItem value="6">
            <span>二级菜单-2</span>
          </MenuItem>
        </SubMenu>
        <SubMenu value="sub-3" title="菜单4">
          <MenuItem value="7">
            <span>菜单四</span>
          </MenuItem>
        </SubMenu>
      </HeadMenu>
      {/* 暗黑模式 */}
      <HeadMenu
        theme="dark"
        value={darkActive}
        onChange={(v) => setDarkActive(v)}
        logo={<img src="https://tdesign.gtimg.com/site/baseLogo-dark.png" width="136" alt="logo" />}
      >
        <SubMenu value="sub-0" title="菜单1">
          <MenuItem value="1">子菜单1</MenuItem>
          <MenuItem value="2">子菜单2</MenuItem>
        </SubMenu>
        <SubMenu value="sub-1" title="菜单2">
          <MenuItem value="3">
            <span>子菜单1</span>
          </MenuItem>
          <MenuItem value="4">
            <span>子菜单2</span>
          </MenuItem>
        </SubMenu>
        <SubMenu value="sub-2" title="菜单3">
          <MenuItem value="5">
            <span>二级菜单-1</span>
          </MenuItem>
          <MenuItem value="6">
            <span>二级菜单-2</span>
          </MenuItem>
        </SubMenu>
        <SubMenu value="sub-3" title="菜单4">
          <MenuItem value="7">
            <span>菜单四</span>
          </MenuItem>
        </SubMenu>
      </HeadMenu>
    </Fragment>
  );
}

export default Double;
