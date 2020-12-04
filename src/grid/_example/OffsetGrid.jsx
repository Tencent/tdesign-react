import React from 'react';
import { Row, Col } from '@tencent/tdesign-react';

export default function OffsetGrid() {
  return (
    <>
      <Row>
        <Col span={8}>
          <div>col-8</div>
        </Col>
        <Col span={8} offset={8}>
          <div>col-8</div>
        </Col>
      </Row>
      <Row>
        <Col span={6} offset={6}>
          <div>col-6 col-offset-6</div>
        </Col>
        <Col span={6} offset={6}>
          <div>col-6 col-offset-6</div>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
          <div>col-12 col-offset-6</div>
        </Col>
      </Row>
    </>
  );
}
