import React from 'react';
import { Row, Col } from 'tdesign-react';

export default function SpaceGrid() {
  return (
    <>
      <Row gutter={16}>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
      </Row>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32, xl: 32, xxl: 40 }}>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
      </Row>

      <Row gutter={[16, 24]}>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
        <Col span={3}>
          <div>col-3</div>
        </Col>
      </Row>
    </>
  );
}
