import React from 'react';
import { ColorPicker, Space } from 'tdesign-react';

export default function ColorMode() {
  const color1 = '#0052d9';
  const color2 = '#0052d9';
  const color3 = 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)';

  return (
    <Space breakLine>
      <div>
        <h5 style={{ marginBottom: 10, fontWeight: 'normal' }}>默认（单色 + 线性渐变）</h5>
        <ColorPicker defaultValue={color1} format="CSS" />
      </div>
      <div>
        <h5 style={{ marginBottom: 10, fontWeight: 'normal' }}>仅单色模式</h5>
        <ColorPicker defaultValue={color2} format="CSS" colorModes={['monochrome']} />
      </div>
      <div style={{ width: '100%' }}></div>
      <div>
        <h5 style={{ marginBottom: 10, fontWeight: 'normal' }}>仅线性渐变模式</h5>
        <ColorPicker defaultValue={color3} format="CSS" colorModes={['linear-gradient']} />
      </div>
    </Space>
  );
}
