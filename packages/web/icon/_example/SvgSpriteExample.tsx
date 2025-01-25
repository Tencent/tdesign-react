import React from 'react';
import { Space } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';

export default function SvgSpriteExample() {
  return (
    <Space direction="vertical">
      <Space break-line>
        <p>How do you feel today?</p>
        <Icon name="sneer" />
        <Icon name="unhappy" />
        <Icon name="excited" />
        <Icon name="surprised" />
        <Icon name="giggle" />
      </Space>
      <Space breakLine align="center">
        <p>What is your favourite food?</p>
        <Icon name="tangerinr" color="orange" />
        <Icon name="bamboo-shoot" color="green" />
        <Icon name="apple" color="red" />
        <Icon name="milk" color="#0052D9" />
        <Icon name="peach" color="pink" />
      </Space>
      <Space break-line>
        <p>How much icons does TDesign Icon includes?</p>
        <Icon name="numbers-1" style={{ color: 'var(--td-brand-color-5)' }} />
        <Icon name="numbers-2" style={{ color: 'var(--td-brand-color-6)' }} />
        <Icon name="numbers-0" style={{ color: 'var(--td-brand-color-7)' }} />
        <Icon name="numbers-3" style={{ color: 'var(--td-brand-color-8)' }} />
      </Space>
    </Space>
  );
}
