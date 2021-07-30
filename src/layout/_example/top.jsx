import React from 'react';
import { Layout, Menu } from '@tencent/tdesign-react';

const { MenuItem } = Menu;

const Logo = () => <span>LOGO</span>;

function BasicUsage(props) {
  return (
    <Menu style={{ width: '100%', height: '100%', boxShadow: 'none' }} logo={<Logo />} {...props}>
      <MenuItem name="1">侧边内容一</MenuItem>
      <MenuItem name="2">侧边内容二</MenuItem>
      <MenuItem name="3">侧边内容三</MenuItem>
      <MenuItem name="4">侧边内容四</MenuItem>
      <MenuItem name="5">侧边内容无</MenuItem>
    </Menu>
  );
}

const { Header, Content, Footer } = Layout;

export default function BasicDivider() {
  return (
    <>
      <h4>顶部导航布局</h4>
      <Layout>
        <Header>Header</Header>
        <Content>
          <div>Content</div>
        </Content>
        <Footer>Copyright @ 2019-2020 Tencent. All Rights Reserved</Footer>
      </Layout>
    </>
  );
}
