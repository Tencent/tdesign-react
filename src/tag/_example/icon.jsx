import React from 'react';
import { Tag, PrintIcon, CallIcon, LogoGithubIcon } from '@tencent/tdesign-react';

export default function ThemeTagExample() {
  return (
    <>
      <Tag icon={<CallIcon />} theme="default">
        default
      </Tag>
      <Tag icon={<PrintIcon />} theme="primary">
        primary
      </Tag>
      <Tag icon={<LogoGithubIcon />} theme="info">
        info
      </Tag>
    </>
  );
}
