import React from 'react';
import { Textarea } from 'tdesign-mobile-react';

export default function Layout() {
  return (
    <Textarea
      style={{ height: '162px' }}
      label="标签文字"
      placeholder="预设长文本预设长文本"
      maxlength={500}
      indicator
      layout="vertical"
    />
  );
}
