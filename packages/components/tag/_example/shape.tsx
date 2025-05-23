import React from 'react';
import { Tag, Space } from 'tdesign-react';

export default function ShapeTagExample() {
  const style = { marginRight: 5 };
  return (
    <Space direction="vertical">
      <Space>
        <Tag>标签一</Tag>
        <Tag theme="primary">标签一</Tag>
      </Space>
      <Space>
        <Tag shape="round" style={style}>
          标签一
        </Tag>
        <Tag shape="round" theme="primary">
          标签一
        </Tag>
      </Space>
      <Space>
        <Tag shape="mark">标签一</Tag>
        <Tag shape="mark" theme="primary">
          标签一
        </Tag>
      </Space>
    </Space>
  );
}
