import React from 'react';
import { Row, Col } from 'tdesign-react';

export default function OrderGrid() {
  return (
    <Row>
      <Col xs={2} sm={4} md={6} lg={8} xl={10}>
        <div>Col</div>
      </Col>
      <Col xs={10} sm={8} md={6} lg={4} xl={2}>
        <div>Col</div>
      </Col>
    </Row>
  );
}
