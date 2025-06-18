import React from 'react';
import { QRCode, Space } from 'tdesign-react';

export default function QRCodeExample() {
  return (
    <Space>
      <QRCode type="canvas" value={'https://tdesign.tencent.com/'} color="#00A873" />
      <QRCode type="svg" value={'https://tdesign.tencent.com/'} bgColor="#F6F8FB" color="#0A6CFF" />
    </Space>
  );
}
