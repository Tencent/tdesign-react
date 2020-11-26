import React from 'react';
import { Row, Col } from '@tencent/tdesign-react';

export default function PullPushGrid() {
  return (
    <>
      <Row>
        <Col span={18} push={6}>
          <div>col-18 col-push-6</div>
        </Col>
        <Col span={6} pull={18}>
          <div>col-6 col-pull-18</div>
        </Col>
      </Row>
      <Row>
        <Col span={16} push={8}>
          <div>col-16 col-push-8</div>
        </Col>
        <Col span={8} pull={16}>
          <div>col-8 col-pull-16</div>
        </Col>
      </Row>
    </>
  );
}
