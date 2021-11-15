import React from 'react';
import { Row, Col } from 'tdesign-react';

export default function OrderGrid() {
  return (
    <>
      <p>align left</p>
      <Row justify="start">
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
      </Row>

      <p>align center</p>
      <Row justify="center">
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
      </Row>

      <p>align right</p>
      <Row justify="end">
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
      </Row>

      <p>space-between</p>
      <Row justify="space-between">
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
      </Row>

      <p>space-around</p>
      <Row justify="space-around">
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
        <Col span={2}>
          <div>col-2</div>
        </Col>
      </Row>
    </>
  );
}
