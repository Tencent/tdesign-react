import React, { useState } from 'react';
import { Button, Input, Popup, Space } from 'tdesign-react';

export default function PopperOptions() {
  const [offsetX, setOffsetX] = useState('0');
  const [offsetY, setOffsetY] = useState('0');

  return (
    <Space direction="vertical">
      <Space>
        <Space align="center">
          <span>请输入横向偏移量:</span>
          <Input
            placeholder="请输入横向偏移量"
            value={offsetX}
            onChange={(v) => setOffsetX(v)}
            style={{ width: '130px', display: 'inline-block' }}
          />
        </Space>
        <Space align="center">
          <span>请输入纵向偏移量:</span>
          <Input
            placeholder="请输入纵向偏移量"
            value={offsetY}
            onChange={(v) => setOffsetY(v)}
            style={{ width: '130px', display: 'inline-block' }}
          />
        </Space>
      </Space>
      <Space>
        <Popup
          trigger="hover"
          showArrow
          content="这是一个弹出框"
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [Number(offsetX), Number(offsetY)],
                },
              },
            ],
          }}
        >
          <Button>Hover me</Button>
        </Popup>
      </Space>
    </Space>
  );
}
