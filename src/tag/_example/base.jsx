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
        <Tag theme="danger" effect="dark">
          danger
        </Tag>
        <Tag theme="success" effect="dark">
          success
        </Tag>
      </div>

      <div>
        <span>浅色：</span>
        <Tag theme="primary" effect="light">
          primary
        </Tag>
        <Tag theme="info" effect="light">
          info
        </Tag>
        <Tag theme="warning" effect="light">
          warning
        </Tag>
        <Tag theme="danger" effect="light">
          danger
        </Tag>
        <Tag theme="success" effect="light">
          success
        </Tag>
      </div>

      <div>
        <span>朴素：</span>
        <Tag theme="primary" effect="plain">
          primary
        </Tag>
        <Tag theme="info" effect="plain">
          info
        </Tag>
        <Tag theme="warning" effect="plain">
          warning
        </Tag>
        <Tag theme="danger" effect="plain">
          danger
        </Tag>
        <Tag theme="success" effect="plain">
          success
        </Tag>
      </div>
    </>
  );
}
