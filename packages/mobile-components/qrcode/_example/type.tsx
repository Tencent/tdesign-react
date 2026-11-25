import React from 'react';
import { QRCode } from 'tdesign-mobile-react';

const value = 'https://tdesign.tencent.com/';

export default function QRCodeExample() {
  return (
    <div className="tdesign-demos-qrcode">
      <QRCode value={value} type="canvas" />
      <QRCode value={value} type="svg" />
    </div>
  );
}
