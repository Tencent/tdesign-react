import React from 'react';
import { Row, Col } from '@tencent/tdesign-react';

export default function OrderGrid() {
  return (
    <>
      <p>align left</p>
      <Row justify="start">
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

      <p>align center</p>
      <Row justify="center">
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

      <p>align right</p>
      <Row justify="end">
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

      <p>space-between</p>
      <Row justify="space-between">
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

      <p>space-around</p>
      <Row justify="space-around">
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
