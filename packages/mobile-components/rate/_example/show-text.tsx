import React from 'react';
import { Cell, CellGroup, Rate } from 'tdesign-mobile-react';

export default function ShowText() {
  return (
    <CellGroup className="rate-demo__show-text">
      <Cell title="带描述评分" style={{ overflow: 'initial' }}>
        <Rate defaultValue={1} showText={true} texts={['很差', '差', '一般', '好评', '优秀']} />
      </Cell>
      <Cell title="带描述评分" style={{ overflow: 'initial' }}>
        <Rate defaultValue={5} showText={true} />
      </Cell>
      <Cell title="带描述评分" style={{ overflow: 'initial' }}>
        <Rate defaultValue={0} showText={true} />
      </Cell>
    </CellGroup>
  );
}
