import React from 'react';
import { Row, Col } from 'tdesign-react';

export default function OffsetGrid() {
  return (
    <>
      <Row>
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4} offset={4}>
          <div>col-4</div>
        </Col>
      </Row>
      <Row>
        <Col span={3} offset={3}>
          <div>col-3 col-offset-3</div>
        </Col>
        <Col span={3} offset={3}>
          <div>col-3 col-offset-3</div>
        </Col>
      </Row>
      <Row>
        <Col span={6} offset={2}>
          <div>col-6 col-offset-2</div>
        </Col>
      </Row>
    </>
  );
}
