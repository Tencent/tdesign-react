import React from 'react';
import { Layout } from '@tencent/tdesign-react';

const { Header, Content, Footer, Sider } = Layout;

export default function BasicDivider() {
  return (
    <>
      <Layout>
        <Header>Header</Header>
        <Content>
          <div>Content</div>
        </Content>
        <Footer>Copyright @ 2019-2020 Tencent. All Rights Reserved</Footer>
      </Layout>

      <br />

      <Layout>
        <Header>Header</Header>
        <Layout>
          <Sider>
            <h2 className="logo">LOGO</h2>
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
            <h2 className="logo">LOGO</h2>
          </Sider>
        </Layout>
      </Layout>

      <br />

      <Layout>
        <Sider>
          <h2 className="logo">LOGO</h2>
        </Sider>
        <Layout>
          <Content>
            <div>Content</div>
          </Content>
          <Footer>Copyright @ 2019-2020 Tencent. All Rights Reserved</Footer>
        </Layout>
      </Layout>

      <br />

      <Layout>
        <Header>Header</Header>
        <Layout>
          <Sider width={80}>
            <h2 className="logo">LOGO</h2>
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
