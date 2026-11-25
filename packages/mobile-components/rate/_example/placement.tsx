import React from 'react';
import { Cell, CellGroup, Rate } from 'tdesign-mobile-react';

export default function Placement() {
  return (
    <CellGroup className="rate-demo__placement">
      <Cell title="顶部显示" style={{ overflow: 'initial' }}>
        <Rate defaultValue={0} placement="top" />
      </Cell>
      <Cell title="底部显示" style={{ overflow: 'initial' }}>
        <Rate defaultValue={0} placement="bottom" />
      </Cell>
      <Cell title="不显示" style={{ overflow: 'initial' }}>
        <Rate defaultValue={0} placement="" />
      </Cell>
    </CellGroup>
  );
}
