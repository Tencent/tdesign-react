import React from 'react';
import { Tag } from 'tdesign-react';

export default function ShapeTagExample() {
  const style = { marginRight: 5 };
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <Tag>标签一</Tag>
        <Tag theme="primary">标签一</Tag>
      </div>
      <div className="tdesign-demo-block-row">
        <Tag shape="round" style={style}>
          标签一
        </Tag>
        <Tag shape="round" theme="primary">
          标签一
        </Tag>
      </div>
      <div className="tdesign-demo-block-row">
        <Tag shape="mark">标签一</Tag>
        <Tag shape="mark" theme="primary">
          标签一
        </Tag>
      </div>
    </div>
  );
}
