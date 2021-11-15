import React from 'react';
import { Row, Col } from 'tdesign-react';

export default function OrderGrid() {
  return (
    <>
      <Row>
        <Col flex={2}>
          <div>2 / 5</div>
        </Col>
        <Col flex={3}>
          <div>3 / 5</div>
        </Col>
      </Row>

      <Row>
        <Col flex="100px">
          <div>100px</div>
        </Col>
        <Col flex="auto">
          <div>Fill Rest</div>
        </Col>
      </Row>

      <Row>
        <Col flex="1 1 200px">
          <div>1 1 200px</div>
        </Col>
        <Col flex="0 1 300px">
          <div>0 1 300px</div>
        </Col>
      </Row>

      <Row>
        <Col flex="none">
          <div style={{ padding: '0 16px' }}>none</div>
        </Col>
        <Col flex="auto">
          <div>auto with no-wrap</div>
        </Col>
      </Row>
    </>
  );
}
