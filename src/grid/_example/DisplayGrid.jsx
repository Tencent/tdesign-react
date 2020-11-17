import React from 'react';
import { Row, Col } from '@tencent/tdesign-react';

export default function OrderGrid() {
  return (
    <>
      <p>align left</p>
      <Row justify="start">
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
      </Row>

      <p>align center</p>
      <Row justify="center">
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
      </Row>

      <p>align right</p>
      <Row justify="end">
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
      </Row>

      <p>space-between</p>
      <Row justify="space-between">
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
      </Row>

      <p>space-around</p>
      <Row justify="space-around">
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
        <Col span={4}>
          <div>col-4</div>
        </Col>
      </Row>
    </>
  );
}
