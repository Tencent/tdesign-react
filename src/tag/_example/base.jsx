import React from 'react';
import { Tag } from 'tdesign-react';

export default function ThemeTagExample() {
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <Tag theme="default">标签一</Tag>
        <a href="https://www.tencent.com/zh-cn" target="_blank" rel="noreferrer">
          <Tag>超链接</Tag>
        </a>
      </div>
      <div className="tdesign-demo-block-row">
        <Tag theme="primary">标签一</Tag>
        <Tag theme="warning">标签二</Tag>
        <Tag theme="danger" variant="dark">
          标签三
        </Tag>
        <Tag theme="success" variant="dark">
          标签四
        </Tag>
      </div>

      <div className="tdesign-demo-block-row">
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
      </div>

      <div className="tdesign-demo-block-row">
        <Tag theme="primary" variant="plain">
          标签一
        </Tag>
        <Tag theme="warning" variant="plain">
          标签二
        </Tag>
        <Tag theme="danger" variant="plain">
          标签三
        </Tag>
        <Tag theme="success" variant="plain">
          标签四
        </Tag>
      </div>
    </div>
  );
}
