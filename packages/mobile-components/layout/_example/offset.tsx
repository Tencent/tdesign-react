import React from 'react';
import { Col, Row } from 'tdesign-mobile-react';

export default function () {
  return (
    <div className="tdesign-mobile-demo">
      <Row gutter="16">
        <Col span="8">
          <div className="dark">col-8</div>
        </Col>
        <Col span="8">
          <div className="light">col-8</div>
        </Col>
        <Col span="8">
          <div className="dark">col-8</div>
        </Col>
      </Row>
    </div>
  );
}
