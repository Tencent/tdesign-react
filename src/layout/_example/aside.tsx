import React from 'react';
import { Layout, Menu } from 'tdesign-react';

const { Content, Footer, Aside } = Layout;
const { MenuItem } = Menu;

const Logo = () => <img width="136" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo" />;

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

export default function BasicDivider() {
  return (
    <>
      <h4>侧边导航布局</h4>
      <Layout>
        <Aside>
          <BasicUsage />
        </Aside>
        <Layout>
          <Content>
            <div>Content</div>
          </Content>
          <Footer>Copyright @ 2019-2020 Tencent. All Rights Reserved</Footer>
        </Layout>
      </Layout>
    </>
  );
}
