import React from 'react';
import { Layout } from '@tencent/tdesign-react';

const { Header, Content, Footer, Sider } = Layout;

export default function BasicDivider() {
  return (
    <>
      <h4>顶部导航布局</h4>
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Copyright @ 2019-2021 Tencent. All Rights Reserved</Footer>
      </Layout>

      <br />

      <h4>侧边导航布局</h4>
      <Layout>
        <Sider>Aside</Sider>
        <Layout>
          <Content>Content</Content>
          <Footer>Copyright @ 2019-2021 Tencent. All Rights Reserved</Footer>
        </Layout>
      </Layout>

      <br />

      <h4>组合导航布局</h4>
      <Layout>
        <Header>Header</Header>
        <Layout>
          <Sider>Aside</Sider>
          <Layout>
            <Content>Content</Content>
            <Footer>Copyright @ 2019-2021 Tencent. All Rights Reserved</Footer>
          </Layout>
        </Layout>
      </Layout>

      <br />

      <Layout>
        <Header>Header</Header>
        <Layout>
          <Layout>
            <Content>Content</Content>
            <Footer>Copyright @ 2019-2021 Tencent. All Rights Reserved</Footer>
          </Layout>
          <Sider>Aside</Sider>
        </Layout>
      </Layout>

      <br />

      <Layout>
        <Header>Header</Header>
        <Layout>
          <Sider width={80}>Aside</Sider>
          <Layout>
            <Content>Content</Content>
            <Footer>Copyright @ 2019-2021 Tencent. All Rights Reserved</Footer>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}
