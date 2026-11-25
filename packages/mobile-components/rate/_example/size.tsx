import React from 'react';
import { Cell, CellGroup, Rate } from 'tdesign-mobile-react';

export default function Size() {
  return (
    <CellGroup className="rate-demo__size">
      <Cell title="大尺寸24" style={{ overflow: 'initial' }}>
        <Rate size="24" defaultValue={3} />
      </Cell>
      <Cell title="小尺寸20" style={{ overflow: 'initial' }}>
        <Rate size="20" defaultValue={3} />
      </Cell>
    </CellGroup>
  );
}
