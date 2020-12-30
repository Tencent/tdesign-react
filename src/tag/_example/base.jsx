import React from 'react';
import { Tag } from '@tencent/tdesign-react';

export default function ThemeTagExample() {
  const style = { marginRight: 10, marginBottom: 10 };

  return (
    <>
      <div>
        <span>默认：</span>
        <Tag theme="default" style={style}>
          default
        </Tag>
      </div>
      <div>
        <span>深色：</span>
        <Tag theme="primary" style={style}>
          primary
        </Tag>
        <Tag theme="info" style={style}>
          info
        </Tag>
        <Tag theme="warning" style={style}>
          warning
        </Tag>
        <Tag theme="danger" effect="dark" style={style}>
          danger
        </Tag>
        <Tag theme="success" effect="dark" style={style}>
          success
        </Tag>
      </div>

      <div>
        <span>浅色：</span>
        <Tag theme="primary" effect="light" style={style}>
          primary
        </Tag>
        <Tag theme="info" effect="light" style={style}>
          info
        </Tag>
        <Tag theme="warning" effect="light" style={style}>
          warning
        </Tag>
        <Tag theme="danger" effect="light" style={style}>
          danger
        </Tag>
        <Tag theme="success" effect="light" style={style}>
          success
        </Tag>
      </div>

      <div>
        <span>朴素：</span>
        <Tag theme="primary" effect="plain" style={style}>
          primary
        </Tag>
        <Tag theme="info" effect="plain" style={style}>
          info
        </Tag>
        <Tag theme="warning" effect="plain" style={style}>
          warning
        </Tag>
        <Tag theme="danger" effect="plain" style={style}>
          danger
        </Tag>
        <Tag theme="success" effect="plain" style={style}>
          success
        </Tag>
      </div>
    </>
  );
}
