import React, { useState } from 'react';
import { Radio, PaginationMini, Space } from 'tdesign-react';

import type { PaginationMiniProps } from 'tdesign-react';

type LayoutType = PaginationMiniProps['layout'];
type SizeType = PaginationMiniProps['size'];

export default function DemoPaginationMini() {
  const [layout, setLayout] = useState<LayoutType>('vertical');
  const [size, setSize] = useState<SizeType>('medium');

  const tips = { prev: '前尘忆梦', current: '回到现在', next: '展望未来' };

  return (
    <Space direction="vertical" size={16}>
      <Space align="center">
        <span>layout:</span>
        <Radio.Group value={layout} onChange={(val: LayoutType) => setLayout(val)} variant="default-filled">
          <Radio.Button value="vertical">vertical</Radio.Button>
          <Radio.Button value="horizontal">horizontal</Radio.Button>
        </Radio.Group>
      </Space>
      <Space align="center">
        <span>size:</span>
        <Radio.Group value={size} onChange={(val: SizeType) => setSize(val)} variant="default-filled">
          <Radio.Button value="small">small</Radio.Button>
          <Radio.Button value="medium">medium</Radio.Button>
          <Radio.Button value="large">large</Radio.Button>
        </Radio.Group>
      </Space>
      <PaginationMini layout={layout} size={size} tips={tips} />
    </Space>
  );
}
