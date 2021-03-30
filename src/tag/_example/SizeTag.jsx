import React from 'react';
import { Tag } from '@tencent/tdesign-react';

export default function SizeTagExample() {
  const style = { marginRight: 5 };
  return (
    <>
      <Tag size="large" style={style}>
        large
      </Tag>
      <Tag size="medium" style={style}>
        middle
      </Tag>
      <Tag size="small" style={style}>
        small
      </Tag>
    </>
  );
}
