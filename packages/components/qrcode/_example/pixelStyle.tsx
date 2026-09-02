import React, { useState } from 'react';
import { QRCode, Radio, Slider, Space } from 'tdesign-react';

import type { QRCodePixelShape } from '../type';

const SHAPES: QRCodePixelShape[] = ['square', 'mini-square', 'rounded', 'dot'];

export default function QRCodeExample() {
  const [shape, setShape] = useState<QRCodePixelShape>('mini-square');
  const [scale, setScale] = useState<number>(75);

  // `scale` only affects `mini-square` and `dot`; disable the slider otherwise.
  const scaleDisabled = shape === 'square' || shape === 'rounded';

  return (
    <Space direction="vertical">
      <Radio.Group
        theme="button"
        value={shape}
        onChange={(val: QRCodePixelShape) => setShape(val)}
        variant="primary-filled"
      >
        {SHAPES.map((s) => (
          <Radio.Button key={s} value={s}>
            {s}
          </Radio.Button>
        ))}
      </Radio.Group>

      <Slider<number>
        label={`${scale}%`}
        disabled={scaleDisabled}
        max={100}
        min={1}
        style={{ width: 240 }}
        value={scale}
        onChange={setScale}
      />

      <QRCode type="canvas" value="https://tdesign.tencent.com/" pixelStyle={{ shape, scale }} />
    </Space>
  );
}
