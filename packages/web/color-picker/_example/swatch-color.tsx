import React from 'react';
import { ColorPickerPanel, Space } from 'tdesign-react';

export default function SwatchColor() {
  const color = '#0052d9';
  const systemColors = ['red', 'green', 'yellow', 'blue', 'purple'];

  return (
    <Space>
      <div>
        <h6 style={{ marginBottom: 10 }}>自定义系统色</h6>
        <ColorPickerPanel defaultValue={color} swatchColors={systemColors} />
      </div>
      <div>
        <h6 style={{ marginBottom: 10 }}>完全不显示系统色</h6>
        <ColorPickerPanel defaultValue={color} swatchColors={null} />
      </div>
    </Space>
  );
}
