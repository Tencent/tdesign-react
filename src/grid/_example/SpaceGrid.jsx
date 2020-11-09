import React from 'react';
import { Row, Col } from '@tencent/tdesign-react';

export default function SpaceGrid() {
  return (
    <>
      <Row gutter={16}>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
      </Row>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32, xl: 32, xxl: 40 }}>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
      </Row>

      <Row gutter={[16, 24]}>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
        <Col span={6}>
          <div>col-6</div>
        </Col>
      </Row>
    </>
  );
}
