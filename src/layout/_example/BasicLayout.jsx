import React from 'react';
import { Layout, Menu, MenuItem } from '@tencent/tdesign-react';

const Logo = (props) => (
  <img {...props} src="https://main.qcloudimg.com/raw/9fe1217de2bd7eb623f70648a046e341/head-logo.png" alt="logo" />
);

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

const { Header, Content, Footer, Sider } = Layout;

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

      <br />

      <h4>侧边导航布局</h4>
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

      <br />

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

      <br />

      <Layout>
        <Header>Header</Header>
        <Layout>
          <Layout>
            <Content>
              <div>Content</div>
            </Content>
            <Footer>Copyright @ 2019-2020 Tencent. All Rights Reserved</Footer>
          </Layout>
          <Sider>
            <BasicUsage />
          </Sider>
        </Layout>
      </Layout>

      <br />

      <Layout>
        <Header>Header</Header>
        <Layout>
          <Sider width={80}>
            <BasicUsage collapsed={true} />
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
