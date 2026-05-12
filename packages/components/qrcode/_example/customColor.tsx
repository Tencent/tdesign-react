import React from 'react';
import { QRCode, Space } from 'tdesign-react';

export default function QRCodeExample() {
  return (
    <Space>
      <QRCode type="canvas" value={'https://tdesign.tencent.com/'} color="#0052D9" bgColor="#fff" />
      <QRCode type="svg" value={'https://tdesign.tencent.com/'} bgColor="#D9E1FF" color="#0052D9" />
    </Space>
  );
}
