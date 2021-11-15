import React from 'react';
import { Layout, Menu } from 'tdesign-react';

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
