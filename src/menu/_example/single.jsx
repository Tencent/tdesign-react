// @ts-nocheck
import React, { Fragment, useState } from 'react';
import { Menu, MessagePlugin, Button } from 'tdesign-react';
import { UserAddIcon, AppIcon, CallIcon, SearchIcon, MailIcon, UserIcon, EllipsisIcon } from 'tdesign-icons-react';

const { HeadMenu, MenuItem } = Menu;

function Single() {
  const [active, setActive] = useState('0');
  const [darkActive, setDarkActive] = useState('1');

  const operations = () => (
    <div className="tdesign-demo-menu__operations">
      <Button variant="text" shape="square" icon={<SearchIcon />} />
      <Button variant="text" shape="square" icon={<MailIcon />} />
      <Button variant="text" shape="square" icon={<UserIcon />} />
      <Button variant="text" shape="square" icon={<EllipsisIcon />} />
    </div>
  );

  const operationsDark = () => (
    <div className="tdesign-demo-menu__operations--dark">
      <Button variant="text" shape="square" icon={<SearchIcon />} />
      <Button variant="text" shape="square" icon={<MailIcon />} />
      <Button variant="text" shape="square" icon={<UserIcon />} />
      <Button variant="text" shape="square" icon={<EllipsisIcon />} />
    </div>
  );

  return (
    <Fragment>
      <HeadMenu
        theme="light"
        value={active}
        onChange={(v) => setActive(v)}
        logo={<img src="https://tdesign.gtimg.com/site/baseLogo-light.png" width="136" alt="logo" />}
        operations={operations()}
        style={{ marginBottom: 20 }}
      >
        <MenuItem value={'0'} onClick={() => MessagePlugin.info('click 菜单1')}>
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
      </HeadMenu>
      {/* 暗黑模式 */}
      <HeadMenu
        theme="dark"
        value={darkActive}
        onChange={(v) => setDarkActive(v)}
        logo={<img src="https://tdesign.gtimg.com/site/baseLogo-dark.png" width="136" alt="logo" />}
        operations={operationsDark()}
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
      </HeadMenu>
    </Fragment>
  );
}

export default Single;
