import React from 'react';
import { Tag } from 'tdesign-react';

export default function Size() {
  const style = { marginRight: 30 };
  return (
    <div className="tdesign-demo-block-row">
      <Tag size="small" style={style}>
        小型标签
      </Tag>
      <Tag size="medium" style={style}>
        默认标签
      </Tag>
      <Tag size="large" style={style}>
        大型标签
      </Tag>
    </div>
  );
}
