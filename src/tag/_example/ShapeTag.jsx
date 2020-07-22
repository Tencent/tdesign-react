import React from 'react';
import { Tag } from '../index';

export default function ShapeTagExample() {
  const style = { marginRight: 5 };
  return (
    <>
      <Tag shape="mark" style={style}>
        mark
      </Tag>
      <Tag shape="round" style={style}>
        round
      </Tag>
      <Tag shape="square" style={style}>
        square
      </Tag>
    </>
  );
}
