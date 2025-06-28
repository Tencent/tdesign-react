import React from 'react';
import { QRCode, Space } from 'tdesign-react';

export default function QRCodeExample() {
  return (
    <Space>
      <QRCode type="canvas" value={'https://tdesign.tencent.com/'} bgColor="#fff" />
      <QRCode type="svg" value={'https://tdesign.tencent.com/'} bgColor="#fff" />
    </Space>
  );
}
