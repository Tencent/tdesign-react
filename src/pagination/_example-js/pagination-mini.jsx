import React, { useState } from 'react';
import { Radio, PaginationMini, Space } from 'tdesign-react';

export default function DemoPaginationMini() {
  const [layout, setLayout] = useState('vertical');
  const [size, setSize] = useState('medium');

  const tips = { prev: '前尘忆梦', current: '回到现在', next: '展望未来' };

  return (
    <Space direction="vertical" size={16}>
      <Space align="center">
        <span>layout:</span>
        <Radio.Group value={layout} onChange={setLayout} variant="default-filled">
          <Radio.Button value="vertical">vertical</Radio.Button>
          <Radio.Button value="horizontal">horizontal</Radio.Button>
        </Radio.Group>
      </Space>
      <Space align="center">
        <span>size:</span>
        <Radio.Group value={size} onChange={setSize} variant="default-filled">
          <Radio.Button value="small">small</Radio.Button>
          <Radio.Button value="medium">medium</Radio.Button>
          <Radio.Button value="large">large</Radio.Button>
        </Radio.Group>
      </Space>
      <PaginationMini layout={layout} size={size} tips={tips} />
    </Space>
  )
}
