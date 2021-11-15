import React from 'react';
import { Row, Col } from 'tdesign-react';

export default function OrderGrid() {
  return (
    <>
      <p>align top</p>
      <Row justify="center" align="top">
        <Col span={3}>
          <div style={{ height: 80 }}>col-3</div>
        </Col>
        <Col span={3}>
          <div style={{ height: 40 }}>col-3</div>
        </Col>
        <Col span={3}>
          <div style={{ height: 80 }}>col-3</div>
        </Col>
        <Col span={3}>
          <div style={{ height: 40 }}>col-3</div>
        </Col>
      </Row>

      <p>Align Middle</p>
      <Row justify="space-around" align="middle">
        <Col span={3}>
          <div style={{ height: 80 }}>col-3</div>
        </Col>
        <Col span={3}>
          <div style={{ height: 40 }}>col-3</div>
        </Col>
        <Col span={3}>
          <div style={{ height: 80 }}>col-3</div>
        </Col>
        <Col span={3}>
          <div style={{ height: 40 }}>col-3</div>
        </Col>
      </Row>

      <p>Align Bottom</p>
      <Row justify="space-between" align="bottom">
        <Col span={3}>
          <div style={{ height: 80 }}>col-3</div>
        </Col>
        <Col span={3}>
          <div style={{ height: 40 }}>col-3</div>
        </Col>
        <Col span={3}>
          <div style={{ height: 80 }}>col-3</div>
        </Col>
        <Col span={3}>
          <div style={{ height: 40 }}>col-3</div>
        </Col>
      </Row>
    </>
  );
}
