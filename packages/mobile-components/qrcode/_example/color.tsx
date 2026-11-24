import React from 'react';
import { QRCode } from 'tdesign-mobile-react';

const value = 'https://tdesign.tencent.com/';

export default function QRCodeExample() {
  return (
    <div className="tdesign-demos-qrcode" style={{ display: 'flex', flexDirection: 'column' }}>
      <QRCode value={value} color="#0052D9" bgColor="#fff" />

      <p className="tdesign-mobile-demo-block__summary">二维码背景颜色</p>
      <QRCode value={value} color="#0052D9" bgColor="#D9E1FF" />
    </div>
  );
}
