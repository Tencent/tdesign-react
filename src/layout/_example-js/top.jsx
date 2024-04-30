import React from 'react';
import { Layout, Menu } from 'tdesign-react';
import {
  SearchIcon,
  NotificationFilledIcon,
  HomeIcon,
} from 'tdesign-icons-react';

const { Header, Content, Footer } = Layout;
const { HeadMenu, MenuItem } = Menu;

export default function BasicDivider() {
  return (
    <Layout>
      <Header>
        <HeadMenu
          value="item1"
          logo={<img width="136" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo" />}
          operations={
            <div className="t-menu__operations">
              <SearchIcon className="t-menu__operations-icon" />
              <NotificationFilledIcon className="t-menu__operations-icon" />
              <HomeIcon className="t-menu__operations-icon" />
            </div>
          }
        >
          <MenuItem value="item1">已选内容</MenuItem>
          <MenuItem value="item2">菜单内容一</MenuItem>
          <MenuItem value="item3">菜单内容二</MenuItem>
          <MenuItem value="item4" disabled>
            菜单内容三
          </MenuItem>
        </HeadMenu>
      </Header>
      <Content>
        <div>Content</div>
      </Content>
      <Footer>Copyright @ 2019-2020 Tencent. All Rights Reserved</Footer>
    </Layout>
  );
}
