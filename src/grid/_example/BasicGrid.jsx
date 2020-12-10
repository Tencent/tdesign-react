import React from 'react';
import { Row, Col } from '@tencent/tdesign-react';

const demoCols = [
  Array(24).fill(1),
  Array(12).fill(2),
  Array(8).fill(3),
  Array(6).fill(4),
  Array(4).fill(6),
  Array(3).fill(8),
  Array(2).fill(12),
  Array(1).fill(24),
];

export default function BasicGrid() {
  return (
    <>
      {demoCols.map((cols, i) => (
        <Row key={i}>
          {cols.map((col, j) => (
            <Col span={col} key={j}>
              <div>{col}</div>
            </Col>
          ))}
        </Row>
      ))}
    </>
  );
}
