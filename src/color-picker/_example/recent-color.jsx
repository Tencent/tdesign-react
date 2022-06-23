import React, { useState } from 'react';
import { ColorPickerPanel, Space } from 'tdesign-react';

export default function RecentColor() {
  const color = '#0052d9';
  const [recentColors, setRecentColors] = useState([
    'red',
    'green',
    'yellow',
    'blue',
    'purple',
    'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
    'linear-gradient(45deg, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)',
    'linear-gradient(120deg, #fcc5e4 0%, #fda34b 15%, #ff7882 35%, #c8699e 52%, #7046aa 71%, #0c1db8 87%, #020f75 100%)',
  ]);

  return (
    <Space>
      <div>
        <h6 style={{ marginBottom: 10 }}>预设最近使用色</h6>
        <ColorPickerPanel defaultValue={color} recentColors={recentColors} onRecentColorsChange={setRecentColors} />
      </div>
      <div>
        <h6 style={{ marginBottom: 10 }}>完全不显示最近使用色</h6>
        <ColorPickerPanel defaultValue={color} recentColors={null} />
      </div>
    </Space>
  );
}
