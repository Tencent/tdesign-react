// @ts-nocheck
import React, { Fragment, useState } from 'react';
import { Menu } from 'tdesign-react';

const { MenuItem } = Menu;

function SingleSide() {
  const [active, setActive] = useState('0');
  const [darkActive, setDarkActive] = useState('1');

  return (
    <Fragment>
      <Menu
        value={active}
        onChange={(v) => setActive(v)}
        logo={<img src="https://tdesign.gtimg.com/site/baseLogo-light.png" width="136" alt="logo" />}
        style={{ marginRight: 20 }}
      >
        <MenuItem value={'0'}>
          <span>仪表盘</span>
        </MenuItem>
        <MenuItem value={'1'}>
          <span>资源列表</span>
        </MenuItem>
        <MenuItem value={'2'}>
          <span>视频区</span>
        </MenuItem>
        <MenuItem value={'3'} disabled>
          <span>根目录</span>
        </MenuItem>
        <MenuItem value={'4'}>
          <span>调度平台</span>
        </MenuItem>
        <MenuItem value={'5'}>
          <span>精准监控</span>
        </MenuItem>
        <MenuItem value={'6'}>
          <span>个人中心</span>
        </MenuItem>
      </Menu>
      {/* 暗黑模式 */}
      <Menu
        value={darkActive}
        theme="dark"
        onChange={(v) => setDarkActive(v)}
        logo={<img src="https://tdesign.gtimg.com/site/baseLogo-dark.png" width="136" alt="logo" />}
      >
        <MenuItem value={'0'}>
          <span>仪表盘</span>
        </MenuItem>
        <MenuItem value={'1'}>
          <span>资源列表</span>
        </MenuItem>
        <MenuItem value={'2'}>
          <span>视频区</span>
        </MenuItem>
        <MenuItem value={'3'} disabled>
          <span>根目录</span>
        </MenuItem>
        <MenuItem value={'4'}>
          <span>调度平台</span>
        </MenuItem>
        <MenuItem value={'5'}>
          <span>精准监控</span>
        </MenuItem>
        <MenuItem value={'6'}>
          <span>个人中心</span>
        </MenuItem>
      </Menu>
    </Fragment>
  );
}

export default SingleSide;
