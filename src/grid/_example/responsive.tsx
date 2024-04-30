import React from 'react';
import { Row, Col, Space } from 'tdesign-react';

export default function OrderGrid() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <span>宽度响应式</span>
      <Row>
        <Col xs={2} sm={4} md={6} lg={8} xl={10}>
          <div>Col</div>
        </Col>
        <Col xs={10} sm={8} md={6} lg={4} xl={2}>
          <div>Col</div>
        </Col>
      </Row>

      <span>其他属性响应式（支持span，offset，order，pull，push）</span>
      <Row>
        <Col
          xs={{ offset: 0, span: 3 }}
          sm={{ offset: 2, span: 3 }}
          md={{ offset: 4, span: 3 }}
          g={{ offset: 6, span: 3 }}
          xl={{ offset: 8, span: 3 }}
        >
          <div>Col</div>
        </Col>
      </Row>
    </Space>
  );
}
