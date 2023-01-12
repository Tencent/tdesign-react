import React from 'react';
import { Tag, Space } from 'tdesign-react';

export default function ThemeTagExample() {
  return (
    <Space direction="vertical" size="large">
      <Space>
        <Tag theme="default">标签一</Tag>
        <a href="https://www.tencent.com/zh-cn" target="_blank" rel="noreferrer">
          <Tag>超链接</Tag>
        </a>
      </Space>
      <Space>
        <Tag theme="primary">标签一</Tag>
        <Tag theme="warning">标签二</Tag>
        <Tag theme="danger" variant="dark">
          标签三
        </Tag>
        <Tag theme="success" variant="dark">
          标签四
        </Tag>
      </Space>

      <Space>
        <Tag theme="primary" variant="light">
          标签一
        </Tag>
        <Tag theme="warning" variant="light">
          标签二
        </Tag>
        <Tag theme="danger" variant="light">
          标签三
        </Tag>
        <Tag theme="success" variant="light">
          标签四
        </Tag>
      </Space>

      <Space>
        <Tag theme="primary" variant="outline">
          标签一
        </Tag>
        <Tag theme="warning" variant="outline">
          标签二
        </Tag>
        <Tag theme="danger" variant="outline">
          标签三
        </Tag>
        <Tag theme="success" variant="outline">
          标签四
        </Tag>
      </Space>

      <Space>
        <Tag theme="primary" variant="light-outline">
          标签一
        </Tag>
        <Tag theme="warning" variant="light-outline">
          标签二
        </Tag>
        <Tag theme="danger" variant="light-outline">
          标签三
        </Tag>
        <Tag theme="success" variant="light-outline">
          标签四
        </Tag>
      </Space>
    </Space>
  );
}
