import React from 'react';
import { Row, Col } from 'tdesign-react';

export default function OrderGrid() {
  return (
    <>
      <Row>通过 `order` 来改变元素的排序。</Row>
      <Row>
        <Col span={3} order={4}>
          <div>1 col-order-4</div>
        </Col>
        <Col span={3} order={3}>
          <div>2 col-order-3</div>
        </Col>
        <Col span={3} order={2}>
          <div>3 col-order-2</div>
        </Col>
        <Col span={3} order={1}>
          <div>4 col-order-1</div>
        </Col>
      </Row>
      <Row>
        <Col span={3} xs={{ order: 1 }} sm={{ order: 2 }} md={{ order: 3 }} lg={{ order: 4 }}>
          <div>1 col-order-responsive</div>
        </Col>
        <Col span={3} xs={{ order: 2 }} sm={{ order: 1 }} md={{ order: 4 }} lg={{ order: 3 }}>
          <div>2 col-order-responsive</div>
        </Col>
        <Col span={3} xs={{ order: 3 }} sm={{ order: 4 }} md={{ order: 2 }} lg={{ order: 1 }}>
          <div>3 col-order-responsive</div>
        </Col>
        <Col span={3} xs={{ order: 4 }} sm={{ order: 3 }} md={{ order: 1 }} lg={{ order: 2 }}>
          <div>4 col-order-responsive</div>
        </Col>
      </Row>
    </>
  );
}
