import React from 'react';
import { Tag, Space } from 'tdesign-react';

const { CheckTag } = Tag;

export default function Size() {
  return (
    <Space direction="vertical">
      <Space align="center">
        <Tag size="small">小型标签</Tag>
        <Tag size="medium">默认标签</Tag>
        <Tag size="large">大型标签</Tag>
      </Space>
      <Space align="center">
        <CheckTag size="small">小型标签</CheckTag>
        <CheckTag size="medium">默认标签</CheckTag>
        <CheckTag size="large">大型标签</CheckTag>
      </Space>
    </Space>
  );
}
