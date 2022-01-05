import React from 'react';
import { Layout } from 'tdesign-react';

const { Header, Content, Footer, Aside } = Layout;

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
        <Aside>Aside</Aside>
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
          <Aside>Aside</Aside>
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
          <Aside>Aside</Aside>
        </Layout>
      </Layout>

      <br />

      <Layout>
        <Header>Header</Header>
        <Layout>
          <Aside width={80}>Aside</Aside>
          <Layout>
            <Content>Content</Content>
            <Footer>Copyright @ 2019-2021 Tencent. All Rights Reserved</Footer>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
}
