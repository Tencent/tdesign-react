import React from 'react';
import { Empty, Row, Col } from 'tdesign-react';

export default function StatusExample() {
  return (
    <Row gutter={40}>
      <Col>
        <Empty type="empty" />
      </Col>
      <Col>
        <Empty type="maintenance" />
      </Col>
      <Col>
        <Empty type="network-error" />
      </Col>
      <Col>
        <Empty type="success" />
      </Col>
      <Col>
        <Empty type="fail" />
      </Col>
    </Row>
  );
}
