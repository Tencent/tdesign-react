import React from 'react';
import { Tag } from '@tencent/tdesign-react';

export default function Size() {
  const style = { marginRight: 30 };
  return (
    <>
      <Tag size="small" style={style}>
        小型标签
      </Tag>
      <Tag size="medium" style={style}>
        默认标签
      </Tag>
      <Tag size="large" style={style}>
        大型标签
      </Tag>
    </>
  );
}
