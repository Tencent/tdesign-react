import React, { useState } from 'react';
import { Popup, Button } from 'tdesign-mobile-react';

const placementList = [
  { value: 'top', text: '顶部弹出' },
  { value: 'left', text: '左侧弹出' },
  { value: 'center', text: '中间弹出' },
  { value: 'bottom', text: '底部弹出' },
  { value: 'right', text: '右侧弹出' },
] as const;

type PlacementValue = (typeof placementList)[number]['value'];

export default function Base() {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<PlacementValue>('top');
  const onClick = (value) => {
    setPlacement(value);
    setVisible(true);
  };
  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };
  return (
    <div style={{ padding: '0 16px' }}>
      {placementList.map((item) => (
        <Button
          key={item.value}
          block={true}
          variant="outline"
          theme="primary"
          size="large"
          onClick={() => onClick(item.value)}
          style={{ margin: '16px 0' }}
        >
          {item.text}
        </Button>
      ))}
      <Popup
        visible={visible}
        placement={placement}
        style={{ padding: '100px' }}
        onVisibleChange={handleVisibleChange}
      ></Popup>
    </div>
  );
}
