// @ts-nocheck
import React, { Fragment, useState } from 'react';
import { Menu } from 'tdesign-react';
import { UserIcon } from 'tdesign-icons-react';

const { HeadMenu, SubMenu, MenuItem } = Menu;

function Multiple() {
  const [active, setActive] = useState('0');
  const [darkActive, setDarkActive] = useState('1');

  return (
    <Fragment>
      <HeadMenu
        value={active}
        expandType="popup"
        onChange={(v) => setActive(v)}
        logo={<img src="https://tdesign.gtimg.com/site/baseLogo-light.png" width="136" alt="logo" />}
        style={{ marginBottom: 20 }}
      >
        <SubMenu value="0" title="电器">
          <SubMenu value="0-1" title="电视">
            <MenuItem value="xiaomi">小米电视</MenuItem>
            <MenuItem value="soni">索尼电视</MenuItem>
            <MenuItem value="huawei">华为电视</MenuItem>
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
        <MenuItem value="9">其他</MenuItem>
      </HeadMenu>
      {/* 暗黑模式 */}
      <HeadMenu
        theme="dark"
        value={darkActive}
        expandType="popup"
        onChange={(v) => setDarkActive(v)}
        logo={<img src="https://tdesign.gtimg.com/site/baseLogo-dark.png" width="136" alt="logo" />}
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
        <SubMenu value="sub-2" title="水果蔬菜" icon={<UserIcon />}>
          <MenuItem value="5">
            <span>苹果</span>
          </MenuItem>
          <MenuItem value="6">黄瓜</MenuItem>
        </SubMenu>
        <MenuItem value="9">其他</MenuItem>
      </HeadMenu>
    </Fragment>
  );
}

export default Multiple;
