import React from 'react';
import { Tag } from '@tencent/tdesign-react';

export default function ThemeTagExample() {
  return (
    <>
      <div>
        <span>默认：</span>
        <Tag theme="default">default</Tag>
      </div>
      <div>
        <span>深色：</span>
        <Tag theme="primary">primary</Tag>
        <Tag theme="info">info</Tag>
        <Tag theme="warning">warning</Tag>
        <Tag theme="danger" variant="dark">
          danger
        </Tag>
        <Tag theme="success" variant="dark">
          success
        </Tag>
      </div>

      <div>
        <span>浅色：</span>
        <Tag theme="primary" variant="light">
          primary
        </Tag>
        <Tag theme="info" variant="light">
          info
        </Tag>
        <Tag theme="warning" variant="light">
          warning
        </Tag>
        <Tag theme="danger" variant="light">
          danger
        </Tag>
        <Tag theme="success" variant="light">
          success
        </Tag>
      </div>

      <div>
        <span>朴素：</span>
        <Tag theme="primary" variant="plain">
          primary
        </Tag>
        <Tag theme="info" variant="plain">
          info
        </Tag>
        <Tag theme="warning" variant="plain">
          warning
        </Tag>
        <Tag theme="danger" variant="plain">
          danger
        </Tag>
        <Tag theme="success" variant="plain">
          success
        </Tag>
      </div>
    </>
  );
}
