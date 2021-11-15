import React from 'react';
import { Layout, Menu } from 'tdesign-react';

const { MenuItem } = Menu;

const Logo = () => <span>LOGO</span>;

function BasicUsage(props) {
  return (
    <Menu style={{ width: '100%', height: '100%', boxShadow: 'none' }} logo={<Logo />} {...props}>
      <MenuItem value="1">侧边内容一</MenuItem>
      <MenuItem value="2">侧边内容二</MenuItem>
      <MenuItem value="3">侧边内容三</MenuItem>
      <MenuItem value="4">侧边内容四</MenuItem>
      <MenuItem value="5">侧边内容无</MenuItem>
    </Menu>
  );
}

const { Header, Content, Footer, Sider } = Layout;

export default function BasicDivider() {
  return (
    <>
      <h4>组合导航布局</h4>
      <Layout>
        <Header>Header</Header>
        <Layout>
          <Sider>
            <BasicUsage />
          </Sider>
          <Layout>
            <Content>
              <div>Content</div>
            </Content>
            <Footer>Copyright @ 2019-2020 Tencent. All Rights Reserved</Footer>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}
