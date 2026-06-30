import React, { Fragment, useState } from 'react';
import { UserIcon } from 'tdesign-icons-react';
import { Menu } from 'tdesign-react';

import type { MenuValue } from 'tdesign-react';

const { HeadMenu, SubMenu, MenuItem } = Menu;

function Multiple() {
  const [active, setActive] = useState<MenuValue>('0');
  const [darkActive, setDarkActive] = useState<MenuValue>('1');

  return (
    <Fragment>
      <HeadMenu
        value={active}
        expandType="popup"
        onChange={(v) => setActive(v)}
        logo={<img src="https://tdesign.gtimg.com/site/baseLogo-light.png" height="28" alt="logo" />}
        style={{ marginBottom: 20 }}
      >
        <SubMenu value="0" title="电器">
          <SubMenu value="0-1" title="电视">
            <MenuItem value="xiaomi">小米电视</MenuItem>
            <MenuItem value="sony">索尼电视</MenuItem>
            <MenuItem value="huawei">华为电视</MenuItem>
          </SubMenu>
          <MenuItem value="0-2">
            <span>冰箱</span>
          </MenuItem>
        </SubMenu>
        <MenuItem value="7" disabled>
          女装
        </MenuItem>
        <SubMenu value="sub-2" title="水果蔬菜" icon={<UserIcon />}>
          <MenuItem value="5">
            <span>苹果</span>
          </MenuItem>
          <MenuItem value="6">黄瓜</MenuItem>
        </SubMenu>
        <SubMenu value="9" title="其他">
          <MenuItem value="9-1">子菜单-9-1</MenuItem>
          <MenuItem value="9-2">子菜单-9-2</MenuItem>
          <MenuItem value="9-3">子菜单-9-3</MenuItem>
          <MenuItem value="9-4">子菜单-9-4</MenuItem>
          <MenuItem value="9-5">子菜单-9-5</MenuItem>
          <MenuItem value="9-6">子菜单-9-6</MenuItem>
          <MenuItem value="9-7">子菜单-9-7</MenuItem>
          <MenuItem value="9-8">子菜单-9-8</MenuItem>
          <MenuItem value="9-0">子菜单-9-9</MenuItem>
          <MenuItem value="9-10">子菜单-9-10</MenuItem>
          <MenuItem value="9-11">子菜单-9-11</MenuItem>
          <MenuItem value="9-12">子菜单-9-12</MenuItem>
          <MenuItem value="9-13">子菜单-9-13</MenuItem>
          <MenuItem value="9-14">子菜单-9-14</MenuItem>
          <MenuItem value="9-15">子菜单-9-15</MenuItem>
        </SubMenu>
      </HeadMenu>
      {/* 暗黑模式 */}
      <HeadMenu
        theme="dark"
        value={darkActive}
        expandType="popup"
        onChange={(v) => setDarkActive(v)}
        logo={<img src="https://tdesign.gtimg.com/site/baseLogo-dark.png" height="28" alt="logo" />}
        style={{ marginBottom: 20 }}
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
        <SubMenu
          value="sub-2"
          title="水果蔬菜"
          icon={<UserIcon />}
          popupProps={{
            overlayStyle: { fontWeight: 'normal' },
            overlayInnerStyle: { fontWeight: 'normal' },
            overlayClassName: 'sub-menu-custom-overlay-class',
            overlayInnerClassName: 'sub-menu-custom-overlay-inner-class',
          }}
        >
          <MenuItem value="5">
            <span>苹果</span>
          </MenuItem>
          <MenuItem value="6">黄瓜</MenuItem>
        </SubMenu>
        <SubMenu value="9" title="其他">
          <MenuItem value="9-1">子菜单-9-1</MenuItem>
          <MenuItem value="9-2">子菜单-9-2</MenuItem>
          <MenuItem value="9-3">子菜单-9-3</MenuItem>
          <MenuItem value="9-4">子菜单-9-4</MenuItem>
          <MenuItem value="9-5">子菜单-9-5</MenuItem>
          <MenuItem value="9-6">子菜单-9-6</MenuItem>
          <MenuItem value="9-7">子菜单-9-7</MenuItem>
          <MenuItem value="9-8">子菜单-9-8</MenuItem>
          <MenuItem value="9-0">子菜单-9-9</MenuItem>
          <MenuItem value="9-10">子菜单-9-10</MenuItem>
          <MenuItem value="9-11">子菜单-9-11</MenuItem>
          <MenuItem value="9-12">子菜单-9-12</MenuItem>
          <MenuItem value="9-13">子菜单-9-13</MenuItem>
          <MenuItem value="9-14">子菜单-9-14</MenuItem>
          <MenuItem value="9-15">子菜单-9-15</MenuItem>
        </SubMenu>
      </HeadMenu>
    </Fragment>
  );
}

export default Multiple;
