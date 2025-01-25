import React from 'react';
import { Space } from 'tdesign-react';
import { IconFont } from 'tdesign-icons-react';

export default function SvgSpriteExample() {
  return (
    <Space direction="vertical">
      <Space break-line>
        <p>How do you feel today?</p>
        <IconFont name="sneer" />
        <IconFont name="unhappy" />
        <IconFont name="excited" />
        <IconFont name="surprised" />
        <IconFont name="giggle" />
      </Space>
      <Space breakLine align="center">
        <p>What is your favourite food?</p>
        <IconFont name="tangerinr" style={{ color: 'orange' }} />
        <IconFont name="bamboo-shoot" style={{ color: 'green' }} />
        <IconFont name="apple" style={{ color: 'red' }} />
        <IconFont name="milk" style={{ color: '#0052D9' }} />
        <IconFont name="peach" style={{ color: 'pink' }} />
      </Space>
      <Space break-line>
        <p>How much icons does TDesign Icon includes?</p>
        <IconFont name="numbers-1" style={{ color: 'var(--td-brand-color-5)' }} />
        <IconFont name="numbers-2" style={{ color: 'var(--td-brand-color-6)' }} />
        <IconFont name="numbers-0" style={{ color: 'var(--td-brand-color-7)' }} />
        <IconFont name="numbers-3" style={{ color: 'var(--td-brand-color-8)' }} />
      </Space>
    </Space>
  );
}
