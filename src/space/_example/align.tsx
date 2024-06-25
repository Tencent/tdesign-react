import React from 'react';
import { Space, Button } from 'tdesign-react';

const BaseSpace = () => (
  <Space breakLine>
    <Space align="start" style={{ padding: 12, border: '1px dashed var(--td-component-stroke)' }}>
      <div>start</div>
      <Button>Button</Button>
      <div style={{ background: 'var(--td-bg-color-component)', height: 60, width: 60 }}></div>
    </Space>
    <Space align="center" style={{ padding: 12, border: '1px dashed var(--td-component-stroke)' }}>
      <div>center</div>
      <Button>Button</Button>
      <div style={{ background: 'var(--td-bg-color-component)', height: 60, width: 60 }}></div>
    </Space>
    <Space align="end" style={{ padding: 12, border: '1px dashed var(--td-component-stroke)' }}>
      <div>end</div>
      <Button>Button</Button>
      <div style={{ background: 'var(--td-bg-color-component)', height: 60, width: 60 }}></div>
    </Space>
    <Space align="baseline" style={{ padding: 12, border: '1px dashed var(--td-component-stroke)' }}>
      <div>baseline</div>
      <Button>Button</Button>
      <div style={{ background: 'var(--td-bg-color-component)', height: 60, width: 60 }}></div>
    </Space>
  </Space>
);

export default BaseSpace;
