import React, { useState } from 'react';
import { Space, Tag, ColorPicker } from 'tdesign-react';

export default function CustomColor() {
  const [selfDefinedColor, changeSelfDefinedColor] = useState('#0052D9');
  return (
    <Space direction="vertical">
      <Space>
        <ColorPicker colorModes={['monochrome']} value={selfDefinedColor} onChange={(v) => changeSelfDefinedColor(v)} />
      </Space>
      <Space>
        <Tag theme="primary" color={selfDefinedColor}>
          default
        </Tag>
        <Tag color={selfDefinedColor} variant="light">
          light
        </Tag>
        <Tag color={selfDefinedColor} variant="outline">
          outline
        </Tag>
        <Tag color={selfDefinedColor} variant="light-outline">
          light-outline
        </Tag>
      </Space>
    </Space>
  );
}
