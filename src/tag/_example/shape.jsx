import React from 'react';
import { Tag } from '@tencent/tdesign-react';

export default function ShapeTagExample() {
  const style = { marginRight: 5 };
  return (
    <>
      <div style={{ width: '300px', display: 'flex', justifyContent: 'space-around' }}>
        <span>正常：</span>
        <Tag>标签一</Tag>
        <Tag theme="primary">标签一</Tag>
      </div>
      <div style={{ width: '300px', display: 'flex', justifyContent: 'space-around' }}>
        <span>圆角：</span>
        <Tag shape="round" style={style}>
          标签一
        </Tag>
        <Tag shape="round" theme="primary">
          标签一
        </Tag>
      </div>
      <div style={{ width: '300px', display: 'flex', justifyContent: 'space-around' }}>
        <span>标记：</span>
        <Tag shape="mark">标签一</Tag>
        <Tag shape="mark" theme="primary">
          标签一
        </Tag>
      </div>
    </>
  );
}
