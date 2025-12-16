import React, { useState } from 'react';
import { Button, InputNumber, Popup, Space } from 'tdesign-react';

export default function PopperOptions() {
  const [offsetX, setOffsetX] = useState(30);
  const [offsetY, setOffsetY] = useState(10);

  return (
    <Space direction="vertical">
      <Space align="center">
        <Space align="center">
          <span>横向偏移量:</span>
          <InputNumber
            size="small"
            placeholder="请输入横向偏移量"
            value={offsetX}
            onChange={(v) => setOffsetX(v as number)}
            style={{ width: '130px', display: 'inline-block' }}
          />
        </Space>
        <Space align="center">
          <span>纵向偏移量:</span>
          <InputNumber
            size="small"
            placeholder="请输入纵向偏移量"
            value={offsetY}
            onChange={(v) => setOffsetY(v as number)}
            style={{ width: '130px', display: 'inline-block' }}
          />
        </Space>
      </Space>
      <Space>
        <Popup
          showArrow
          placement="bottom"
          content="这是一个弹出框"
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [Number(offsetX), Number(offsetY)],
                },
              },
              {
                name: 'arrow',
                // enabled: false, // 默认箭头始终指向参考系的中心，可通过该配置项禁用
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
