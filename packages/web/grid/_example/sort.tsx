import React from 'react';
import { Row, Col } from 'tdesign-react';

export default function PullPushGrid() {
  return (
    <>
      <Row>通过 `pull` `push` 进行排序</Row>
      <Row>
        <Col span={9} push={3}>
          <div>col-9 col-push-3</div>
        </Col>
        <Col span={3} pull={9}>
          <div>col-3 col-pull-9</div>
        </Col>
      </Row>
      <Row>
        <Col span={8} push={4}>
          <div>col-8 col-push-4</div>
        </Col>
        <Col span={4} pull={8}>
          <div>col-4 col-pull-8</div>
        </Col>
      </Row>
    </>
  );
}
