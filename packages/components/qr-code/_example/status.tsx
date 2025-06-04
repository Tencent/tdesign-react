import React from 'react';
import { QRCode, Space } from 'tdesign-react';

const value = 'https://tdesign.tencent.com/';
export default function QRCodeExample() {
  return (
    <Space>
      <QRCode value={value} status="loading" />
      <QRCode value={value} status="expired" onRefresh={() => console.log('refresh')} />
      <QRCode value={value} status="scanned" />
    </Space>
  );
}
