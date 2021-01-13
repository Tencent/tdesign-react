import React from 'react';
import { Tag, Icon } from '@tencent/tdesign-react';

export default function ThemeTagExample() {
  return (
    <>
      <Tag icon="call" theme="default">
        default
      </Tag>
      <Tag icon="print" theme="primary">
        primary
      </Tag>
      <Tag icon={<Icon name="logo-github" />} theme="info">
        info
      </Tag>
    </>
  );
}
