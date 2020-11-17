import React from 'react';
import { Row, Col } from '@tencent/tdesign-react';

export default function OrderGrid() {
  return (
    <Row>
      <Col xs={2} sm={4} md={6} lg={8} xl={10}>
        <div>Col</div>
      </Col>
      <Col xs={20} sm={16} md={12} lg={8} xl={4}>
        <div>Col</div>
      </Col>
      <Col xs={2} sm={4} md={6} lg={8} xl={10}>
        <div>Col</div>
      </Col>
    </Row>
  );
}
