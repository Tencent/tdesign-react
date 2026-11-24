import React from 'react';
import { QRCode } from 'tdesign-mobile-react';

const value = 'https://tdesign.tencent.com/';

export default function QRCodeExample() {
  return (
    <div className="tdesign-demos-qrcode" style={{ display: 'flex', flexDirection: 'column' }}>
      <QRCode value={value} status="active" />

      <p className="tdesign-mobile-demo-block__summary">expired</p>
      <QRCode value={value} status="expired" onRefresh={() => console.log('Click Refresh')} />

      <p className="tdesign-mobile-demo-block__summary">loading</p>
      <QRCode value={value} status="loading" />

      <p className="tdesign-mobile-demo-block__summary">scanned</p>
      <QRCode value={value} status="scanned" />
    </div>
  );
}
